using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using Xunit;

namespace Lab2.Tests;

public class StoreTests {

	private readonly Mock<IFlags> flagsMock;
	private readonly Mock<IDatabase> databaseMock;
	private readonly Mock<ICurrencyExchange> currencyExchangeMock;
	private readonly IList<History> histories;
	private readonly IList<Item> items;

	public StoreTests() {
		flagsMock = new Mock<IFlags>();
		flagsMock.Setup(x => x.GetCountryFlag(It.IsAny<string>())).Returns("flag url");
		
		currencyExchangeMock = new Mock<ICurrencyExchange>();
		currencyExchangeMock.Setup(x => x.GetCurrencyRate("USD", "UAH")).Returns(31.5m);

		histories = new List<History>();
		items = new List<Item>();
		databaseMock = new Mock<IDatabase>();
		databaseMock.Setup(x => x.History).Returns(histories);
		databaseMock.Setup(x => x.Items).Returns(items);
		
	}

	private Store CreateStore() => new Store(currencyExchangeMock.Object, databaseMock.Object, flagsMock.Object);

	private User CreateUser()
		=> new User(databaseMock.Object) {
			Account = new Account() {
				Balance = 500m,
				Currency = "UAH"
			},
			Country = "Ukraine",
			Id = 1
		};

	private Item CreateItem1()
		=> new Item() {
			Currency = "UAH",
			Name = "Phone",
			Price = 5m
		};

	private Item CreateItem2()
		=> new Item() {
			Currency = "USD",
			Name = "Computer",
			Price = 9m
		};
	
	[Fact]
	public void GetCountryFlagByUser_Succeeds() {
		Store store = CreateStore();
		User user = CreateUser();

		string flagResult = store.GetCountryFlagByUser(user);
		
		flagsMock.Verify(x => x.GetCountryFlag(user.Country), Times.Once);
		Assert.Equal("flag url", flagResult);
	}

	[Fact]
	public void GetItems_Succeeds() {
		Store store = CreateStore();
		Item item = CreateItem1();
		items.Add(item);


		var itemsResult = store.GetItems();
		databaseMock.Verify(x => x.Items, Times.Once);
		Assert.StrictEqual(items, itemsResult);
	}

	[Fact]
	public void AddItem_Succeeds() {
		Store store = CreateStore();
		Item item = CreateItem1();
		Assert.Empty(items);
		
		store.AddItem(item);
		databaseMock.Verify(x => x.Items, Times.Once);
		Assert.Collection(items, item1 => Assert.Equal(item, item1));
	}

	[Fact]
	public void RemoveItem_Succeeds() {
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();

		Assert.Empty(items);
		items.Add(item1);
		items.Add(item2);
		Assert.Collection(items, 
			x1 => Assert.Equal(item1, x1),
			x2 => Assert.Equal(item2, x2));
		
		store.RemoveItem(item1);
		
		databaseMock.Verify(x => x.Items, Times.Exactly(1));
		Assert.Collection(items, x2 => Assert.Equal(item2, x2));
		Assert.Single(items);
	}

	[Fact]
	public void Purchase_Succeeds_WhenPurchasingSingleItem() {
		User user = CreateUser();
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item1);
		items.Add(item2);
		
		store.Purchase(user, new List<Item> {item1});
		
		currencyExchangeMock.Verify(x => x.GetCurrencyRate(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
		databaseMock.Verify(x => x.Items, Times.Exactly(2));
		databaseMock.Verify(x => x.History, Times.Once);
		Assert.Single(histories);
		Assert.Single(items);
		Assert.Equal(item2, items[0]);
		Assert.Equal(495m, user.Account.Balance);
	}

	[Fact]
	public void Purchase_Succeeds_WhenPurchasingMultipleItemsWithDifferentCurrency() {
		User user = CreateUser();
		Assert.Empty(user.History);
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item1);
		items.Add(item2);

		store.Purchase(user, new List<Item> {item1, item2});

		currencyExchangeMock.Verify(x => x.GetCurrencyRate(It.IsAny<string>(), It.IsAny<string>()), Times.Once);
		databaseMock.Verify(x => x.Items, Times.Exactly(4));
		databaseMock.Verify(x => x.History, Times.Exactly(2));
		Assert.Single(histories);
		Assert.Single(user.History);
		Assert.Empty(items);
		Assert.Equal(211.5m, user.Account.Balance);
	}

	[Fact]
	public void Purchase_Throws_WhenPurchasingNotExistingInStoreItems() {
		User user = CreateUser();
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item2);

		Assert.Throws<InvalidOperationException>(() => store.Purchase(user, new List<Item> {item1}));

		currencyExchangeMock.Verify(x => x.GetCurrencyRate(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
		databaseMock.Verify(x => x.Items, Times.Exactly(1));
		databaseMock.Verify(x => x.History, Times.Never);
		Assert.Empty(histories);
		Assert.Single(items);
		Assert.Equal(item2, items[0]);
		Assert.Equal(500m, user.Account.Balance);
	}

	[Fact]
	public void Purchase_Throws_WhenUserDoesNotHaveEnoughBalance() {
		User user = CreateUser();
		user.Account.Balance = 3m;
		Store store = CreateStore();
		Item item1 = CreateItem1();
		items.Add(item1);
		
		Assert.Throws<InvalidOperationException>(() => store.Purchase(user, new List<Item> {item1}));

		currencyExchangeMock.Verify(x => x.GetCurrencyRate(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
		databaseMock.Verify(x => x.Items, Times.Exactly(1));
		databaseMock.Verify(x => x.History, Times.Never);
		Assert.Empty(histories);
		Assert.Single(items);
		Assert.Equal(item1, items[0]);
		Assert.Equal(3m, user.Account.Balance);
	}

	[Fact]
	public void GetHistory_Succeeds() {
		User user = CreateUser();
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item1);
		items.Add(item2);

		store.Purchase(user, new List<Item> {item1, item2});
		
		var historiesResult = store.GetHistory(user);
		Assert.Single(historiesResult);
		Assert.Equal(2, historiesResult[0].Items.Count);
		Assert.Equal(item1, historiesResult[0].Items.First());
		Assert.Equal(item2, historiesResult[0].Items.Last());
		Assert.Equal(store, historiesResult[0].Store);
	}

	[Fact]
	public void UserHistoryGetter_Succeeds() {
		User user = CreateUser();
		Assert.Empty(user.History);
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item1);
		items.Add(item2);

		store.Purchase(user, new List<Item> {item1, item2});

		var historiesResult = user.History;
		Assert.Single(historiesResult);
		Assert.Equal(2, historiesResult[0].Items.Count);
		Assert.Equal(item1, historiesResult[0].Items.First());
		Assert.Equal(item2, historiesResult[0].Items.Last());
		Assert.Equal(store, historiesResult[0].Store);
	}

	[Fact]
	public void ReturnItem_Succeeds() {
		User user = CreateUser();
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item1);
		items.Add(item2);
		Assert.Collection(items,
			x1 => Assert.Equal(item1, x1),
			x2 => Assert.Equal(item2, x2));

		store.Purchase(user, new List<Item> {item1});
		Assert.Single(items);
		Assert.Equal(item2, items[0]);
		Assert.Equal(495m, user.Account.Balance);
		Assert.Single(histories);
		Assert.Equal(1, histories[0].User.Id);
		Assert.Equal("Phone", histories[0].Items.First().Name);
		Assert.Equal(DateTimeOffset.Now.DateTime, histories[0].PurchaseDateTimeOffset.DateTime, new TimeSpan(0, 0, 1, 0));
		Assert.Single(histories[0].Items);
		Assert.Single(user.History);
		Assert.Single(user.History[0].Items);
		Assert.Equal(item1, user.History[0].Items.First());

		store.ReturnItem(histories[0].Id, user, item1);

		currencyExchangeMock.Verify(x => x.GetCurrencyRate(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
		databaseMock.Verify(x => x.History, Times.Exactly(5));
		databaseMock.Verify(x => x.Items, Times.Exactly(3));
		Assert.Single(histories);
		Assert.Empty(histories[0].Items);
		Assert.Single(user.History);
		Assert.Empty(user.History[0].Items);
		Assert.Collection(items,
			x1 => Assert.Equal(item2, x1),
			x2 => Assert.Equal(item1, x2));
		Assert.Equal(500m, user.Account.Balance);
	}

	[Fact]
	public void ReturnItem_Succeeds_WhenItemToReturnDoesNotExistInHistory() {
		User user = CreateUser();
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item1);
		items.Add(item2);
		Assert.Collection(items,
			x1 => Assert.Equal(item1, x1),
			x2 => Assert.Equal(item2, x2));

		store.Purchase(user, new List<Item> {item1});
		Assert.Single(items);
		Assert.Equal(item2, items[0]);
		Assert.Equal(495m, user.Account.Balance);
		Assert.Single(histories);
		Assert.Equal(1, histories[0].User.Id);
		Assert.Equal("Phone", histories[0].Items.First().Name);
		Assert.Equal(DateTimeOffset.Now.DateTime, histories[0].PurchaseDateTimeOffset.DateTime, new TimeSpan(0, 0, 1, 0));
		Assert.Single(histories[0].Items);
		Assert.Single(user.History);
		Assert.Single(user.History[0].Items);
		Assert.Equal(item1, user.History[0].Items.First());

		store.ReturnItem(histories[0].Id, user, item2);

		currencyExchangeMock.Verify(x => x.GetCurrencyRate(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
		databaseMock.Verify(x => x.History, Times.Exactly(5));
		databaseMock.Verify(x => x.Items, Times.Exactly(2));
		Assert.Single(histories);
		Assert.Single(histories[0].Items);
		Assert.Single(user.History);
		Assert.Single(user.History[0].Items);
		Assert.Collection(items,
			x2 => Assert.Equal(item2, x2));
		Assert.Equal(495m, user.Account.Balance);
	}

	[Fact]
	public void ReturnItem_Succeeds_WhenItemCurrencyIsDifferent() {
		User user = CreateUser();
		Store store = CreateStore();
		Item item1 = CreateItem1();
		Item item2 = CreateItem2();
		items.Add(item1);
		items.Add(item2);
		Assert.Collection(items,
			x1 => Assert.Equal(item1, x1),
			x2 => Assert.Equal(item2, x2));

		store.Purchase(user, new List<Item> {item2});
		Assert.Single(items);
		Assert.Equal(item1, items[0]);
		Assert.Equal(216.5m, user.Account.Balance);
		Assert.Single(histories);
		Assert.Equal(1, histories[0].User.Id);
		Assert.Equal("Computer", histories[0].Items.First().Name);
		Assert.Equal(DateTimeOffset.Now.DateTime, histories[0].PurchaseDateTimeOffset.DateTime, new TimeSpan(0, 0, 1, 0));
		Assert.Single(histories[0].Items);
		Assert.Single(user.History);
		Assert.Single(user.History[0].Items);
		Assert.Equal(item2, user.History[0].Items.First());

		store.ReturnItem(histories[0].Id, user, item2);

		currencyExchangeMock.Verify(x => x.GetCurrencyRate(It.IsAny<string>(), It.IsAny<string>()), Times.Exactly(2));
		databaseMock.Verify(x => x.History, Times.Exactly(5));
		databaseMock.Verify(x => x.Items, Times.Exactly(3));
		Assert.Single(histories);
		Assert.Empty(histories[0].Items);
		Assert.Single(user.History);
		Assert.Empty(user.History[0].Items);
		Assert.Collection(items,
			x2 => Assert.Equal(item1, x2),
			x1 => Assert.Equal(item2, x1));
		Assert.Equal(500m, user.Account.Balance);
	}

}   
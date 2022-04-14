
namespace Lab2; 

public class Store {

	private readonly ICurrencyExchange currencyExchangeService;
	private readonly IDatabase database;
	private readonly IFlags flags;

	public Store(ICurrencyExchange currencyExchangeService, IDatabase database, IFlags flags) {
		this.currencyExchangeService = currencyExchangeService;
		this.database = database;
		this.flags = flags;
	}

	public void Purchase(User user, List<Item> items) {
		if(!items.All(x => database.Items.Contains(x)))
			throw new InvalidOperationException("Store does not have required goods");
		decimal total = 0;
		foreach(var item in items) {
			decimal price = item.Price;
			if(item.Currency != user.Account.Currency) {
				price *= currencyExchangeService.GetCurrencyRate(item.Currency, user.Account.Currency);
			}
			total += price;
		}
		if(user.Account.Balance <= total)
			throw new InvalidOperationException("User doesn't have enough balance to pay");
		items.ForEach(item => database.Items.Remove(item));
		database.History.Add(new History {
			Id = Guid.NewGuid(),
			Items = items,
			PurchaseDateTimeOffset = DateTimeOffset.Now,
			Store = this,
			User = user
		});
		user.Account.Balance -= total;
		
	}

	public string GetCountryFlagByUser(User user) => flags.GetCountryFlag(user.Country);

	public void AddItem(Item item) => database.Items.Add(item);

	public void RemoveItem(Item item) => database.Items.Remove(item);

	public IList<Item> GetItems() => database.Items;

	public void ReturnItem(Guid purchaseId, User user, Item itemToReturn) {
		var historyUnit = database.History.FirstOrDefault(x => x.Id == purchaseId && x.User == user && x.Items.Contains(itemToReturn));
		if(historyUnit != null) {
			historyUnit.Items.Remove(itemToReturn);
			decimal price = itemToReturn.Price;
			if(itemToReturn.Currency != user.Account.Currency) {
				price *= currencyExchangeService.GetCurrencyRate(itemToReturn.Currency, user.Account.Currency);
			}
			user.Account.Balance += price;
			this.AddItem(itemToReturn);
		}
	}

	public IList<History> GetHistory(User user) 
		=> database.History.Where(x => x.User == user && x.Store == this).ToList();

}
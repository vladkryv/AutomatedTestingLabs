#pragma warning disable CS8618
namespace Lab2; 

public class History {
	
	public Guid Id { get; init; }
	public DateTimeOffset PurchaseDateTimeOffset { get; init; }
	public User User { get; init; }
	public Store Store { get; init; }
	public ICollection<Item> Items { get; init; }


}
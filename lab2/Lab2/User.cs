// ReSharper disable NotNullMemberIsNotInitialized
#pragma warning disable CS8618
namespace Lab2; 

public class User {

	private readonly IDatabase database;
	public User(IDatabase database) => this.database = database;


	public int Id { get; set; }
	public Account Account { get; set; }
	public string Country { get; set; }

	public IList<History> History => database.History.Where(x => x.User == this).ToList();


}
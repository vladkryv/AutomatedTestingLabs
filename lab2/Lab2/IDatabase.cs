namespace Lab2; 

public interface IDatabase {

	IList<Item> Items { get; set; }

	IList<History> History { get; set; }
}
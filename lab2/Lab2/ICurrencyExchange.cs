namespace Lab2; 

public interface ICurrencyExchange {

	decimal GetCurrencyRate(string baseCurrency, string quoteCurrency);

}
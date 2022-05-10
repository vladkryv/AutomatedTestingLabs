const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Wikipedia', function() {
  this.timeout(30000)
  let driver
  let vars
  
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  
  afterEach(async function() {
    await driver.quit();
  })
  
  it('Wikipedia', async function() {
    await driver.get("https://uk.wikipedia.org/")
    await driver.findElement(By.id("searchInput")).click()
    await driver.findElement(By.id("searchInput")).sendKeys("Київ")
    await driver.findElement(By.id("searchButton")).click()
    await driver.wait(until.elementLocated(By.css(".infobox")), 30000)
	
    {
      const elements = await driver.findElements(By.xpath("//img[@alt=\'COA of Kyiv Kurovskyi.svg\']"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.xpath("//a[contains(text(),\'Герб Києва\')]"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.xpath("//a[contains(text(),\'Населення\')]"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.xpath("//a[contains(text(),\'Густота населення\')]"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.xpath("//th[contains(.,\'Середня температура, °C\')]"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.xpath("//th[contains(.,\'Квіт.\')]"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.xpath("//span[contains(.,\'Епідемія коронавірусу\')]"))
      assert(elements.length)
    }
	
	{
		const elements = await driver.findElements(By.xpath("//ul[contains(.,\'Золоті ворота\') and contains(.,\'Будинок з химерами\')]//li"))
		assert(elements.length > 20)
	}
  })
})

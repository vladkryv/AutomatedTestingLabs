const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Case5', function() {
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
  
  it('OpenLoginPage', async function() {
    await driver.get("http://automationpractice.com/")

    if ((await driver.findElements(By.xpath("//a[contains(text(),\'Sign out\')]"))).length > 0) {
      await driver.findElement(By.linkText("Sign out")).click()
    }
	
    await driver.findElement(By.linkText("Sign in")).click()
    assert(await driver.getTitle() == "Login - My Store")
  })
  
  it('TryAuthoriseUseLoginAndPassword', async function() {
    await driver.get("http://automationpractice.com/index.php?controller=authentication&back=my-account")
    await driver.findElement(By.id("email")).sendKeys("vlkr_npuedu@example.com")
    await driver.findElement(By.id("passwd")).sendKeys("j9aDdv4mhNcq6Tb")
    await driver.findElement(By.css("#SubmitLogin > span")).click()
    assert(await driver.findElement(By.xpath("//a/span")).getText() == "Vladyslav Kr")
  })
  
  it('For5Case', async function() {
    await driver.get("http://automationpractice.com/index.php?controller=my-account")
    await driver.wait(until.elementLocated(By.id("search_query_top")), 10000)
    await driver.findElement(By.id("search_query_top")).sendKeys("Printed Chiffon Dress")
	
    await driver.findElement(By.name("submit_search")).click()
    {
      const elements = await driver.findElements(By.xpath("//ul[@class[contains(.,\'product_list\')]]//a[contains(text(),\'Printed Chiffon Dress\')]"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.xpath("//ul[@class[contains(.,\'product_list\')]]//a[contains(text(),\'Printed Chiffon Dress\')]//..//..//span[contains(.,\'-20%\')]"))
      assert(elements.length)
    }
  })
})

const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Case1', function() {
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
  
  it('TryAuthorise', async function() {
    await driver.get("http://automationpractice.com/index.php?controller=authentication&back=my-account")
    await driver.findElement(By.id("email")).sendKeys("vlkr_npuedu@example.com")
    await driver.findElement(By.id("passwd")).sendKeys("j9aDdv4mhNcq6Tb")
    await driver.findElement(By.css("#SubmitLogin > span")).click()
    assert(await driver.findElement(By.xpath("//a/span")).getText() == "Vladyslav Kr")
  })
  
  it('ForCase1', async function() {
    await driver.get("http://automationpractice.com/index.php")
    await driver.findElement(By.xpath("//a[contains(text(),\'Women\')]")).click()
	
    // check number of products
    assert((await driver.findElements(By.xpath("//div[@class[contains(.,\'product-container\')]]"))).length == 7)
	
    // check number of yellow
    assert((await driver.findElements(By.xpath("//div[@class[contains(.,\'product-container\')]]//ul//a[contains(@style,\'background:#F1C40F\')]"))).length == 3)
	
    await driver.findElement(By.css("#list > a")).click()
    {
      const elements = await driver.findElements(By.css(".ajax_block_product:nth-child(1) .product-name"))
      assert(elements.length)
    }
	
    {
      const elements = await driver.findElements(By.css(".ajax_block_product:nth-child(1) .product-desc"))
      assert(elements.length)
    }
  })
})

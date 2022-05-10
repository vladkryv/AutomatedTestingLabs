const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Case4', function() {
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
  
  it('For4Case', async function() {
    await driver.get("http://automationpractice.com/index.php?controller=my-account")
    await driver.findElement(By.xpath("(//a[contains(text(),\'T-shirts\')])[2]")).click()
	
    await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".ajax_block_product"))), 1000)
    {
      const element = await driver.findElement(By.css(".product-image-container:nth-child(1)"))
      await driver.actions({ bridge: true }).move(element).perform()
    }
	
    await driver.findElement(By.css(".ajax_add_to_cart_button > span")).click()
    await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//h2[contains(.,\'Product successfully added to your shopping cart\')]"))), 5000)
    await driver.get("http://automationpractice.com/index.php?controller=order")
    await driver.findElement(By.css(".icon-plus")).click()
	
    assert(await driver.findElement(By.css(".cart_description > .product-name")).getText() == "Faded Short Sleeve T-shirts")
    assert(await driver.findElement(By.xpath("//td[4]")).getText() == "$16.51")
    await driver.sleep(5000);
    assert(await driver.findElement(By.xpath("//td[6]")).getText() == "$33.02")
  })
})

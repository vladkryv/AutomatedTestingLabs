const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Case3', function() {
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

  it('ForCase3', async function() {
    await driver.get("http://automationpractice.com/index.php")
    await driver.findElement(By.xpath("//a[contains(text(),\'Women\')]")).click()
    await driver.wait(until.elementLocated(By.linkText("Faded Short Sleeve T-shirts")), 5000)
    await driver.findElement(By.linkText("Faded Short Sleeve T-shirts")).click()
    await driver.findElement(By.xpath("//input[@id=\'quantity_wanted\']")).sendKeys("1")
    await driver.findElement(By.xpath("//p[@id=\'add_to_cart\']/button/span")).click()
    await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//h2[contains(.,\'Product successfully added to your shopping cart\')]"))), 10000)

    await driver.get("http://automationpractice.com/index.php?controller=order")

    {
      const elements = await driver.findElements(By.css(".cart_product img"))
      assert(elements.length)
    }

    {
      const elements = await driver.findElements(By.xpath("//footer//section[@id=\'block_contact_infos\']/div/ul/li[contains(.,\'Email\')]"))
      assert(elements.length)
    }

    {
      const elements = await driver.findElements(By.xpath("//footer//section[@id=\'block_contact_infos\']/div/ul/li[contains(.,\'Call\')]"))
      assert(elements.length)
    }
  })
})

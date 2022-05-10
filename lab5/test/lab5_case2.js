const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Case2', function() {
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

  it('ForCase2', async function() {
    await driver.get("http://automationpractice.com/index.php")
    await driver.findElement(By.xpath("//a[contains(text(),\'Women\')]")).click()
    await driver.wait(until.elementLocated(By.linkText("Faded Short Sleeve T-shirts")), 5000)
    await driver.findElement(By.linkText("Faded Short Sleeve T-shirts")).click()
    await driver.findElement(By.id("send_friend_button")).click()
    await driver.wait(until.elementLocated(By.css(".fancybox-skin")), 2000)

    {
      const elements = await driver.findElements(By.xpath("(//div[@id=\'send_friend_form\'])//h2[contains(text(),\'Send to a friend\')]"))
      assert(elements.length)
    }

    {
      const elements = await driver.findElements(By.xpath("//button[@id=\'sendEmail\']/span"))
      assert(elements.length)
    }
  })
})

const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Bing', function() {
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

  it('Bing', async function() {
    await driver.get("https://www.bing.com/")
    await driver.wait(until.elementLocated(By.id("bLogo"), 3000))

    assert(await driver.getTitle() == "Bing")
    {
      const elements = await driver.findElements(By.id("bLogo"))
      assert(elements.length)
    }

    {
      const elements = await driver.findElements(By.id("sb_form_q"))
      assert(elements.length)
    }
    
    await driver.wait(until.elementLocated(By.id("outlook")), 3000)
  })
})

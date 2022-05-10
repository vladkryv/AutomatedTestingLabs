const assert = require('assert')

class TestSet {

  runOpenLoginPage(driver, vars, By)
  {
    it('OpenLoginPage', async function() {
      await driver.get("http://automationpractice.com/")

      if ((await driver.findElements(By.xpath("//a[contains(text(),\'Sign out\')]"))).length > 0) {
        await driver.findElement(By.linkText("Sign out")).click()
      }

      await driver.findElement(By.linkText("Sign in")).click()
      assert(await driver.getTitle() == "Login - My Store")
    })
  }

  runTryAuthoriseUseLoginAndPassword(driver, vars)
  {
    it('TryAuthoriseUseLoginAndPassword', async function() {
      await driver.get("http://automationpractice.com/index.php?controller=authentication&back=my-account")
      await driver.findElement(By.id("email")).sendKeys("vlkr_npuedu@example.com")
      await driver.findElement(By.id("passwd")).sendKeys("j9aDdv4mhNcq6Tb")
      await driver.findElement(By.css("#SubmitLogin > span")).click()
      assert(await driver.findElement(By.xpath("//a/span")).getText() == "Vladyslav Kr")
    })
  }
}

module.exports = {TestSet};

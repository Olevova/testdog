const { describe } = require("mocha");
const { Builder, By, until, wait } = require("selenium-webdriver");
const should = require("chai").should();

async function startEnterFunction(driv) {
  await driv.get("https://dogsnavigator.com.ua/login");
  await driv.wait(until.elementsLocated(By.css("form")), 10000);
  const phoneInput = await driv.findElement(By.id("phone"));
  const passwordInput = await driv.findElement(By.id("password-reg"));
  const enterButton = await driv.findElement(
    By.xpath(
      "/html/body/app-root/app-login/section/div[2]/app-login-form/form/button[2]"
    )
  );
  const formElement = { phoneInput, passwordInput, enterButton };
  return formElement;
}

describe("Four system login scenarios", () => {
  let driver;
  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("success enter", async () => {
    await driver.get("https://dogsnavigator.com.ua/login");
    const formEl = await startEnterFunction(driver).then(
      (elements) => elements
    );
    await formEl.phoneInput.sendKeys("963653768");
    await formEl.passwordInput.sendKeys("33333");
    await formEl.enterButton.click();
    await driver.wait(until.urlIs("https://dogsnavigator.com.ua/"), 10000);
    console.log("here");
    const loggedIn = await driver
      .findElement(
        By.xpath(
          "/html/body/app-root/app-landing/div/div/app-header/header/div/div/ul/li[1]/a"
        )
      )
      .getText();
    loggedIn.should.equal("Мій Собака");
  });

  it("not valid the phone number", async () => {
    await driver.get("https://dogsnavigator.com.ua/login");
    const formEl = await startEnterFunction(driver).then(
      (elements) => elements
    );
    await formEl.phoneInput.sendKeys("96365376*");
    await formEl.passwordInput.sendKeys("33333");
    await formEl.enterButton.click();
    await driver.sleep(1000);

    const phoneInputClass = await formEl.phoneInput.getAttribute("class");
    await phoneInputClass.should.to.include("ng-invalid");
  });
  it("not valid the password", async () => {
    await driver.get("https://dogsnavigator.com.ua/login");
    await driver.sleep(1000);
    const formEl = await startEnterFunction(driver).then(
      (elements) => elements
    );
    await formEl.phoneInput.sendKeys("963653768");
    await formEl.passwordInput.sendKeys("3333");
    await formEl.enterButton.click();
    await driver.wait(
      until.elementLocated(
        By.className("width-100 password ng-invalid ng-dirty ng-touched"),
        10000
      )
    );
    const passwordInputClass = await formEl.passwordInput.getAttribute("class");
    await passwordInputClass.should.to.include("ng-invalid");
  });
  it("bad the phone number or the password", async () => {
    await driver.get("https://dogsnavigator.com.ua/login");
    const formEl = await startEnterFunction(driver).then(
      (elements) => elements
    );
    await formEl.phoneInput.sendKeys("963653768");
    await formEl.passwordInput.sendKeys("3333333");
    await formEl.enterButton.click();
    await driver.wait(until.elementLocated(By.className("error"), 10000));
    const badPhoneOrPassword = await driver
      .findElement(
        By.xpath(
          "/html/body/app-root/app-login/section/div[2]/app-login-form/form/p"
        )
      )
      .getText();
    await badPhoneOrPassword.should.equal("Невірні дані. Спробуйте ще раз");
  });
});

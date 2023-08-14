const { describe } = require("mocha");
const { Builder, By, until, wait } = require("selenium-webdriver");
const should = require("chai").should();

describe("register ", () => {
  let driver;
  let dogsNameInput;
  let nameInput;
  let phoneInput;
  let passwordInput;
  let checkAgree;
  let submitButton;

  const openPage = async () => {
    await driver.get("https://dogsnavigator.com.ua/login");
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.css("form"))),
      10000
    );
    const registerButton = await driver.findElements(By.tagName("li"));
    for (const button of registerButton) {
      const buttonText = await button.getText();
      if (buttonText.includes("Зареєструватися")) {
        await button.click();
        return;
      }
    }
  };

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://dogsnavigator.com.ua/login");
    await openPage();
    dogsNameInput = await driver.findElement(By.id("pet-name"));

    nameInput = await driver.findElement(By.id("owner-name"));
    phoneInput = await driver.findElement(By.id("tel"));
    passwordInput = await driver.findElement(By.id("password-reg"));
    checkAgree = await driver.findElement(
      By.xpath(
        "/html/body/app-root/app-login/section/div[2]/app-registration-form/form/div[4]/label/input"
      )
    );
    submitButton = await driver.findElement(By.tagName("button"));
  });

  afterEach(async () => {
    await driver.quit();
  });
  it("register scene without the dog name", async () => {
    await phoneInput.sendKeys("682029406");
    await nameInput.sendKeys("Owner");
    await passwordInput.sendKeys("password");
    await checkAgree.click();
    await submitButton.click();
    await driver.wait(until.elementLocated(By.tagName("form")), 10000);
    const inputConfirmation = await dogsNameInput.getAttribute("class");
    inputConfirmation.should.to.include("ng-invalid");
  });
  it("register scene without the name", async () => {
    await dogsNameInput.sendKeys("Dog");
    await phoneInput.sendKeys("682029406");
    await passwordInput.sendKeys("password");
    await checkAgree.click();
    await submitButton.click();
    await driver.wait(until.elementLocated(By.tagName("form")), 10000);
    const inputConfirmatio = await nameInput.getAttribute("class");
    inputConfirmatio.should.to.include("ng-invalid");
  });
  it("register scene without the password", async () => {
    await dogsNameInput.sendKeys("Dog");
    await phoneInput.sendKeys("682029406");
    await nameInput.sendKeys("Owner");
    await checkAgree.click();
    await submitButton.click();
    await driver.wait(until.elementLocated(By.tagName("form")), 10000);
    const inputConfirmatio = await passwordInput.getAttribute("class");
    inputConfirmatio.should.to.include("ng-invalid");
  });
  it("register scene when the password less then 5 symbols", async () => {
    await dogsNameInput.sendKeys("Dog");
    await phoneInput.sendKeys("682029406");
    await nameInput.sendKeys("Owner");
    await passwordInput.sendKeys("pass");
    await checkAgree.click();
    await submitButton.click();
    await driver.wait(until.elementLocated(By.tagName("form")), 10000);
    const inputConfirmatio = await passwordInput.getAttribute("class");
    inputConfirmatio.should.to.include("ng-invalid");
  });
  it("The user's agreement checkbox is not checked", async () => {
    await dogsNameInput.sendKeys("Dog");
    await phoneInput.sendKeys("682029406");
    await nameInput.sendKeys("Owner");
    await passwordInput.sendKeys("pass");
    await submitButton.click();
    await driver.wait(until.elementLocated(By.tagName("form")), 10000);
    const inputConfirmatio = await checkAgree.getAttribute("class");
    inputConfirmatio.should.to.include("ng-invalid");
  });
});

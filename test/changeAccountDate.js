const { describe } = require("mocha");
const { Builder, By, until, wait } = require("selenium-webdriver");
const should = require("chai").should();
const chrome = require("selenium-webdriver/chrome");

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
  await phoneInput.sendKeys("963653768");
  await passwordInput.sendKeys("22222");
  await enterButton.click();
}

describe("change date of account ", () => {
  let breedList;
  let driver;
  beforeEach(async () => {
    const options = new chrome.Options();
    // options.addArguments("--incognito");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      // .usingServer("http://localhost:4444/wd/hub")
      .build();
    console.log("Driver created. Navigating to login page...");

    await driver.get("https://dogsnavigator.com.ua/login");
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.css("form"))),
      10000
    );
  });
  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("change breed", async () => {
    // use here breed name for change
    let newBreed = "Сенбернар";
    let saveButton ;
    await startEnterFunction(driver);
    await driver.wait(until.elementLocated(By.linkText("Мій Профіль")),10000).click();
    await driver.wait(until.elementLocated( By.xpath('//input[@placeholder="Пошук"]')),10000)
    const dogBreedInput = await driver.findElement(
      By.xpath('//input[@placeholder="Пошук"]')
    );
    
    await dogBreedInput.clear();
    await dogBreedInput.sendKeys(newBreed);
    await driver.sleep(2000);
    const ulElement = await driver.findElement(
      By.css("ul.results.flex-column")
    );
    breedList = await ulElement.findElements(By.css("li label"));
    let breedForCompere;
    for (let i = 0; i < breedList.length; i += 1) {
      breedForCompere = await breedList[i].getText();
      console.log(breedForCompere.toLowerCase()===newBreed.toLowerCase())
      if (breedForCompere.toLowerCase() === newBreed.toLowerCase()) {
        await breedList[i].click();
        saveButton = await driver.findElement(
          By.xpath('//button[text()="ЗБЕРЕГТИ"]')
        ).click();
        await driver.wait(until.elementsLocated(By.css("li label")),10000)

        return;
      }
    }
    await driver.findElement(By.xpath('//input[@placeholder="Пошук"]')).clear();
    await driver
      .findElement(By.xpath('//input[@placeholder="Пошук"]'))
      .sendKeys("Інша порода");
    newBreed = "Інша порода";
    
    breedList = await ulElement.findElements(By.css("li label"));
    await driver.sleep(2000);
    for (let i = 0; i < breedList.length + 1; i += 1) {
      breedForCompere = await breedList[i].getText();
      if (breedForCompere.toLowerCase()  === newBreed.toLowerCase() ) {
        await breedList[i].click();
       
       
        await driver.sleep(2000)
        saveButton = await driver.findElement(
          By.xpath('//button[text()="ЗБЕРЕГТИ"]')
        ).click();
        await driver.wait(until.elementsLocated(By.css("li label")),10000)
        return;
      }
    }
  });
});
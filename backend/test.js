const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function fullTestSuite() {

    let options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 1. LOST ITEM FLOW
        console.log("Running Lost Item Test...");

        await driver.get('http://localhost:3001');

        await driver.wait(until.elementLocated(By.linkText("Get Started")), 10000);

        let buttons = await driver.findElements(By.linkText("Get Started"));
        await buttons[0].click();

        await driver.wait(until.elementLocated(By.id("name")), 10000);

        await driver.findElement(By.id("name")).sendKeys("Laptop");
        await driver.findElement(By.id("description")).sendKeys("Black Dell laptop");
        await driver.findElement(By.id("location")).sendKeys("Library");
        await driver.executeScript(
            "document.getElementById('date').value = '2026-03-10'"
        );
        await driver.findElement(By.id("color")).sendKeys("Black");
        await driver.findElement(By.id("brand")).sendKeys("Dell");
        await driver.findElement(By.id("identifiers")).sendKeys("Sticker on back");

        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(3000);
        console.log(" Lost Item Test Passed");


        // 2. FOUND ITEM FLOW
        console.log("Running Found Item Test...");

        await driver.get('http://localhost:3001');

        await driver.wait(until.elementLocated(By.linkText("Get Started")), 10000);

        let buttons2 = await driver.findElements(By.linkText("Get Started"));
        await buttons2[1].click();

        await driver.wait(until.elementLocated(By.id("name")), 10000);

        await driver.findElement(By.id("name")).sendKeys("Water Bottle");
        await driver.findElement(By.id("description")).sendKeys("Blue bottle near canteen");

        await driver.findElement(By.id("location")).sendKeys("Canteen");
        await driver.executeScript(
            "document.getElementById('date').value = '2026-03-18'"
        );
        await driver.findElement(By.id("color")).sendKeys("Blue");
        await driver.findElement(By.id("brand")).sendKeys("Milton");
        await driver.findElement(By.id("identifiers")).sendKeys("Sticker on cap");

        await driver.findElement(By.id("finderName")).sendKeys("Vidhya");
        await driver.findElement(By.id("finderPhone")).sendKeys("9876543210");
        await driver.findElement(By.id("finderEmail")).sendKeys("vidhya@gmail.com");

        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(3000);
        console.log("Found Item Test Passed");

        // 3. CLAIM ITEM FLOW
        console.log("Running Claim Item Test...");

        await driver.get('http://localhost:3001/claim.html');

        await driver.wait(until.elementLocated(By.id("claimerName")), 10000);

        await driver.findElement(By.id("claimerName")).sendKeys("Vidhya");
        await driver.findElement(By.id("claimerPhone")).sendKeys("9876543210");
        await driver.findElement(By.id("claimerEmail")).sendKeys("vidhya@gmail.com");

        await driver.findElement(By.id("color")).sendKeys("Black");
        await driver.findElement(By.id("brand")).sendKeys("Dell");
        await driver.findElement(By.id("identifiers")).sendKeys("Scratch on side");
        await driver.findElement(By.id("location")).sendKeys("Library");

        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(3000);
        console.log("Claim Item Test Passed");


        console.log("ALL TESTS COMPLETED SUCCESSFULLY");

    } catch (err) {
        console.log("Test Failed:", err);
    } finally {
        await driver.quit();
    }

})();
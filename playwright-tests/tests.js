const fs = require('fs-extra');
const path = require('path');

async function loginTest(page, screenshotPath) {
    await page.goto(page.url());
    await fs.ensureDir(path.dirname(screenshotPath));
    await page.screenshot({ path: screenshotPath });
  }
  
  async function employeesTest(page, screenshotPath) {
    await page.goto(page.url());
    await page.fill('.input.autocomplete', 'admin');
    await page.fill('.input.password.autocomplete', '1qaz2wsx');
    await page.click('button:has-text("Войти")');
    await page.waitForSelector('span:has-text("Личный мобильный номер")'); // Измените селектор на соответствующий вашей странице
    await fs.ensureDir(path.dirname(screenshotPath));
    await page.screenshot({ path: screenshotPath });
  }
  
  module.exports = { loginTest, employeesTest };
  
const { chromium } = require('playwright');
const fs = require('fs-extra');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const { loginTest, employeesTest } = require('./tests');

async function setupBrowser(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return { browser, page };
}

async function compareScreenshots(baselinePath, newScreenshotPath, diffPath) {
  const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNG.sync.read(fs.readFileSync(newScreenshotPath));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return numDiffPixels;
}

async function capturePage(page, testName, basePath, resultsPath) {
  const baselinePath = path.join(basePath, `${testName}.png`);
  const screenshotPath = path.join(resultsPath, `${testName}.png`);
  const diffPath = path.join(resultsPath, `${testName}_diff.png`);

  if (testName === 'login') {
    await loginTest(page, screenshotPath);
  } else if (testName === 'employees') {
    await employeesTest(page, screenshotPath);
  }

  const numDiffPixels = await compareScreenshots(baselinePath, screenshotPath, diffPath);
  return { baselinePath, screenshotPath, diffPath, numDiffPixels };
}

module.exports = { setupBrowser, capturePage };

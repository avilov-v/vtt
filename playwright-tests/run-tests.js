const { setupBrowser, capturePage } = require('./test-functions');
const path = require('path');

(async () => {
  const url = process.argv[2];
  const { browser, page } = await setupBrowser(url);

  const basePath = path.join(__dirname, '..', 'public', 'baseline');
  const resultsPath = path.join(__dirname, '..', 'public', 'results');

  const loginResults = await capturePage(page, 'login', basePath, resultsPath);
  const employeesResults = await capturePage(page, 'employees', basePath, resultsPath);

  await browser.close();
  console.log(`login: ${loginResults.numDiffPixels}, employees: ${employeesResults.numDiffPixels}`);
})();

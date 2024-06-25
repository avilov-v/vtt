const { setupBrowser, capturePage } = require('./test-functions');
const path = require('path');

(async () => {
  const url = process.argv[2];
  const { browser, page } = await setupBrowser(url);

  const basePath = path.join(__dirname, '..', 'public', 'baseline');

  await capturePage(page, 'login', basePath, basePath);
  await capturePage(page, 'employees', basePath, basePath);

  await browser.close();
  console.log('Baseline captured');
})();

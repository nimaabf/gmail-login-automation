const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://mail.google.com', {
      waitUntil: 'domcontentloaded',
    });

    // Enter your email
    await page.type('input[type="email"]', 'email@gmail.com');
    await page.click('#identifierNext');

    await page.waitForSelector('input[name="password"]', { visible: true });

    await page.waitForTimeout(1000);

    // Enter your password
    await page.type('input[name="password"]', '123456789');
    await page.click('#passwordNext');

    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    const errorMessage = await page.evaluate(() => {
      const errorElement = document.querySelector('.o6cuMc'); // Replace with the actual selector
      return errorElement ? errorElement.textContent.trim() : null;
    });

    if (
      errorMessage &&
      errorMessage.includes('Try using a different browser')
    ) {
      console.log(
        'Try using a different browser message detected. Handling accordingly...'
      );

      await page.close();
      const newPage = await browser.newPage();
      await newPage.goto('https://mail.google.com', {
        waitUntil: 'domcontentloaded',
      });
    } else {
      console.log('Login successful or no error message detected.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();

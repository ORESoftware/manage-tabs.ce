const puppeteer = require('puppeteer');

(async () => {
    // Launch Puppeteer with the extension
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=/path/to/your/extension/`,
            `--load-extension=/path/to/your/extension/`
        ]
    });

    console.log('starting puppeteer...');

    // const browser = await puppeteer.connect({
    //     browserURL: 'http://localhost:9222',
    //     defaultViewport: null,
    // });

    console.log('connected');

    // Open the intermediary page
    const page = await browser.newPage();
    await page.goto('file:///Users/alex.mills/codes/vibeirl/chrome-kill-tabs/main.html');

    // Use Puppeteer to control the page to send a message to the extension
    await page.evaluate(() => {
        sendMessageToExtension('Hello from Puppeteer!');
    });

    // Additional Puppeteer commands as needed...

    // Close the browser when done
    await browser.close();
})();

const puppeteer = require('puppeteer');

async function closeMatchingTabs(domains) {
    // Connect to an existing instance of Chrome
    const browser = await puppeteer.connect({
        browserURL: 'http://localhost:9222',
        defaultViewport: null,
    });

    console.log('connected');
    const test = await browser.pages();

    console.log({test});
    const pages = await browser.pages(); // Get all open pages (tabs)

    console.log('tab count:', pages.length);

    for (const page of pages) {
        const url = await page.url(); // Get the URL of the tab

        console.log(url);

        // Check if URL matches any of the domains
        if (domains.some(domain => url.includes(domain))) {
            console.log('closing page:', url);
            await page.close(); // Close the tab if it matches
        }
    }

    console.log('done with pages.')
    // Do not close the browser as it's an existing instance
    browser.disconnect()
}

// Example usage
closeMatchingTabs(['example.com', 'sub.example.com']).then(v =>{
    console.log('done');
}).catch(err => {
    console.error(err);
})

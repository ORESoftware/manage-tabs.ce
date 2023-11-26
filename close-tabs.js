const CDP = require('chrome-remote-interface');

async function closeMatchingTabs(domains) {
    let client;
    try {
        // Connect to Chrome
        client = await CDP();

        // Extract the necessary domains
        const { Runtime } = client;

        // Replace YOUR_EXTENSION_ID with the actual ID of your extension
        const expression = `  
      chrome.runtime.sendMessage('ajijnhhpnpmnonlfhdlfobemomlkmnan', {action: 'closeTabs', domains: ${JSON.stringify(domains)}}, function(response) {
        console.log(response);
      });`;

        // Evaluate the script in the context of the Chrome instance
        await Runtime.evaluate({ expression });

        console.log('done')

    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// Example usage: close tabs with domains 'example.com' or 'sub.example.com'
closeMatchingTabs(['wellsfargo.com', 'youtube.com']);

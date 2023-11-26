

// Listen for when a new tab is opened
chrome.tabs.onCreated.addListener(function(tab) {
    // Store the tab ID and the current time
    chrome.storage.sync.set({[tab.id]: tabsOpened[tab.id]})
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    // Store the tab ID and the current time
    chrome.storage.sync.remove(tabId);
});

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        const domains = JSON.parse(request.domains);
        console.log({domains});
        if (request.action === "closeTabs") {
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(tab => {
                    console.log('tab.url', tab.url);
                    if (tab.url && domains.some(domain => tab.url.includes(domain))) {
                        chrome.tabs.remove(tab.id);
                    }
                });
            });
            sendResponse({status: "Tabs closed"});
        }
    }
);


// Listen for when a new tab is opened
chrome.tabs.onCreated.addListener(function(tab) {
    // Store the tab ID and the current time
    console.log('opened tab:', tab.id)
    const id = typeof tab.id === 'string' ? tab.id : String(tab.id)
    chrome.storage.sync.set({[id]: tab.id})
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("Tab ID: " + tabId);
    // You can use tabId here
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    console.log("Page loaded in tab ID: " + details.tabId);
    // You can use details.tabId here
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log("URL updated in tab ID: " + details.tabId);
    // You can use details.tabId here
});

const onRemoved = () => {};

chrome.tabs.onRemoved.addListener(function(tabId) {
    // Store the tab ID and the current time
    console.log('closed tab:', tabId)
    const id = typeof tabId === 'string' ? tabId : String(tabId)
    chrome.storage.sync.remove([id], onRemoved);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    // for (var key in changes) {
    //     var storageChange = changes[key];
    //     console.log('Storage key "%s" in namespace "%s" changed. ' +
    //         'Old value was "%s", new value is "%s".',
    //         key,
    //         namespace,
    //         storageChange.oldValue,
    //         storageChange.newValue);
    // }
});

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {

        // chrome.runtime.reload(); // reload chrome extension

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
let skipCount = 0;


const onSet = () => {
};

const onRemoved = () => {
};

const onUpdate = (v) => {

};


chrome.commands.onCommand.addListener(function (command) {
  
  if (command === "close-active-tab") {
    // skipCount = Math.max(0, skipCount - 1)
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.remove(tabs[0].id);
      }
    });
    return;
  }
  
  if (command === "go-to-oldest-tab") {
    
    const count = skipCount = 0;
    
    chrome.storage.sync.get(['tabs'], res => {
      const tabs = JSON.parse(res.tabs || {});
      
      const sorted = Object.entries(tabs).sort((a, b) => {
        return a[1].time - b[1].time;
      });
      
      const item = sorted[count];
      
      if (!(item && item[1])) {
        console.error('missing item at index:', count)
        return;
      }
      
      // chrome.windows.update(tab.windowId, { focused: true });
      let id = item[1].id;
      
      if (typeof id === 'string') {
        id = parseInt(id)
      }
      
      chrome.tabs.get(id, (tab) => {
        if (tab) {
          chrome.tabs.update(id, {active: true}, onUpdate);
        } else {
          const tabs = JSON.parse(res.tabs || '{}')
          delete tabs[id];
          chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, onSet);
        }
      });
      
    });
    return;
  }
  
  if (command === "go-to-next-oldest-tab") {
    
    const count = skipCount = skipCount + 1;
    
    chrome.storage.sync.get(['tabs'], res => {
      
      const tabs = JSON.parse(res.tabs || {});
      const sorted = Object.entries(tabs).sort((a, b) => {
        return a[1].time - b[1].time;
      });
      
      const item = sorted[count];
      
      if (item && item[1]) {
        
        let id = item[1].id;
        
        if (typeof id === 'string') {
          id = parseInt(id)
        }
        
        chrome.tabs.get(id, (tab) => {
          if (tab) {
            chrome.tabs.update(id, {active: true}, onUpdate);
          } else {
            const tabs = JSON.parse(res.tabs || '{}')
            delete tabs[id];
            chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, onSet);
          }
        });
      }
      
    });
    
    return;
  }
  
  
});

// Listen for when a new tab is opened
chrome.tabs.onCreated.addListener(function (tab) {
  // Store the tab ID and the current time
  console.log('opened tab:', tab.id)
  const id = parseInt(typeof tab.id === 'string' ? tab.id : String(tab.id))
  chrome.storage.sync.get(['tabs'], res => {
    const tabs = JSON.parse(res.tabs || '{}')
    tabs[id] = {id, time: Date.now()};
    chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, onSet);
  });
  
  // chrome.storage.sync.set({[id]: tab.id})
});


chrome.tabs.onRemoved.addListener(function (tabId) {
  // Store the tab ID and the current time
  console.log('closed tab:', tabId)
  const id = typeof tabId === 'string' ? tabId : String(tabId)
  chrome.storage.sync.get(['tabs'], res => {
    const tabs = JSON.parse(res.tabs || '{}')
    delete tabs[id];
    chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, onSet);
  });
  
  // chrome.storage.sync.remove([id], onRemoved);
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("Tab ID: " + tabId);
  // You can use tabId here
});

// chrome.webNavigation.onCompleted.addListener(function(details) {
//     console.log("Page loaded in tab ID: " + details.tabId);
//     // You can use details.tabId here
// });
//
// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
//     console.log("URL updated in tab ID: " + details.tabId);
//     // You can use details.tabId here
// });

chrome.tabs.onActivated.addListener(function (activeInfo) {
  // activeInfo.tabId will have the ID of the active tab
  // activeInfo.windowId will have the ID of the window
  const id = activeInfo.tabId;
  chrome.storage.sync.get(['tabs'], res => {
    const tabs = JSON.parse(res.tabs || '{}')
    let t = tabs[id];
    if (!t) {
      t = tabs[id] = {id}
    }
    t.time = Date.now();
    chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, onSet);
  });
  
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
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
  function (request, sender, sendResponse) {
    
    // chrome.runtime.reload(); // reload chrome extension
    
    const domains = JSON.parse(request.domains);
    console.log({domains});
    if (request.action === "closeTabs") {
      chrome.tabs.query({}, function (tabs) {
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
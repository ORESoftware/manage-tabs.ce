'use strict';


const app = {
  p: Promise.resolve(),
  skipCount: 0
}


chrome.commands.onCommand.addListener(function (command) {
  
  if (command === "next-most-recent-tab") {
    // skipCount = Math.max(0, skipCount - 1)
    
    return app.p = app.p.then(() => {
      return new Promise((resolve) => {
        
        setTimeout(resolve, 5000);
        app.skipCount = Math.max(0, app.skipCount - 1);
        console.log('inside: "close active tab"');
        
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          if (tabs[0]) {
            chrome.tabs.remove(tabs[0].id, resolve);
          }
        });
      });
    }).then(() => {
      console.log('resolved closing active-tab')
    })
    
  }
  
  if (command === "close-active-tab") {
    // skipCount = Math.max(0, skipCount - 1)
    console.log('"close active tab"');
    
    return app.p = app.p.then(() => {
      return new Promise((resolve) => {
        
        setTimeout(resolve, 5000);
        app.skipCount = Math.max(0,app.skipCount - 1);
        console.log('inside: "close active tab"');
        
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          if (tabs[0]) {
            chrome.tabs.remove(tabs[0].id, resolve);
          }
        });
      });
    }).then(() => {
      console.log('resolved closing active-tab')
    })
    
  }
  
  if (command === "go-to-oldest-tab") {
    
    console.log('got: go to oldest tab');
    
    return app.p = app.p.then(() => {
      return new Promise((resolve) => {
        
        const count = app.skipCount = 0;
        console.log('inside: go to oldest tab');
        // setTimeout(resolve, 5000);
        
        chrome.storage.sync.get(['tabs'], res => {
          
          const tabs = JSON.parse(res.tabs || {});
          
          const sorted = Object.entries(tabs).sort((a, b) => {
            return a[1].time - b[1].time;
          });
          
          const item = sorted[count];
          
          if (!(item && item[1])) {
            console.error('missing item at index:', count)
            resolve();
            return;
          }
          
          // chrome.windows.update(tab.windowId, { focused: true });
          let id = item[1].id;
          
          if (typeof id === 'string') {
            id = parseInt(id)
          }
          
          chrome.tabs.get(id, (tab) => {
            if (tab) {
              console.log('tab exists')
              chrome.tabs.update(tab.id, {active: true}, resolve);
            } else {
              console.log('tab does not exist')
              const tabs = JSON.parse(res.tabs || '{}')
              delete tabs[id];
              chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, resolve);
            }
          });
          
        });
      }).then(() => {
        console.log('resolved go to oldest tab')
      })
    });
    
  }
  
  if (command === "go-to-next-oldest-tab") {
    console.log('go to next oldest tab');
    
    return app.p = app.p.then(() => {
      return new Promise(resolve => {
        
        // setTimeout(resolve, 5000);
        console.log('inside: "go to next oldest tab"');
        
        chrome.storage.sync.get(['tabs'], res => {
          
          const tabs = JSON.parse(res.tabs || {});
          
          const sorted = Object.entries(tabs).sort((a, b) => {
            return a[1].time - b[1].time;
          });
          
          const count = app.skipCount; //= Math.min(sorted.length - 1, app.skipCount + 1);
          const item = sorted[count];
          
          if (!(item && item[1])) {
            console.error('missing item at index:', count);
            resolve();
            return;
          }
          
          let id = item[1].id;
          
          if (typeof id === 'string') {
            id = parseInt(id)
          }
          
          chrome.tabs.get(id, (tab) => {
            if (chrome.runtime.lastError) {
              // Handle the error
              // console.error("Error:", chrome.runtime.lastError.message);
            }
            if (tab) {
              chrome.tabs.update(id, {active: true}, resolve);
            } else {
              const tabs = JSON.parse(res.tabs || '{}')
              delete tabs[id];
              chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, resolve);
            }
          });
          
          
        });
      });
    }).then(() => {
      console.log('resolved going to next oldest tab')
    })
  }
});

// Listen for when a new tab is opened
chrome.tabs.onCreated.addListener(function (tab) {
  // Store the tab ID and the current time
  return app.p = app.p.then(() => {
    return new Promise((resolve) => {
      // setTimeout(resolve, 5000);
      console.log('opened tab:', tab.id)
      const id = parseInt(typeof tab.id === 'string' ? tab.id : String(tab.id))
      chrome.storage.sync.get(['tabs'], res => {
        const tabs = JSON.parse(res.tabs || '{}')
        tabs[id] = {id, time: Date.now()};
        chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, resolve);
      });
    });
  }).then(() =>{
    console.log('resolved opening new tab')
  });
});


chrome.tabs.onRemoved.addListener(function (tabId) {
  // Store the tab ID and the current time
  return app.p = app.p.then(() => {
    return new Promise((resolve) => {
      console.log('closed tab:', tabId);
      
      // setTimeout(resolve, 5000);
      const id = typeof tabId === 'string' ? tabId : String(tabId)
      chrome.storage.sync.get(['tabs'], res => {
        const tabs = JSON.parse(res.tabs || '{}')
        delete tabs[id];
        chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, resolve);
      });
    });
  }).then(() =>{
    console.log('resolved closing tab')
  })
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
  return app.p = app.p.then(() => {
    return new Promise((resolve) => {
      // setTimeout(resolve, 5000);
      const id = activeInfo.tabId;
      chrome.storage.sync.get(['tabs'], res => {
        const tabs = JSON.parse(res.tabs || '{}')
        let t = tabs[id];
        if (!t) {
          t = tabs[id] = {id}
        }
        t.time = Date.now();
        chrome.storage.sync.set({tabs: JSON.stringify(tabs)}, resolve);
      });
    });
  }).then(() =>{
    console.log('resolved activating new tab')
  })
  
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
      chrome.tabs.query({currentWindow: true}, function (tabs) {
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
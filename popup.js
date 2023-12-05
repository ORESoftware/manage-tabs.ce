// Define your task here

const myList = [
    '//wellsfargo.com',
    '.wellsfargo.com',

    '//facebook.com',
    '.facebook.com',

    '//youtube.com',
    '.youtube.com',

    '//chat.openai.com',
    '.chat.openai.com',

    '//confluence.esteeonline.com',
    '.confluence.esteeonline.com',

    '//jira.esteeonline.com',
    '.jira.esteeonline.com',

    '//liveperson.com',
    '.liveperson.com',

    '//liveperson.net',
    '.liveperson.net',

    '//boo.world',
    '.boo.world',

    '//match.com',
    '.match.com',

    '//maps.google.com',
    '.maps.google.com',

    '//translate.google.com',
    '.translate.google.com',

    '//docs.google.com',
    '.docs.google.com',

    '//mail.google.com',
    '.mail.google.com',

    '//calendar.google.com',
    '.calendar.google.com',

    '//stackoverflow.com',
    '.stackoverflow.com',

    '//github.com',
    '.github.com',

];

const notList = [
    'stackoverflow.com/questions/ask'

]

// Function to call with each value
function processValue(value) {
    console.log("Processing:", value);
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            console.log('tab.url', tab.url);
            if (tab.url && tab.url.match(value)) {
                if(!notList.some(v => {
                    return tab.url.match(v)
                })){
                    chrome.tabs.remove(tab.id);
                }

            }
        });
    });
}

function sortTabs() {
    chrome.tabs.query({}, function(tabs) {
        // Sort tabs based on the stored opening time
        tabs.sort((a, b) => tabsOpened[a.id] - tabsOpened[b.id]);

        // Rearrange tabs
        tabs.forEach((tab, index) => {
            chrome.tabs.move(tab.id, { index: index });
        });
    });
}

function openOrFocusTab(url) {
    chrome.tabs.query({}, function(tabs) {
        var existingTab = tabs.find(tab => tab.url && tab.url.includes(url));
        if (existingTab) {
            chrome.tabs.update(existingTab.id, { selected: true });
        } else {
            chrome.tabs.create({ url: `https://${url}` });
        }
    });
}


// Counter to keep track of the current index
let currentIndex = 0;

// Function to handle keydown events
function handleKeyDown() {
    // Call the function with the current value
    processValue(myList[currentIndex]);

    // Increment the index, reset if it exceeds the list length
    currentIndex = (currentIndex + 1) % myList.length;
    document.getElementById('foo').innerText = myList[currentIndex];

}

// Attach the event listener to the window or specific element
document.getElementById('foo').innerText = myList[currentIndex];
document.getElementById('startButton').addEventListener('click', event => {
    handleKeyDown();
});
window.addEventListener('keydown', event => {
    if (event && event.key === 'Enter') {
        handleKeyDown();
    }
});




// Define your task here

const myList = [
    '//wellsfargo.com',
    '//facebook.com',
    '.facebook.com',
    '//youtube.com',
    '//chat.openai.com',
    '//confluence.esteeonline.com',
    '//jira.esteeonline.com',
    '//liveperson.com',
    '//liveperson.net',
    '.liveperson.net'
];

// Function to call with each value
function processValue(value) {
    console.log("Processing:", value);
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            console.log('tab.url', tab.url);
            if (tab.url && tab.url.includes(value)) {
                chrome.tabs.remove(tab.id);
            }
        });
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



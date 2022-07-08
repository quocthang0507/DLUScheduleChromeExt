// Extension event listeners are a little different from the patterns you may have seen in DOM or
// Node.js APIs. The below event listener registration can be broken in to 4 distinct parts:
//
// * chrome      - the global namespace for Chrome's extension APIs
// * runtime     – the namespace of the specific API we want to use
// * onInstalled - the event we want to subscribe to
// * addListener - what we want to do with this event
//
// See https://developer.chrome.com/docs/extensions/reference/events/ for additional details.
chrome.runtime.onInstalled.addListener(function () {
    // this runs ONE TIME ONLY (unless the user reinstalls your extension)
    console.log("The Extension is installed!");
});

const dayOfWeeks = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const colorOfDay = ['#00ff00', '#ff8000', '#ff0000']; //green, orange, red color
const i = new Date().getDay();

chrome.action.setBadgeText({ text: dayOfWeeks[i] });
chrome.action.setBadgeBackgroundColor({ color: colorOfDay[i % 3] });

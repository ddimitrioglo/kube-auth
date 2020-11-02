'use strict';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if ('ping' === request.message) {
    sendResponse({ message: 'pong' });
  }
});

// console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
console.log('TBU...');

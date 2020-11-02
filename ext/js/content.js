'use strict';

chrome.runtime.sendMessage({ message: 'ping' }, (response) => {
  if ('pong' === response.message) {
    console.log('JQuery version', $().jquery);
  }
});

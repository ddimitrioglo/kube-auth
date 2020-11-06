'use strict';

/**
 * Generate unique ID
 * @returns {string}
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = 'x' === c ? r : (r & 0x3 | 0x8);

    return v.toString(16);
  });
}

/**
 * Chrome storage wrapper
 */
class Store {
  #map;

  constructor(values = {}) {
    this.#map = new Map(Object.entries(values));
  }

  json() {
    return Object.fromEntries(this.#map);
  }

  get(key) {
    return this.#map.get(key);
  }

  set(key, value) {
    this.#map.set(key, value);
    chrome.storage.local.set({ [key]: value });

    return this;
  }

  keys() {
    return Object.keys(Object.fromEntries(this.#map));
  }

  delete(key) {
    this.#map.delete(key);
    chrome.storage.local.remove(key);
  }
}

const storage = new Store();

/**
 * @param {string} action
 * @param {any} [payload]
 * @returns {Promise<{data, error}>}
 */
async function doAction(action, payload) {
  const hostName = 'kube.auth.host';

  return new Promise((resolve) => {
    chrome.runtime.sendNativeMessage(hostName, { action, payload }, (result) => {
      return resolve(result);
    });
  });
}

/**
 * @param {string} clusterId
 * @returns {Promise<void>}
 */
async function refreshToken(clusterId) {
  const config = storage.get(clusterId);

  return doAction('nm.token.get', { cluster: config.cluster, profile: config.profile }).then(res => {
    if (res.error) {
      throw new Error(res.error);
    }

    config.token = res.data || {};
    storage.set(clusterId, config);
  });
}

/**
 * @note all actions should be prefixed by `bg.*` (means background)
 * @param {{action, payload}} request
 * @param {chrome.runtime.MessageSender} sender
 * @returns {Promise<{data, error}>}
 */
async function requestHandler(request, sender) {
  switch (request.action) {
    case 'bg.storage.list':
      return { data: storage.json() };
    case 'bg.storage.add':
      storage.set(uuid(), request.payload);
      return { data: storage.json() };
    case 'bg.storage.del':
      storage.delete(request.payload);
      return { data: storage.json() };
    default:
      return { error: 'No matching action found' };
  }
}

function headersMiddleware(details) {
  for (const clusterId of storage.keys()) {
    const config = storage.get(clusterId);

    // If request is not from configured list, skip it
    if (config.domain !== details.initiator) {
      continue;
    }

    if (!config.token) {
      // Generate token
      void refreshToken(clusterId);
      continue;
    }

    if (config.token.expiresAt < Date.now()) {
      // Renew token (the original is still valid)
      void refreshToken(clusterId);
    }

    details.requestHeaders.push({
      name: 'authorization',
      value: `Bearer ${config.token.value}`,
    });

    return { requestHeaders: details.requestHeaders };
  }

}

// Check if Native Messaging is properly configured
doAction('nm.handshake')
  .then((result = {}) => {
    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message);
    }

    console.info('Native messaging is ready', result);
    return Promise.resolve();
  })
  // Populate storage with data from storage
  .then(() => {
    return new Promise((resolve) => {
      chrome.storage.local.get((values) => {
        Object.entries(values || {}).forEach(([uuid, config]) => {
          storage.set(uuid, config);
        });

        return resolve();
      });
    });
  })
  // Initialize listeners
  .then(() => {
    // Main message listener (async)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      requestHandler(request, sender).then(sendResponse);
      return true;
    });

    // Headers listener (sync)
    chrome.webRequest.onBeforeSendHeaders.addListener(
      headersMiddleware,
      { urls: ["<all_urls>"], types: ['main_frame', 'xmlhttprequest'] },
      ['blocking', 'requestHeaders'],
    );
  })
  .catch(error => {
    console.warn('KubeAuth error', error.message, error.stack);
  });

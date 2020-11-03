'use strict';

/**
 * Generate unique ID
 * @returns {string}
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Chrome storage wrapper
 */
class Store {
  #map;

  /**
   * @returns {Promise<Map>}
   */
  async #getMap() {
    if (this.#map) {
      return this.#map;
    }

    return new Promise((resolve) => {
      chrome.storage.local.get((values) => {
        this.#map = new Map(Object.entries(values));
        return resolve(this.#map);
      });
    });
  }

  /**
   * Return plain json and save to local storage
   * @returns {Promise<Object>}
   */
  async toJson() {
    const map = await this.#getMap();
    const data = Object.fromEntries(map);

    return new Promise((resolve) => {
      chrome.storage.local.set(data, () => {
        return resolve(data);
      });
    })
  }

  async get(key) {
    const map = await this.#getMap();
    return map.get(key);
  }

  async set(key, value) {
    const map = await this.#getMap();
    return map.set(key, value);
  }

  async keys() {
    const map = await this.#getMap();
    return Object.keys(Object.fromEntries(map));
  }

  async delete(key) {
    const map = await this.#getMap();
    return map.delete(key);
  }
}

const storage = new Store();

/**
 * @param {{action, payload}} request
 * @param {chrome.runtime.MessageSender} sender
 * @returns {Promise<{data, error}>}
 */
async function requestHandler(request, sender) {
  switch (request.action) {
    case 'handshake':
      return {};
    case 'storage.get':
      return { data: await storage.toJson() };
    case 'storage.add':
      await storage.set(uuid(), request.payload);
      return { data: await storage.toJson() };
    case 'storage.del':
      await storage.delete(request.payload);
      return { data: await storage.toJson() };
    default:
      return { error: 'No matching action found' };
  }
}

/**
 * Main message listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  requestHandler(request, sender).then(sendResponse);
  return true;
});

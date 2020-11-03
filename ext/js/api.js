'use strict';

/**
 * @param {string} action
 * @param {any} [payload]
 * @returns {Promise<any>}
 */
async function handleAction(action, payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action, payload }, (res) => {
      if (res?.error) {
        return reject(res?.error);
      }

      return resolve(res?.data);
    });
  });
}

/**
 * Establish connection with background script (maybe even with native host)
 * @returns {Promise<void>}
 */
async function handshake() {
  return handleAction('handshake');
}

/**
 * Get list of configured clusters
 * @returns {Promise<Object>}
 */
async function listClusters() {
  return handleAction('storage.get');
}

/**
 * Add new cluster configuration
 * @param {Object} config
 * @returns {Promise<Object>}
 */
async function addCluster(config) {
  return handleAction('storage.add', config);
}

/**
 * Remove cluster configuration
 * @param {string} uuid
 * @returns {Promise<Object>}
 */
async function removeCluster(uuid) {
  return handleAction('storage.del', uuid);
}

window.KubeAuth = {
  handshake,
  listClusters,
  addCluster,
  removeCluster,
};

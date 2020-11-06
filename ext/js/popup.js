'use strict';

const app = new Vue({
  el: '#app',
  data: {
    domain: '',
    cluster: '',
    profile: '',
    clusters: {},
  },
  created: async function () {
    this.listClusters().then(map => this.clusters = map);
  },
  methods: {
    resetForm: function () {
      this.domain = '';
      this.cluster = '';
      this.profile = '';
    },
    listClusters: async function() {
      return this.fetch('bg.storage.list');
    },
    addCluster: async function () {
      const data = {
        cluster: this.cluster,
        domain: this.domain,
        profile: this.profile
      };
      this.clusters = await this.fetch('bg.storage.add', data);
      this.resetForm();
    },
    removeCluster: async function (uuid) {
      this.clusters = await this.fetch('bg.storage.del', uuid);
    },
    fetch: async function (action, payload) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action, payload }, (res) => {
          if (res?.error) {
            return reject(res?.error);
          }

          return resolve(res?.data);
        });
      });
    }
  }
});

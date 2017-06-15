'use strict';

const fs = require('fs');
const Twig = require('twig');
const https = require('https');

class EmailTemplate {

  /**
   * @param path
   * @param data
   */
  constructor(path, data) {
    this._path = path;
    this._data = data;
  }

  /**
   * Render template with given variables
   * @returns {Promise}
   */
  render() {
    return this._getFileContent().then(res => {
      return Promise.resolve(Twig.twig({data: res.toString()}).render(this._data));
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  /**
   * Get file content (external url or relative path)
   * @returns {Promise}
   * @private
   */
  _getFileContent() {
    return new Promise((resolve, reject) => {
      if (EmailTemplate.urlRegexp.test(this._path)) {
        https.get(this._path, res => {
          let rawData = '';

          res.on('data', data => {rawData += data;});
          res.on('end', () => {
            resolve(rawData);
          });
        }).on('error', err => {
          reject(err);
        });
      } else {
        fs.readFile(this._path, (err, result) => {
            return (err) ? reject(err) : resolve(result);
          }
        );
      }
    });
  }

  /**
   * @returns {RegExp}
   */
  static get urlRegexp() {
    return /^http(s)?.\/\//i;
  }

}

module.exports = EmailTemplate;

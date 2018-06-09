'use strict';

const https = require('https');

class CaptchaChecker {
  /**
   * @param captchaSecret
   * @param captchaResponse
   */
  constructor(captchaSecret, captchaResponse) {
    this._secret = captchaSecret;
    this._response = captchaResponse;
  }

  /**
   * Check if reCaptcha response is valid
   * @returns {Promise}
   */
  checkCaptcha() {
    return new Promise((resolve, reject) => {
      https.get(this._getVerifyUrl(), res => {
        let rawData = '';

        res.on('data', data => {rawData += data;});
        res.on('end', () => {
          resolve(JSON.parse(rawData));
        });

      }).on('error', err => {
        reject(err);
      });
    });
  }

  /**
   * Build Google recaptcha verify url
   * @returns {string}
   * @private
   */
  _getVerifyUrl() {
    return `https://www.google.com/recaptcha/api/siteverify?secret=${this._secret}&response=${this._response}`
  }
}

module.exports = CaptchaChecker;

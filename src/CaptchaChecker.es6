'use strict';

import https from 'https';

export class CaptchaChecker {

  /**
   * @param captchaSecret
   * @param captchaResponse
   */
  constructor(captchaSecret, captchaResponse) {
    this._secret = captchaSecret;
    this._response = captchaResponse;
  }

  /**
   * Check if recaptcha response is valid
   * @returns {Promise}
   */
  checkCaptcha() {
    return new Promise((resolve, reject) => {
      https.get(this._getVerifyUrl(), res => {
        let rawData = '';

        res.on('data', (chunk) => {rawData += chunk;});
        res.on('end', () => {resolve(rawData);});

      }).on('error', (err) => {
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

'use strict';

class Command {
  /**
   * @param options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @return {Promise<any>}
   */
  validate() {
    return Promise.resolve();
  }

  /**
   * @param {String} full
   * @param {String} short
   * @param {any} [defaultVal]
   * @return {any}
   */
  getOption(full, short, defaultVal) {
    return this.options[full] || this.options[short] || defaultVal;
  }

  /**
   * @abstract
   * @return {Promise<any>}
   */
  run() {
    return Promise.reject('`run()` is not implemented');
  }
}

module.exports = Command;

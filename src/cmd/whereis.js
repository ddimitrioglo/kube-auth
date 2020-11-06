'use strict';

const { join } = require('path');
const Command = require('../command');

class WhereIsCommand extends Command {
  /**
   * @return {Promise<void>}
   */
  async run() {
    console.log(join(__dirname, '../../dist'));
  }
}

module.exports = WhereIsCommand;

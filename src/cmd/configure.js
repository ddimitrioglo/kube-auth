'use strict';

const getos = require('getos');
const { join } = require('path')
const { homedir } = require('os');
const { outputFileSync, readFileSync, removeSync, chmodSync, copy } = require('fs-extra');
const Util = require('../util');
const Command = require('../command');

class ConfigureCommand extends Command {
  /**
   * @return {Promise<void>}
   */
  async run() {
    const os = await this.getOs();

    if ('win32' === os) {
      throw Error('Windows is not supported yet...');
    }

    const dist = join(__dirname, '../../dist');
    const hostExecTempPath = join(__dirname, '../tmpl/host.js.twig');
    const hostExecDestPath = join(dist, 'host.js');
    const hostTmplPath = join(__dirname, `../tmpl/${Util.hostName()}.json.twig`);
    const hostDestPath = this.getHostPath(os, this.getOption('browser', 'b', 'chrome').toLowerCase());

    removeSync(hostExecDestPath);

    outputFileSync(hostExecDestPath, await Util.render(readFileSync(hostExecTempPath, 'utf8'), {
      interpreter: process.execPath,
    }));

    outputFileSync(hostDestPath, await Util.render(readFileSync(hostTmplPath, 'utf8'), {
      path: hostExecDestPath,
      extensionId: Util.extensionId(),
    }));

    // @note needed only for unix systems
    chmodSync(hostExecDestPath, '755');

    await copy(join(__dirname, '../../ext'), dist);

    console.log('Done');
  }

  /**
   * @param {'darwin'|'win32'|'linux'} os
   * @param {'chrome'|'chromium'|'mozilla'} browser
   * @returns {string}
   */
  getHostPath(os, browser) {
    switch (os) {
      case 'darwin':
        if ('chrome' === browser) {
          // ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/host.json
          return join(homedir(), '/Library/Application Support/Google/Chrome/NativeMessagingHosts', `${Util.hostName()}.json`)
        }
        // ~/Library/Application Support/Chromium/NativeMessagingHosts/host.json
        // ~/Library/Application Support/Mozilla/NativeMessagingHosts/host.json
        throw new Error('Unsupported browser');
      case 'linux':
        if ('chrome' === browser) {
          // ~/.config/google-chrome/NativeMessagingHosts/host.json
          return join(homedir(), '.config/google-chrome/NativeMessagingHosts', `${Util.hostName()}.json`)
        }
        // ~/.config/chromium/NativeMessagingHosts/host.json
        // ~/.mozilla/native-messaging-hosts/host.json
        throw new Error('Unsupported browser');
      case 'win32':
        // C:\Users\<Username>\AppData + REG ADD ???
        // HKEY_CURRENT_USER\Software\Mozilla\NativeMessagingHosts\host
        throw new Error('Unsupported browser');
      default:
        throw new Error('Unknown OS');
    }
  }

  /**
   * @returns {Promise<'darwin'|'win32'|'linux'>}
   */
  async getOs() {
    return new Promise((resolve, reject) => {
      getos((err, os) => {
        if (err) {
          return reject(err);
        }

        resolve(os.os);
      });
    });
  }
}

module.exports = ConfigureCommand;

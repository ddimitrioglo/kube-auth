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
    const browser = this.getOption('browser', 'b', 'chrome').toLowerCase();

    const dist = join(__dirname, '../../dist');
    const hostExecTempPath = join(__dirname, '../tmpl/host.js.twig');
    const hostExecDestPath = join(dist, 'host.js');
    const hostTmplPath = join(__dirname, `../tmpl/${Util.hostName()}.json.twig`);
    const hostDestPath = this.getHostPath(os, browser);

    removeSync(hostExecDestPath);

    outputFileSync(hostExecDestPath, await Util.render(readFileSync(hostExecTempPath, 'utf8'), {
      interpreter: process.execPath,
    }));

    outputFileSync(hostDestPath, await Util.render(readFileSync(hostTmplPath, 'utf8'), {
      path: hostExecDestPath,
      extensionId: Util.extensionId(),
    }));

    if ('win32' === os) {
      // REG ADD ???
      throw Error('Windows is not supported yet...');
    } else {
      chmodSync(hostExecDestPath, '755');
    }

    await copy(join(__dirname, '../../ext'), dist);

    console.log('Done');
  }

  /**
   * @link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#Manifest_location
   * @param {'darwin'|'win32'|'linux'} os
   * @param {'chrome'|'chromium'|'mozilla'} browser
   * @returns {string}
   */
  getHostPath(os, browser) {
    switch (os) {
      case 'darwin':
        if ('chrome' === browser) {
          // ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/<name>.json
          return join(homedir(), '/Library/Application Support/Google/Chrome/NativeMessagingHosts', `${Util.hostName()}.json`)
        }
        // ~/Library/Application Support/Mozilla/NativeMessagingHosts/<name>.json
        // ~/Library/Application Support/Chromium/NativeMessagingHosts/<name>.json
        throw new Error('Unsupported browser');
      case 'linux':
        if ('chrome' === browser) {
          // ~/.config/google-chrome/NativeMessagingHosts/<name>.json
          return join(homedir(), '.config/google-chrome/NativeMessagingHosts', `${Util.hostName()}.json`)
        }
        // ~/.config/chromium/NativeMessagingHosts/<name>.json
        // ~/.mozilla/native-messaging-hosts/<name>.json
        throw new Error('Unsupported browser');
      case 'win32':
        // If there is no strict location of host (bridge) file, then let's keep it inside the package
        return join(join(__dirname, '../../dist', `${Util.hostName()}.json`));
        // HKEY_CURRENT_USER\SOFTWARE\Mozilla\NativeMessagingHosts\<name>
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

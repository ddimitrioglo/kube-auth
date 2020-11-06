#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const parseArgs = require('minimist');
const { version } = require('../package');

const command = create();

command
  .validate()
  .then(() => command.run())
  .then(message => {
    if (message) {
      console.info('✅', message);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌', err.message || err || 'Error occurred');
    process.exit(1);
  });

/**
 * Command factory
 * @returns {Object}
 */
function create() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._.shift();

  try {
    const Command = require(path.join(__dirname, './cmd', command));
    delete args._;

    return new Command(args);
  } catch (e) {
    const help = fs.readFileSync(path.join(__dirname, './help.txt'), 'utf8');
    const output = args.hasOwnProperty('v') || args.hasOwnProperty('version') ? version : help;

    console.log(output);
    process.exit(0);
  }
}

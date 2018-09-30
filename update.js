import DotEnv from 'dotenv';

import Prompt from 'prompt';

import User from './app/model/user';

DotEnv.config();

Prompt.start();
const Schema = {
  properties: {
    continue: {
      description: 'Continue?',
      required: true,
      default: 'Y',
    },
  },
};

console.log('\x1b[47m\x1b[35m', 'ribbon Update', '\x1b[0m');
console.log('\x1b[47m\x1b[35m', 'Note that this upgrade script will only work on ribbon 2018.9.17', '\x1b[0m');

/*
 * Script for future use.
 */

Prompt.get(Schema, async (prompt_err, prompt) => {
  if (prompt.continue.toLowerCase() === 'y') {
    await User.update({}, { group: 1 }, { multi: true });

    console.log('\x1b[42m\x1b[30m', 'Update successful.', '\x1b[0m');
    console.log('\x1b[42m\x1b[30m', 'Restart ribbon to implement changes.', '\x1b[0m');
    process.exit();
  } else {
    console.log('\x1b[41m\x1b[37m', 'Update cancelled.', '\x1b[0m');
    process.exit();
  }
});

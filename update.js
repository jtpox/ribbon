import DotEnv from 'dotenv';

import Prompt from 'prompt';

import Https from 'https';

DotEnv.config();

Prompt.start();
const Schema = {
  properties: {
    version: {
      description: 'Upgrade from',
      required: true,
      default: '2018.7.11',
    },
  },
};

console.log('\x1b[47m\x1b[35m', 'ribbon Update', '\x1b[0m');

/*
 * Script for future use.
 */

Prompt.get(Schema, async (prompt_err, prompt) => {
  /* Https.get('https://ribbon.jtpox.com/info.json', (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(JSON.parse(data));
    });
  }).on('error', (err) => {
    console.log(`Error: ${err}`);
  }); */

  /* switch (prompt.version) {
    case '2018.6.30':
      break;

    default:
      break;
  }

  console.log('\x1b[42m\x1b[30m', 'Update successful.', '\x1b[0m');
  console.log('\x1b[42m\x1b[30m', 'Restart ribbon to implement changes.', '\x1b[0m');
  process.exit(); */
});

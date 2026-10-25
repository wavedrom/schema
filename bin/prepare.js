#!/usr/bin/env node
'use strict';

const fs = require('fs');
const schema = require('../lib/standalone.js');

async function main () {
  const text = JSON.stringify(schema, null, 2) + '\n';
  await fs.promises.writeFile('./waveschema.json', text, 'utf8');
}

main();

#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const schema = require('../lib/');

async function main () {
  const text = JSON.stringify(schema, null, 2);
  await fs.outputFile('./waveschema.json', text, 'utf8');
}

main();

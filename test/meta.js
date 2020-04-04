'use strict';

const Ajv = require('ajv');
const meta = require('ajv/lib/refs/json-schema-draft-06.json');
const lib = require('../lib/');

describe('meta', () => {
  it('any', async () => {
    const ajv = new Ajv({schemaId: 'auto'});
    const validate = ajv
      .addMetaSchema(meta)
      .compile({});
    validate(lib.any);
  });
});

/* eslint-env mocha */

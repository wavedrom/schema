'use strict';

// Import a self-contained draft-07 schema published by a rendering package
// (bit-field, logidrom) as a set of 'defs' definitions:
//   main schema -> defs[name], definitions -> defs[key]
// '#/definitions/x' references are rewritten into 'defs#/x'

const toDefs = obj => JSON.parse(
  JSON.stringify(obj).replace(/"#\/definitions\//g, '"defs#/')
);

module.exports = (name, schema) => {
  // eslint-disable-next-line no-unused-vars
  const {$schema, $id, definitions, ...main} = toDefs(schema);
  return {[name]: main, ...definitions};
};

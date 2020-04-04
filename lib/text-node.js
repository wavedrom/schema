'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'object',
  description: 'head / foot note text of JSONML',
  properties: {
    text: ref('textSpan'),
    tick: {type: 'number' },
    tock: {type: 'number' }
  }
};

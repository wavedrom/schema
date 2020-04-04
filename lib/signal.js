'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'object',
  required: ['signal'],
  properties: {
    signal: {
      type: 'array',
      items: {
        oneOf: [
          ref('waveLane'),
          ref('waveGroup')
        ]
      }
    },
    head: ref('textNode'),
    foot: ref('textNode'),
    edge: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    config: {
      type: 'object',
      properties: {
        hscale: {
          type: 'number',
          minimum: 1
        }
      }
    }
  }
};

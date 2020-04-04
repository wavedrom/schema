'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'array',
  items: {
    oneOf: [
      {type: 'string'},
      ref('waveLane'),
      ref('waveGroup')
    ]
  }
};

'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'array',
  title: 'wave group',
  description: 'Group of wave lanes. Optional first string element is the group label. Groups can be nested.',
  items: {
    oneOf: [
      {type: 'string'},
      ref('waveLane'),
      ref('waveGroup')
    ]
  }
};

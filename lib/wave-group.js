'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'array',
  title: 'wave group',
  description: 'Group of wave lanes drawn with a bracket on the left. Optional first element (string or number) is the group label. Groups can be nested.',
  items: {
    oneOf: [
      {type: 'string', description: 'Group label (only the first element is used as label, other strings are ignored)'},
      {type: 'number', description: 'Group label (only the first element is used as label, other numbers are ignored)'},
      ref('waveLane'),
      ref('waveGroup')
    ]
  }
};

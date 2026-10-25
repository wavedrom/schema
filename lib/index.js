'use strict';

const ref = require('./ref.js');
const jsonml = require('./jsonml.js');
const waveLane = require('./wave-lane.js');
const waveGroup = require('./wave-group.js');
const textNode = require('./text-node.js');
const textSpan = require('./text-span.js');
const signal = require('./signal.js');
const fragment = require('./fragment.js');

// diagram kinds owned by the rendering packages
const assign = fragment('assign', require('logidrom/lib/schema.js'));
const reg = fragment('reg', require('bit-field/lib/schema.js'));

// {required: [key]} with matching properties (keeps Ajv strictRequired happy)
const has = key => ({properties: {[key]: true}, required: [key]});

exports.defs = {
  $id: 'defs',
  ...assign,
  ...reg,
  // text definitions: own copy wins (test checks that fragments agree)
  jsonml,
  textNode,
  textSpan,
  waveLane,
  waveGroup,
  signal
};

exports.fragments = {assign, reg};

// WaveDrom picks the diagram kind by the first present key: signal > assign > reg
// if / then / else gives targeted error messages (unlike oneOf)
exports.any = {
  type: 'object',
  properties: {
    signal: {description: 'Timing diagram: list of wave lanes and groups'},
    assign: {description: 'Logic circuit: list of assignments'},
    reg: {description: 'Bit-field (register) diagram: list of fields'}
  },
  if: has('signal'),
  then: ref('signal'),
  else: {
    if: has('assign'),
    then: ref('assign'),
    else: {
      if: has('reg'),
      then: ref('reg'),
      else: {
        description: 'Root object must have "signal", "assign" or "reg" property',
        anyOf: [
          has('signal'),
          has('assign'),
          has('reg')
        ]
      }
    }
  }
};

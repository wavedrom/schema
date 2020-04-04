'use strict';

const waveLane = require('./wave-lane.js');
const waveGroup = require('./wave-group.js');
const textNode = require('./text-node.js');
const textSpan = require('./text-span.js');
const signal = require('./signal.js');
const assign = require('./assign.js');
const reg = require('./reg.js');

module.exports = {
  defs: {
    $id: 'defs',
    textNode,
    textSpan,
    waveLane,
    waveGroup,
    signal,
    assign,
    reg
  },
  any: {oneOf: [signal, assign, reg]}
};

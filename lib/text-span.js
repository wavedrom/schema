'use strict';

const ref = require('./ref.js');

module.exports = {
  description: 'Text: plain string with optional inline markup <b> <i> <o> (overline) <ins> (underline) <s> (strike) <sub> <sup> <tt> (monospace), e.g. "CS<sub>n</sub>", "<o>RST</o>"; or a number; or JsonML (SVG tspan) markup, e.g. ["tspan", {"class": "h1"}, "Title"]',
  oneOf: [
    {type: 'string'},
    {type: 'number'},
    ref('jsonml')
  ]
};

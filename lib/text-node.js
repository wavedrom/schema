'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'object',
  description: 'Header / footer of the timing diagram',
  properties: {
    text: {
      ...ref('textSpan'),
      description: 'Title text, plain string or JsonML (SVG tspan) markup'
    },
    tick: {
      type: 'number',
      description: 'Draw tick marks with cycle numbers aligned to the clock edges, starting from this number'
    },
    tock: {
      type: 'number',
      description: 'Draw tock marks with cycle numbers placed between clock edges, starting from this number'
    },
    every: {
      type: 'integer',
      minimum: 1,
      description: 'Show only every N-th tick / tock label'
    }
  }
};

'use strict';

const ref = require('./ref.js');

const tickTock = (title, where) => ({
  description: title + ' ' + where + '. Number N: sequential cycle labels N, N+1, N+2, ... (shifted by config.hbounds[0]). String: space-separated explicit labels, e.g. "A B C" (note: WaveDrom 3.x appends the hbounds offset to the string, so the last label becomes "C0"; prefer a number).',
  oneOf: [
    {type: 'number'},
    {type: 'string'}
  ]
});

module.exports = {
  type: 'object',
  description: 'Header / footer of the timing diagram',
  properties: {
    text: {
      ...ref('textSpan'),
      description: 'Title text (plain string, inline <b>/<i>/<sub>... markup, or JsonML tspan markup), rendered centered'
    },
    tick: tickTock('Tick labels', 'aligned to the cycle boundaries (clock edges)'),
    tock: tickTock('Tock labels', 'placed in the middle of each cycle'),
    every: {
      type: 'integer',
      minimum: 1,
      description: 'Show only every N-th tick / tock label (labels whose value is divisible by N). Works only with numeric tick / tock.'
    }
  }
};

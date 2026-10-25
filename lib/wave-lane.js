'use strict';

module.exports = {
  type: 'object',
  title: 'wave lane',
  description: 'Signal descriptor. Empty object {} creates a gap between lanes.',
  properties: {
    name: {
      type: 'string',
      description: 'Signal label'
    },
    wave: {
      description: 'Signal activity. One character per cycle: p n P N h l H L 0 1 = 2-9 x z u d . |',
      oneOf: [
        {type: 'string'},
        {
          type: 'array',
          description: 'Piece-wise analog wave description, e.g. ["pw", {"d": "m0,0 l1,1"}]'
        }
      ]
    },
    data: {
      description: 'Labels for data (value) cycles: array of strings, or a single space-separated string',
      oneOf: [
        {
          type: 'array',
          items: {
            oneOf: [
              {type: 'string'},
              {type: 'number'},
              {type: 'array'}
            ]
          }
        },
        {type: 'string'}
      ]
    },
    period: {
      type: 'number',
      description: 'Signal period (multiplier of a cycle width)',
      exclusiveMinimum: 0
    },
    phase: {
      type: 'number',
      description: 'Phase shift in cycles. Positive number represents shift into the future. Negative number represents shift into past (delay).'
    },
    node: {
      type: 'string',
      description: 'Named nodes used by edge arrows, one character per cycle: "." no marker, [A-Z] invisible marker, other characters visible marker'
    },
    over: {
      type: 'string',
      description: 'Colored line above the lane, one character per cycle'
    },
    under: {
      type: 'string',
      description: 'Colored line below the lane, one character per cycle'
    }
  }
};

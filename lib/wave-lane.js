'use strict';

module.exports = {
  type: 'object',
  title: 'Wave lane',
  properties: {
    name: {type: 'string'},
    wave: {type: 'string'},
    data: {
      description: 'strings for data chunks',
      oneOf: [
        {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        {
          type: 'string'
        }
      ]
    },
    period: {
      type: 'integer',
      description: 'signal period',
      minimum: 1
    },
    phase: {
      type: 'number',
      description: 'Positive number represents shift into the future. Negative number represents shift into past (delay).'
    },
    node: {
      type: 'string',
      description: 'mark wave lane with named nodes'
    }
  }
};

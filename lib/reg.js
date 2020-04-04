'use strict';

module.exports = {
  type: 'object',
  properties: {
    reg: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bits: {
            type: 'integer',
            minimum: 1},
          name: {
            type: 'string'
          },
          attr: {
            oneOf: [
              {
                type: 'string'
              },
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            ]
          },
          type: {
            type: 'integer',
            minimum: 0
          }
        }
      }
    },
    config: {
      type: 'object',
      properties: {
        hspace: {type: 'number'}
        // TODO more config options
      }
    }
  }
};

'use strict';

module.exports = {
  type: 'object',
  required: ['assign'],
  properties: {
    assign: {
      type: 'array',
      items: {
        type: 'array'
        // recursive expression tree
      }
    }
  }
};

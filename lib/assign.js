'use strict';

module.exports = {
  type: 'object',
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

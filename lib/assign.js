'use strict';

module.exports = {
  type: 'object',
  title: 'logic circuit',
  description: 'WaveDrom logic circuit (schematic) diagram\nhttps://wavedrom.com/tutorial2.html',
  required: ['assign'],
  properties: {
    assign: {
      type: 'array',
      description: 'List of assignments: ["out", expression] where expression is a nested array tree ["&", "a", ["~", "b"]]',
      items: {
        type: 'array'
        // recursive expression tree
      }
    }
  }
};

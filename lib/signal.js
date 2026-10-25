'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'object',
  title: 'timing diagram',
  description: 'WaveDrom digital timing diagram\nhttps://wavedrom.com/tutorial.html',
  required: ['signal'],
  properties: {
    signal: {
      type: 'array',
      description: 'List of wave lanes and wave groups',
      items: {
        oneOf: [
          ref('waveLane'),
          ref('waveGroup')
        ]
      }
    },
    head: {
      ...ref('textNode'),
      description: 'Diagram header'
    },
    foot: {
      ...ref('textNode'),
      description: 'Diagram footer'
    },
    edge: {
      type: 'array',
      description: 'Arrows between nodes, e.g. "a~>b label"',
      items: {
        type: 'string'
      }
    },
    config: {
      type: 'object',
      description: 'Rendering options',
      properties: {
        hscale: {
          type: 'number',
          minimum: 1,
          description: 'Horizontal scale (integer number of bricks per cycle)'
        },
        skin: {
          description: 'Skin name',
          anyOf: [
            {enum: ['default', 'narrow', 'narrower', 'narrowerer', 'lowkey', 'dark']},
            {type: 'string'}
          ]
        },
        hbounds: {
          type: 'array',
          description: 'Horizontal bounds [min, max] in cycles',
          items: {type: 'number'},
          minItems: 2,
          maxItems: 2
        },
        marks: {
          type: 'boolean',
          description: 'Draw vertical cycle marks',
          default: true
        },
        arcFontSize: {
          type: 'number',
          description: 'Font size of edge (arc) labels'
        }
      }
    }
  }
};

'use strict';

const ref = require('./ref.js');

// arrow shapes supported by WaveDrom (lib/arc-shape.js)
const shapes = [
  '-', '~', '-~', '~-', '-|', '|-', '-|-',
  '->', '~>', '-~>', '~->', '-|>', '|->', '-|->',
  '<->', '<~>', '<-~>', '<-|>', '<-|->',
  '+'
];

const esc = s => s.replace(/[|+]/g, c => '\\' + c);

// longest first, so alternation picks the full shape
const shapeRe = shapes.slice().sort((a, b) => b.length - a.length).map(esc).join('|');

// gap marks supported by WaveDrom (lib/render-gaps.js)
const gapTokens = ['.', '0', '1', '|', '2', '3', '[', ']', '(', ')', ')(', '((', '))', 's'];
const gapRe = gapTokens
  .slice().sort((a, b) => b.length - a.length)
  .map(t => t.replace(/[.|[\]()]/g, c => '\\' + c))
  .join('|');

module.exports = {
  type: 'object',
  title: 'timing diagram',
  description: 'WaveDrom digital timing diagram\nhttps://wavedrom.com/tutorial.html',
  required: ['signal'],
  properties: {
    signal: {
      type: 'array',
      description: 'List of wave lanes {name, wave, data, ...} and wave groups ["label", lane, ...]',
      items: {
        oneOf: [
          ref('waveLane'),
          ref('waveGroup')
        ]
      }
    },
    head: {
      ...ref('textNode'),
      description: 'Diagram header: title text and / or tick / tock cycle labels'
    },
    foot: {
      ...ref('textNode'),
      description: 'Diagram footer: caption text and / or tick / tock cycle labels'
    },
    edge: {
      type: 'array',
      description: 'Arrows between nodes defined in lane "node" strings',
      items: {
        type: 'string',
        description: [
          'Arrow: "<from><shape><to> [label]", e.g. "a~>b", "c-|->d 5 ns".',
          'from / to: node characters; label: rest of the string after the first space.',
          'Shapes: - straight, ~ curve, -~ / ~- curve with horizontal start / end, -| / |- corner, -|- step;',
          'append > for arrowhead (->, ~>, -~>, ~->, -|>, |->, -|->), prefix < for double-headed (<->, <~>, <-~>, <-|>, <-|->);',
          '+ straight line with tee ends (for time spans).',
          'Unknown shape is drawn as a red straight line; edges with undefined nodes are ignored.'
        ].join('\n'),
        pattern: '^\\s*\\S(' + shapeRe + ')\\S(\\s.*)?$',
        examples: ['a~>b', 'a->b label', 'c-|->d t1', 'e<->f 3 ms', 'g+h 5 ns']
      }
    },
    gaps: {
      type: 'string',
      description: [
        'Vertical gap / time-break marks across all lanes, space-separated, one token per cycle (drawn at the middle of the cycle):',
        '. - none; 0 - blank; 1 or | - single line; 2 - double line; 3 - triple line;',
        '[ ] - square bracket; ( ) - round bracket; )( (( )) - double round brackets;',
        's - wave gap (break) symbol on every lane.'
      ].join('\n'),
      pattern: '^\\s*((' + gapRe + ')(\\s+|$))*$',
      examples: ['. . 2 . . s', '. ( . ) .']
    },
    config: {
      type: 'object',
      description: 'Rendering options',
      properties: {
        hscale: {
          type: 'number',
          minimum: 1,
          maximum: 100,
          default: 1,
          description: 'Horizontal scale: width multiplier of a cycle (rounded to integer, 1..100)'
        },
        skin: {
          description: 'Skin name. Must be loaded on the page (skins/*.js); unknown skin falls back to "default". Skin applies to the whole page (first diagram).',
          default: 'default',
          anyOf: [
            {enum: ['default', 'narrow', 'narrower', 'narrowerer', 'lowkey', 'dark']},
            {type: 'string'}
          ]
        },
        hbounds: {
          type: 'array',
          description: 'Visible horizontal window [start, end] in cycles (start rounded down, end rounded up; ignored unless start < end). Shifts tick / tock labels and hides data labels before start.',
          items: {type: 'number'},
          minItems: 2,
          maxItems: 2
        },
        marks: {
          type: 'boolean',
          description: 'Draw vertical dotted cycle marks',
          default: true
        },
        arcFontSize: {
          type: 'number',
          exclusiveMinimum: 0,
          default: 11,
          description: 'Font size (px) of edge (arc) labels and node labels'
        }
      }
    }
  }
};

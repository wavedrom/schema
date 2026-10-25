'use strict';

const ref = require('./ref.js');

module.exports = {
  type: 'object',
  title: 'wave lane',
  description: 'Signal descriptor. Empty object {} creates a gap between lanes. Lane without "name" (e.g. only "node") is not drawn but still occupies a row and may carry edge nodes.',
  properties: {
    name: {
      description: 'Signal label, rendered left of the wave. Plain string (inline <b>/<i>/<sub>/<o>... markup supported) or JsonML tspan markup.',
      oneOf: [
        {type: 'string'},
        ref('jsonml')
      ]
    },
    wave: {
      description: 'Signal activity, one character per cycle (or piece-wise analog ["pw", {d}] array)',
      oneOf: [
        {
          type: 'string',
          description: [
            'One character per cycle (period):',
            'p n - clock with positive / negative edge first; P N - same with arrow;',
            'h l - high / low with sharp edge; H L - same with arrow;',
            '0 1 - low / high level; x - undefined; z - high impedance; u - pull-up (weak 1); d - pull-down (weak 0);',
            '= 2 3 4 5 6 7 8 9 - data value with color (= is color 2), labels taken from "data";',
            '. - extend previous state; | - extend and draw a gap (break) mark;',
            '< > - start / end sub-cycle group: each character inside takes one brick (half a cycle) instead of a full period.',
            'Unknown characters are rendered as "x".'
          ].join('\n'),
          pattern: '^[pnPNhHlL01=2-9xzud.|<>]*$',
          examples: ['p.....', '01.zx=ud.23.45', 'x.==.=x', 'x=<x|>=.']
        },
        {
          type: 'array',
          title: 'piece-wise wave',
          description: 'Piece-wise analog wave: ["pw", {"d": SVG path}]. Path uses relative SVG commands (m l h v q t a) where x unit = 1 cycle, y unit = lane height (positive y goes up).',
          minItems: 2,
          maxItems: 2,
          items: [
            {const: 'pw', description: 'Piece-wise wave marker'},
            {
              type: 'object',
              required: ['d'],
              properties: {
                d: {
                  description: 'SVG path data, e.g. "m0,0 l1,1 h2 l1,-1" or ["m", 0, 0, "l", 1, 1]',
                  oneOf: [
                    {type: 'string'},
                    {
                      type: 'array',
                      items: {
                        oneOf: [
                          {type: 'string'},
                          {type: 'number'}
                        ]
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    data: {
      description: 'Labels for data (value) cycles "=" and "2"-"9", in order of appearance: array of text items, or a single space-separated string "A B C". Items hidden by negative phase / hbounds are skipped.',
      oneOf: [
        {
          type: 'array',
          items: ref('textSpan')
        },
        {type: 'string'}
      ]
    },
    period: {
      type: 'number',
      description: 'Lane period: width of one wave character in cycles (default 1). E.g. 2 for half-rate clock, 0.5 for double rate.',
      exclusiveMinimum: 0,
      default: 1
    },
    phase: {
      type: 'number',
      description: 'Phase shift in cycles (default 0). Positive value shifts the wave to the left (into the past, earlier); negative to the right (delay). Wave is shifted in half-cycle steps; nodes and over / under lines use exact value.',
      default: 0
    },
    node: {
      type: 'string',
      description: 'Named nodes (anchors for "edge" arrows), one character per cycle (at cycle start, scaled by period / phase): "." - no node; uppercase letters - invisible node; other characters (lowercase, digits ...) - node with visible label. Each character should be unique across the diagram.',
      examples: ['.a..b..', '...A..B']
    },
    over: {
      type: 'string',
      description: 'Colored line above the lane (with serif marks), one character per period: "1"-"8" start a line of that color (1 black, 2 red, 3 green, 4 blue, 5 magenta, 6 olive, 7 teal, 8 violet); "0" ends the line; "." extends previous state',
      pattern: '^[.0-9]*$',
      examples: ['0.1..0', '.2.3.']
    },
    under: {
      type: 'string',
      description: 'Colored line below the lane, one character per period: "1"-"8" start a line of that color; "0" ends the line; "." extends previous state',
      pattern: '^[.0-9]*$',
      examples: ['0.1..0']
    }
  }
};

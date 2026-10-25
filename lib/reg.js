'use strict';

const strOrNum = {
  oneOf: [
    {type: 'string'},
    {type: 'number'}
  ]
};

module.exports = {
  type: 'object',
  title: 'register',
  description: 'WaveDrom bit-field (register) diagram\nhttps://github.com/wavedrom/bitfield',
  required: ['reg'],
  properties: {
    reg: {
      type: 'array',
      description: 'List of bit fields, starting from LSB',
      items: {
        type: 'object',
        properties: {
          bits: {
            type: 'integer',
            minimum: 1,
            description: 'Field width in bits'
          },
          name: {
            ...strOrNum,
            description: 'Field name'
          },
          attr: {
            description: 'Field attribute(s), rendered below the field. Number is rendered as binary.',
            oneOf: [
              {type: 'string'},
              {type: 'number'},
              {
                type: 'array',
                items: strOrNum
              }
            ]
          },
          type: {
            type: 'integer',
            minimum: 0,
            description: 'Field color type'
          },
          rotate: {
            type: 'number',
            description: 'Rotation angle of the field name (degrees)'
          }
        }
      }
    },
    config: {
      type: 'object',
      description: 'Rendering options',
      properties: {
        hspace: {type: 'number', description: 'Horizontal space', default: 640},
        vspace: {type: 'number', description: 'Vertical space', default: 80},
        lanes: {type: 'integer', minimum: 1, description: 'Number of rectangle lanes', default: 1},
        bits: {type: 'integer', minimum: 1, description: 'Overall bit width'},
        fontsize: {type: 'number', description: 'Font size', default: 14},
        fontfamily: {type: 'string', description: 'Font family', default: 'sans-serif'},
        fontweight: {type: 'string', description: 'Font weight', default: 'normal'},
        compact: {type: 'boolean', description: 'Compact format', default: false},
        hflip: {type: 'boolean', description: 'Horizontal flip', default: false},
        vflip: {type: 'boolean', description: 'Vertical flip', default: false},
        uneven: {type: 'boolean', description: 'Uneven lanes', default: false},
        trim: {type: 'number', description: 'Trim long names to this character width'},
        offset: {type: 'number', description: 'Offset of the index lanes'},
        margin: {
          type: 'object',
          description: 'Margins around the diagram',
          properties: {
            top: {type: 'number', description: 'Top margin'},
            right: {type: 'number', description: 'Right margin'},
            bottom: {type: 'number', description: 'Bottom margin'},
            left: {type: 'number', description: 'Left margin'}
          }
        },
        label: {
          type: 'object',
          description: 'Lane labels on the left / right side'
        }
      }
    }
  }
};

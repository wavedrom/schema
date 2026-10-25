'use strict';

const ref = require('./ref.js');

// JsonML (SVG) node: ["tag", {attributes}?, ...children]
module.exports = {
  type: 'array',
  title: 'JsonML',
  description: 'JsonML (SVG) markup: ["tag", {attributes}, ...children], e.g. ["tspan", {"class": "h1"}, "Title"]. Usual tag is "tspan"; children are strings, numbers or nested JsonML nodes.',
  minItems: 1,
  items: {
    description: 'First item: SVG tag name (usually "tspan"); then optional attributes object; then children',
    anyOf: [
      {type: 'string', description: 'Tag name (first item) or text'},
      {type: 'number'},
      {
        type: 'object',
        description: 'SVG attributes, e.g. {"class": "h3"}, {"fill": "red"}, {"font-weight": "bold"}, {"dy": "-5"}. Theme classes: h1..h6, muted, info, success, warning, error',
        additionalProperties: {
          oneOf: [
            {type: 'string'},
            {type: 'number'}
          ]
        }
      },
      ref('jsonml')
    ]
  }
};

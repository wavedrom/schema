'use strict';

module.exports = {
  description: 'Text as plain string or JsonML (SVG tspan) markup, e.g. ["tspan", {"class": "h1"}, "Title"]',
  oneOf: [
    {type: 'string'},
    {type: 'number'},
    {type: 'array'}
  ]
};

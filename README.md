[![NPM version](https://img.shields.io/npm/v/wavedrom-schema.svg)](https://www.npmjs.org/package/wavedrom-schema)
[![Tests](https://github.com/wavedrom/schema/workflows/Tests/badge.svg)](https://github.com/wavedrom/schema/actions)
[![Coverage Status](https://coveralls.io/repos/github/wavedrom/schema/badge.svg?branch=master)](https://coveralls.io/github/wavedrom/schema?branch=master)

[JSON Schema](https://json-schema.org/) for [WaveDrom](https://wavedrom.com)

https://observablehq.com/@drom/wavedrom-schema

## NPM Install

```sh
npm i wavedrom-schema
```

## Download

```sh
curl https://unpkg.com/wavedrom-schema/waveschema.json
```

`waveschema.json` is a self-contained [draft-07](https://json-schema.org/draft-07) schema,
also published on [SchemaStore](https://www.schemastore.org/wavedrom.json).
Editors auto-apply it to `*.wavedrom.json`, `*.wavedrom.json5`, `*.wavejson` files, or reference it explicitly:

```json
{
  "$schema": "https://www.schemastore.org/wavedrom.json",
  "signal": [{"name": "clk", "wave": "p..."}]
}
```

## Library usage

```js
const Ajv = require('ajv');
const {defs, any} = require('wavedrom-schema');
const validate = new Ajv({strict: false}).addSchema(defs).compile(any);

// or self-contained schema
const schema = require('wavedrom-schema/lib/standalone.js');
```

[WaveDrom spec](https://observablehq.com/@drom/wavedrom-schema)

## Testing

```sh
npm test
```

## License

MIT [LICENSE](LICENSE).

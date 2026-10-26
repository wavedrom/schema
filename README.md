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
published at <https://wavedrom.com/schema/wavedrom.json>.

## SchemaStore

The schema is registered in the [SchemaStore](https://www.schemastore.org) catalog as **WaveDrom**.
Editors that consume the SchemaStore catalog (VS Code, JetBrains IDEs, Visual Studio, Neovim with
[SchemaStore.nvim](https://github.com/b0o/SchemaStore.nvim), Helix / Zed / Sublime via `vscode-json-languageserver`, ...)
apply it automatically — validation, completion and hover docs — to files matching:

- `*.wavedrom.json`
- `*.wavedrom.json5`
- `*.wavejson`
- `*.wd.json`

Name your file e.g. `timing.wavedrom.json`.

> **VS Code:** recent versions only download schemas from trusted domains.
> If you see `Location https://wavedrom.com/schema/wavedrom.json is untrusted`,
> trust the domain in `settings.json` (or via the quick fix on the error):
>
> ```json
> "json.schemaDownload.trustedDomains": {
>   "https://wavedrom.com/schema/": true
> }
> ```

For other file names, reference the schema explicitly with `$schema`:

```json
{
  "$schema": "https://wavedrom.com/schema/wavedrom.json",
  "signal": [{"name": "clk", "wave": "p..."}]
}
```

or map it in editor settings, e.g. VS Code `settings.json`:

```json
"json.schemas": [
  {
    "fileMatch": ["**/diagrams/*.json"],
    "url": "https://wavedrom.com/schema/wavedrom.json"
  }
]
```

Neovim (`nvim-lspconfig` + `SchemaStore.nvim`):

```lua
require('lspconfig').jsonls.setup {
  settings = {
    json = {
      schemas = require('schemastore').json.schemas { select = { 'WaveDrom' } },
      validate = { enable = true },
    },
  },
}
```

Command-line validation:

```sh
curl -sO https://wavedrom.com/schema/wavedrom.json
npx ajv-cli validate --strict=false -s wavedrom.json -d timing.wavedrom.json
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

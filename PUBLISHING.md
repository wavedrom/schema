# Publishing

`waveschema.json` (generated from `lib/`) is published in two places:

| Where | URL | How it gets updated |
|---|---|---|
| wavedrom.com (canonical, `$id`) | <https://wavedrom.com/schema/wavedrom.json> | copied into [wavedrom.github.io](https://github.com/wavedrom/wavedrom.github.io) `schema/wavedrom.json` |
| npm | [`wavedrom-schema`](https://www.npmjs.com/package/wavedrom-schema) (also via unpkg / jsDelivr) | `npm publish` |

[SchemaStore](https://www.schemastore.org) holds only a catalog entry that points to the wavedrom.com URL
(PR [#6548](https://github.com/SchemaStore/schemastore/pull/6548)). It has **no copy** of the schema,
so a schema release does **not** need a SchemaStore PR. Editors fetch the schema from wavedrom.com.

## 1. Update schema

Edit modules in `lib/`, then:

```sh
npm run prepare   # regenerates waveschema.json + waveschema.js
npm test          # fails if waveschema.json is stale
```

Rules (from SchemaStore [CONTRIBUTING](https://github.com/SchemaStore/schemastore/blob/master/CONTRIBUTING.md)):

- keep draft-07, `$id: https://wavedrom.com/schema/wavedrom.json` (set in `lib/standalone.js`)
- must compile in Ajv strict mode (covered by `test/test.js`)
- do not add `additionalProperties: false`; avoid closed enums (use `anyOf: [{enum}, {type: 'string'}]`)
- don't rename / remove paths under `definitions` (others may `$ref` into them)
- every change must stay backward compatible: all users get the new schema immediately
- add positive and negative samples for new features to `dat` / `bad` in `test/test.js`

## 2. Publish to npm

```sh
npm version minor     # or patch / major; commits + tags
git push --follow-tags
npm publish
```

## 3. Publish to wavedrom.com

```sh
cd ~/work/github/wavedrom/wavedrom.github.io
git pull
cp ../schema/waveschema.json schema/wavedrom.json
git add schema/wavedrom.json
git commit -m "WaveJSON schema vX.Y.Z"
git push
```

GitHub Pages deploys within a minute or two. Verify:

```sh
curl -s https://wavedrom.com/schema/wavedrom.json | cmp - ../schema/waveschema.json && echo OK
curl -sI https://wavedrom.com/schema/wavedrom.json | grep -iE 'content-type|access-control'
# content-type: application/json; charset=utf-8
# access-control-allow-origin: *
```

The URL must stay valid **forever**: don't move or rename `schema/wavedrom.json`
or the site layout.

## Changing `fileMatch` / catalog entry

File patterns live in SchemaStore `src/api/json/catalog.json` (entry `"name": "WaveDrom"`).
Current patterns: `*.wavedrom.json`, `*.wavedrom.json5`, `*.wavejson`, `*.wd.json`.
Keep README.md in sync. Changing them needs a SchemaStore PR, reviewed by their maintainers:

```sh
cd ~/work/github/SchemaStore/schemastore   # remotes: origin = SchemaStore, fork = drom
git fetch origin
git checkout -B wavedrom-catalog origin/master
npm ci
# edit src/api/json/catalog.json
./node_modules/.bin/prettier --config .prettierrc.cjs --write src/api/json/catalog.json
node cli.js check --schema-name=wavedrom.json    # catalog pre-checks
git commit -am "wavedrom: update fileMatch"
git push -u fork wavedrom-catalog
gh pr create --repo SchemaStore/schemastore --base master --head drom:wavedrom-catalog \
  --title "wavedrom: update fileMatch" --body "..."
```

## Breaking changes

All users always get the current `wavedrom.json`. If an incompatible schema is ever needed:

1. Keep `schema/wavedrom.json` valid for old documents, and publish the new one under
   a new name, e.g. `schema/wavedrom-2.json` (with matching `$id`).
2. In SchemaStore catalog, add `versions` to the WaveDrom entry
   (see their [multiple versions](https://github.com/SchemaStore/schemastore/blob/master/CONTRIBUTING.md#how-to-add-a-json-schema-with-multiple-versions)
   guide) and point `url` to the newest file.

Never delete a published schema file.

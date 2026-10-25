# Publishing

`waveschema.json` (generated from `lib/`) is published in two places:

1. npm: [`wavedrom-schema`](https://www.npmjs.com/package/wavedrom-schema)
2. SchemaStore: <https://www.schemastore.org/wavedrom.json>
   (copy lives in [SchemaStore/schemastore](https://github.com/SchemaStore/schemastore) as `src/schemas/json/wavedrom.json`)

SchemaStore does **not** pull from npm. Every schema change has to be sent there as a PR.

## 1. Update schema

Edit modules in `lib/`, then:

```sh
npm run prepare   # regenerates waveschema.json + waveschema.js
npm test          # fails if waveschema.json is stale
```

Rules (from SchemaStore [CONTRIBUTING](https://github.com/SchemaStore/schemastore/blob/master/CONTRIBUTING.md)):

- keep draft-07, `$id: https://www.schemastore.org/wavedrom.json` (set in `lib/standalone.js`)
- must compile in Ajv strict mode (covered by `test/test.js`)
- do not add `additionalProperties: false`; avoid closed enums (use `anyOf: [{enum}, {type: 'string'}]`)
- don't rename / remove paths under `definitions` (others may `$ref` into them)
- add positive and negative samples for new features to `dat` / `bad` in `test/test.js`

## 2. Publish to npm

```sh
npm version minor     # or patch / major; commits + tags
git push --follow-tags
npm publish
```

## 3. Publish to SchemaStore

One-time setup (fork `drom/schemastore` already exists).
Remotes used below: `upstream` = SchemaStore/schemastore, `origin` = drom/schemastore.

```sh
cd ~/work/github/SchemaStore
git clone git@github.com:drom/schemastore.git
cd schemastore
git remote add upstream https://github.com/SchemaStore/schemastore.git
```

(Checkout used for the first PR has different names: `origin` = upstream, `fork` = drom.
Either rename with `git remote rename`, or substitute names in commands below.)

Each release:

```sh
cd ~/work/github/SchemaStore/schemastore
git fetch upstream
git checkout -B wavedrom-update upstream/master
npm ci

# copy generated schema
cp ../../wavedrom/schema/waveschema.json src/schemas/json/wavedrom.json
```

Regenerate test files from `test/test.js` samples (`dat` → positive, `bad` → negative).
Existing files keep their names; new samples get file name = sample key:

```sh
cd ~/work/github/wavedrom/schema
node -e "
const Module = require('module'), fs = require('fs');
let code = fs.readFileSync('test/test.js', 'utf8').replace(/describe\([\s\S]*$/, 'module.exports = {dat, bad};');
const m = new Module('x'); m.paths = module.paths; m.filename = process.cwd() + '/test/x.js';
m._compile(code, m.filename);
const {dat, bad} = m.exports;
const out = '../../SchemaStore/schemastore/src/';
const pos = {s1:'basic',s2:'clocks',s3:'data',s4:'gaps',s5:'groups',s6:'phase-period',s7a:'config',s7b:'head-foot',s7c:'tspan',s8a:'edge-splines',s8b:'edge-sharp',s9:'gray-code',pw:'piece-wise',ou:'over-under',reg1:'register',assign1:'assign'};
const neg = {empty:'empty',noSignalArray:'signal-not-array',laneName:'lane-name-type',laneWave:'lane-wave-type',period:'period-zero',edge:'edge-not-array',hscale:'hscale-zero',hbounds:'hbounds-length',regBits:'reg-bits-zero',regType:'reg-type-string',assign:'assign-item-type'};
for (const k in dat) fs.writeFileSync(out + 'test/wavedrom/' + (pos[k] || k) + '.json', JSON.stringify(dat[k], null, 2) + '\n');
for (const k in bad) fs.writeFileSync(out + 'negative_test/wavedrom/' + (neg[k] || k) + '.json', JSON.stringify(bad[k], null, 2) + '\n');
"
```

Format, validate, PR:

```sh
cd ~/work/github/SchemaStore/schemastore
./node_modules/.bin/prettier --config .prettierrc.cjs --ignore-path .gitignore --write \
  src/schemas/json/wavedrom.json src/test/wavedrom/ src/negative_test/wavedrom/
node cli.js check --schema-name=wavedrom.json

git add -A
git commit -m "wavedrom: update to wavedrom-schema vX.Y.Z"
git push -u origin wavedrom-update
gh pr create --repo SchemaStore/schemastore --base master --head drom:wavedrom-update \
  --title "wavedrom: update to vX.Y.Z" \
  --body "Sync with https://github.com/wavedrom/schema vX.Y.Z"
gh pr checks --watch
```

Once the initial PR [#6548](https://github.com/SchemaStore/schemastore/pull/6548) is merged, the `CODEOWNERS` entry (`@drom` owns `wavedrom.json` + tests), once checks
are green you can merge the PR yourself by commenting on it:

```
lgtm
```

The `codeowners-merge` bot merges it. Changes are live at
<https://www.schemastore.org/wavedrom.json> after SchemaStore's next site deploy (usually minutes).

## Changing `fileMatch`

File patterns live in SchemaStore `src/api/json/catalog.json` (entry `"name": "WaveDrom"`),
not in this repo. That file is not covered by `CODEOWNERS`, so a PR that touches it
needs maintainer review. Current patterns:
`*.wavedrom.json`, `*.wavedrom.json5`, `*.wavejson`, `*.wd.json`.
Keep README.md in sync.

## Breaking changes

If schema ever needs incompatible versions, follow SchemaStore
[multiple versions](https://github.com/SchemaStore/schemastore/blob/master/CONTRIBUTING.md#how-to-add-a-json-schema-with-multiple-versions)
guide (`wavedrom-1.json`, `wavedrom-2.json` + `versions` in catalog). Never delete `wavedrom.json`.

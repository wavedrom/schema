# WaveJSON

WaveJSON is the input format of the [WaveDrom](https://wavedrom.com) rendering engine.
It is [JSON](https://json.org) (WaveDrom itself also accepts JSON5 / JavaScript object literals)
with reserved keywords and structural rules described below.
The rules are derived from the WaveDrom 3.7 source code
(`wavedrom`, `bit-field` 1.9, `logidrom` 1.0, `tspan` 0.4) and enforced by [`waveschema.json`](waveschema.json).

The root is an object. The diagram kind is chosen by the first present key, in this order:

| key      | diagram                         |
|----------|---------------------------------|
| `signal` | digital timing diagram          |
| `assign` | logic circuit (schematic)       |
| `reg`    | bit-field (register) diagram    |

Other root keys are ignored, so `"$schema"` can be added for editor support.

See [WaveDrom Tutorial](https://wavedrom.com/tutorial.html) for examples.

## Text

Most labels (`name`, `data`, `head.text`, `foot.text`, group labels, register fields) accept:

* plain string, with inline markup: `<b>` `<i>` `<o>` (overline) `<ins>` (underline) `<s>` (strike) `<sub>` `<sup>` `<tt>` (monospace),
  e.g. `"CS<sub>n</sub>"`, `"<o>RST</o>"`
* number
* [JsonML](http://www.jsonml.org) SVG markup: `["tspan", {attributes}, ...children]`,
  e.g. `["tspan", {"class": "h3"}, "Title"]`.
  Theme classes: `h1`..`h6`, `muted`, `info`, `success`, `warning`, `error`.

## Timing diagram

```js
{
  signal: [ lane | group, ... ],
  edge:   [ "a->b label", ... ],
  gaps:   ". . 2 . .",
  head:   {text, tick, tock, every},
  foot:   {text, tick, tock, every},
  config: {hscale, skin, hbounds, marks, arcFontSize}
}
```

### `signal`

Array of wave lanes (objects) and groups (arrays).

* empty object `{}` - blank row (gap) between lanes
* lane without `name` - invisible row, still usable to hold `node` anchors
* group `["label", lane, lane, ["sub group", lane], ...]` - drawn with a bracket on the left;
  the first element (string or number) is the label, other non-object elements are ignored. Groups nest.

### lane `name`

Label text left of the wave.

### lane `wave`

String, one character per period:

| char | meaning |
|------|---------|
| `p` `n` | clock, positive / negative edge first |
| `P` `N` | same with arrow on the edge |
| `h` `l` | high / low with sharp edge |
| `H` `L` | same with arrow |
| `0` `1` | low / high level (soft edges) |
| `x` | undefined |
| `z` | high impedance |
| `u` `d` | pull-up (weak 1) / pull-down (weak 0) |
| `=` `2`..`9` | data value; `=` is color 2. Labels from `data` |
| `.` | extend previous state |
| `\|` | extend previous state, draw gap (break) mark |
| `<` `>` | start / end of sub-cycle group: characters inside take one brick (half a cycle) each |

Any other character is rendered as `x` - the schema rejects it.

Alternative: piece-wise analog wave `["pw", {"d": path}]` where `path` is an SVG path
(string `"m0,0 l1,1"` or array `["m", 0, 0, "l", 1, 1]`) with relative commands `m l h v q t a`;
x unit = 1 cycle, y unit = lane height, y grows up.

### lane `data`

Labels for the data cycles (`=`, `2`..`9`) in order: array of text items, or a space-separated string `"A B C"`.
Labels of cycles hidden by `phase` / `hbounds` are skipped.

### lane `period`, `phase`

* `period` - positive number (default 1): width of one wave character in cycles, e.g. `2` for half-rate, `0.5` for double-rate.
* `phase` - number of cycles (default 0); positive shifts the wave left (earlier), negative right (delay).
  Wave is shifted in half-cycle steps; nodes and over / under lines use the exact value.

### lane `node`

One character per period, anchors for `edge` arrows:

* `.` - no node
* uppercase letter - invisible node
* any other character - node with a visible label

### lane `over`, `under`

Colored line above (with serif marks) / below the lane, one character per period:
`1`..`8` start a line of that color (black, red, green, blue, magenta, olive, teal, violet),
`0` ends it, `.` extends previous state.

### `edge`

Array of arrow strings `"<from><shape><to> label"`. `from` / `to` are node characters,
`label` is everything after the first space. Edges referring to undefined nodes are ignored.

| shape | line | with arrowhead | double-headed |
|-------|------|----------------|---------------|
| straight | `-` | `->` | `<->` |
| curve | `~` | `~>` | `<~>` |
| curve, horizontal start | `-~` | `-~>` | `<-~>` |
| curve, horizontal end | `~-` | `~->` | |
| corner, horizontal first | `-\|` | `-\|>` | `<-\|>` |
| corner, vertical first | `\|-` | `\|->` | |
| step | `-\|-` | `-\|->` | `<-\|->` |
| tee ends (time span) | `+` | | |

Any other shape is drawn as a red straight line - the schema rejects it.

### `gaps`

Space-separated tokens, one per cycle, drawn across all lanes at mid-cycle:
`.` none, `0` blank, `1` / `|` single line, `2` double, `3` triple,
`[` `]` square bracket, `(` `)` round bracket, `)(` `((` `))` double round brackets,
`s` wave gap symbol on every lane.

### `head`, `foot`

* `text` - title / caption
* `tick` - labels at cycle boundaries; `tock` - labels at mid-cycle.
  Number `N` produces `N, N+1, ...`.
  A string of space-separated labels is also accepted, but WaveDrom 3.x appends the
  `hbounds` offset to it (`"A B C"` renders as `A B C0`); prefer numbers.
  Arrays are not supported.
* `every` - show only labels whose value is divisible by N (numeric `tick` / `tock` only)

### `config`

| key | type | default | |
|-----|------|---------|-|
| `hscale` | number 1..100 | 1 | cycle width multiplier, rounded |
| `skin` | string | `default` | `default` `narrow` `narrower` `narrowerer` `lowkey` `dark`; must be loaded, unknown falls back to `default` |
| `hbounds` | [start, end] | | visible cycle window, ignored unless start < end |
| `marks` | boolean | true | vertical dotted cycle marks |
| `arcFontSize` | number | 11 | font size of edge and node labels |

## Bit-field (register)

```js
{
  reg: [ {bits, name, attr, type, rotate, rect}, ... ],   // from LSB
  config: {...}
}
```

Field:

* `bits` - **required**, integer >= 1
* `name` - text; a number is drawn as binary value across the field bits
* `attr` - text, number (binary), or array of rows (`null` rows skipped)
* `type` - color: 2 red, 3 lime, 4 cyan, 5 amber, 6 green, 7 blue, other - gray. A field with neither `name` nor `type` is drawn as reserved
* `rotate` - name rotation in degrees
* `rect` - extra SVG attributes of the field background

`config`:

| key | default | |
|-----|---------|-|
| `hspace` | 800 | width px, integer >= 40 |
| `vspace` | (attr rows + 4) * fontsize | lane height px |
| `lanes` | 1 | number of rows |
| `bits` | sum of field bits | |
| `fontsize` | 14 | integer >= 6 |
| `fontfamily` / `fontweight` | `sans-serif` / `normal` | |
| `compact` | false | lanes without gaps, bit numbers on top |
| `hflip` / `vflip` | false | LSB lane on top / bit 0 on the left |
| `sparse` / `uneven` | false | ticks only at field boundaries / shorter last lane for odd widths |
| `trim` | | trim long names, value = estimated char width px |
| `offset` | 0 | added to bit index labels |
| `legend` | | `{"label": type, ...}` color legend |
| `margin` | | `{top, right, bottom, left}` |
| `label` | | `{left, right}`: string (all lanes), number (lane index + N), or array per lane |

## Logic circuit

```js
{
  assign: [ ["out", expression], ... ],
  config: {fontWidth: 7.23, treeSpacing: 16}
}
```

Expression is a wire name (string) or `["op", {attributes}?, ...operands]`:

* shape gates: `&` `|` `^` `~&` `~|` `~^` `~` `buf1` `+` `-` `*` `/` `%`;
  aliases `and` `or` `xor` `andr` `orr` `xorr` `add` `sub` `mul` `input`
* IEC boxes: `BUF` `INV` `AND` `NAND` `OR` `NOR` `XOR` `XNOR` `eq` `ne` `slt` `sle` `sgt` `sge` `ult` `ule` `ugt` `uge` `box` `CONCAT` `case` `casez` `casex`
* `MUX`; flip-flops `ff[n][e][c|p[n]][r|s[n]]` (`ff`, `ffe`, `ffr`, `ffnecrn`, ...); bit slice `"[7:0]"`
* `["=", "net", expr]` - labeled intermediate net
* `pin` / `pout` / `pinout` with `{"instance", "pin"}` - module ports
* any other string - labeled box

Attributes: `width` (bus width), `label`, `dir` (`in` / `out`), `instance`, `pin`, `imm`, `module`, `name`, `loc`, `nodeId`, `siteKey`.

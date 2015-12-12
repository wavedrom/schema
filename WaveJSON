The following set of structures used by WaveDrom rendering engine to describe timing diagrams.
The format based on [JSON](http://json.org) syntax with some reserved keywords and structural limitations.

See [WaveDrom Tutorial](http://wavedrom.googlecode.com/svn/trunk/tutorial.html) for examples.

### ``signal``

The the main root ``object``. The ``value`` is the ``array`` of signal ``values``.

```js
{ "signal" : [
    value1,
    value2,
    ...
]}
```

signal value of ``array`` type represent a signal group. Where the first ``value`` in array is the group label of type ``string``. Signal groups can be recursive.  

```js
{ "signal" : [
    [ "Group 1", value1 ],
    value2,
    ...
]}
```

signal object of ``object`` type represent the signal descriptor.

The empty signal object will causes empty gap between signals.

```js
{ "signal" : [
    [ "Group 1", { signal object 1 }, { signal object 2 } ],
    ...
    {}, <-- gap between signal lanes
    ...
    { signal object 3 },
    ...
]}
```

### ``signal...name``

The ``string`` type. This ``value`` will be visible as signal label.

Example:
```js
{ "signal" : [
    { "name" : "My Signal" }
]}
```

### ``signal...wave``

The ``string`` type. The signal lane activity. Each ``character`` represent single cycle.

```js
{ "signal" : [
    { "wave" : "x.01.=.." }
]}
```

 * `p` - when first in string creates positive edged clock wave
 * `n` - when first in string creates negative edged clock wave
 * `P` - same as `p` but with arrow
 * `N` - same as `n` but with arrow
 * `0` - low level
 * `1` - high level
 * `=` - value (default color 2)
 * `2` - value with color 2
 * `3` - value with color 3
 * `4` - value with color 4
 * `5` - value with color 5
 * `x` - undefined value
 * `.` - extends previous cycle
 * `z` - high-impedance state
 * `u` - pull-up (weak 1)
 * `d` - pull-down (weak 0)
 * `|` - extends previous cycle and draw gap on top of it

### ``signal...data``

Is an ``array`` of signal labels. Each ``value`` slot of signal lane can be labeled using this field.

```js
{ "signal" : [
    { "data" : ["A", "B", "C"] }
]}
```

### ``signal...period``

signal period of ``number`` type. Expected natural number (1, 2, 3, 4 ...)

### ``signal...phase``

signal phase of ``number`` type. Positive number represent shift into the future. Negative number represents shift into past (delay).

### ``signal...node``

is the ``string``. Each ``character`` represent a single cycle.

```js
{ "signal" : [
    { "name" : "My Signal", "node" : "...a...b..C..." }
]}
```

 * `.    ` - no marker
 * `[A-Z]` - invisible marker
 * `other` - visible marker

Other signal ``object`` strings will be ignored by WaveDrom rendering engine.

### `edge`

The ``pair`` inside the root object. The ``edge``'s ``value`` holds the description of dependency arrows in form of ``array`` of ``strings``

```js
{ "signal" : [ v1, v2, ... ],
  "edge"   : array
}
```

Each element of edge ``array`` is a single ``string`` that describes an arrow or line (arrow string).

```js
{ ...
  "edge"   : ["a->b edge 1", "b-~>c My Second Edge"]
}
```

Arrow ``string`` may contain multiple words separated by spaces. The ``first word`` defines the ``from`` and ``to`` points, the arrow shape and arrow label position. The rest of the text (after first space gap) will be placed as the label on top of arrow.

Special syntax can be used in the ``first word``. First ``character`` is the ``from`` label. The last ``character`` is the ``to`` identifier. The ``character`` `>` in second from the end position will produce the arrow header. The rest of the symbols will affect the *arrow shape*.

 * `-` - move arrow horizontally (x+)
 * `|` - move arrow vertically (y+)
 * `~` - makes the curvy shape (x+, y+)
 * `/` - adds diagonal line (x+, y+)
 * `#` - indicates the arrow label position

### ``config``

### ``config.hscale``
number >= 1 defines horizontal scale of timing diagram.


See [WaveDrom Tutorial](http://wavedrom.googlecode.com/svn/trunk/tutorial.html) for more information.

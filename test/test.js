'use strict';

const lib = require('../lib/');
const Ajv = require('ajv');
const {expect} = require('chai');
const standalone = require('../lib/standalone.js');

const dat = {
  s1: {
    signal: [{
      name: 'Alfa',
      wave: '01.zx=ud.23.45'
    }]
  },
  s2: {
    signal: [
      {
        name: 'pclk',
        wave: 'p.......'
      },
      {
        name: 'Pclk',
        wave: 'P.......'
      },
      {
        name: 'nclk',
        wave: 'n.......'
      },
      {
        name: 'Nclk',
        wave: 'N.......'
      },
      {},
      {
        name: 'clk0',
        wave: 'phnlPHNL'
      },
      {
        name: 'clk1',
        wave: 'xhlhLHl.'
      },
      {
        name: 'clk2',
        wave: 'hpHplnLn'
      },
      {
        name: 'clk3',
        wave: 'nhNhplPl'
      },
      {
        name: 'clk4',
        wave: 'xlh.L.Hx'
      }
    ]
  },
  s3: {
    signal: [
      {
        name: 'clk',
        wave: 'P......'
      },
      {
        name: 'bus',
        wave: 'x.==.=x',
        data: ['head', 'body', 'tail', 'data']
      },
      {
        name: 'wire',
        wave: '0.1..0.'
      }
    ]
  },
  s4: {
    signal: [
      {
        name: 'clk',
        wave: 'p.....|...'
      },
      {
        name: 'Data',
        wave: 'x.345x|=.x',
        data: ['head', 'body', 'tail', 'data']
      },
      {
        name: 'Request',
        wave: '0.1..0|1.0'
      },
      {},
      {
        name: 'Acknowledge',
        wave: '1.....|01.'
      }
    ]
  },
  s5: {
    signal: [
      {
        name: 'clk',
        wave: 'p..Pp..P'
      },
      ['Master',
        ['ctrl',
          {
            name: 'write',
            wave: '01.0....'
          },
          {
            name: 'read',
            wave: '0...1..0'
          }
        ],
        {
          name: 'addr',
          wave: 'x3.x4..x',
          data: 'A1 A2'
        },
        {
          name: 'wdata',
          wave: 'x3.x....',
          data: 'D1'
        }
      ],
      {},
      ['Slave',
        ['ctrl',
          {
            name: 'ack',
            wave: 'x01x0.1x'
          }
        ],
        {
          name: 'rdata',
          wave: 'x.....4x',
          data: 'Q2'
        }
      ]
    ]
  },
  s6: {
    signal: [
      {
        name: 'CK',
        wave: 'P.......',
        period: 2
      },
      {
        name: 'CMD',
        wave: 'x.3x=x4x=x=x=x=x',
        data: 'RAS NOP CAS NOP NOP NOP NOP',
        phase: 0.5
      },
      {
        name: 'ADDR',
        wave: 'x.=x..=x........',
        data: 'ROW COL',
        phase: 0.5
      },
      {
        name: 'DQS',
        wave: 'z.......0.1010z.'
      },
      {
        name: 'DQ',
        wave: 'z.........5555z.',
        data: 'D0 D1 D2 D3'
      }
    ]
  },
  s7a: {
    signal: [
      {
        name: 'clk',
        wave: 'p....'
      },
      {
        name: 'Data',
        wave: 'x345x',
        data: ['head', 'body', 'tail']
      },
      {
        name: 'Request',
        wave: '01..0'
      }
    ],
    config: {
      hscale: 1
    }
  },
  s7b: {
    signal: [
      {
        name: 'clk',
        wave: 'p....'
      },
      {
        name: 'Data',
        wave: 'x345x',
        data: 'a b c'
      },
      {
        name: 'Request',
        wave: '01..0'
      }
    ],
    head: {
      text: 'WaveDrom example',
      tick: 0
    },
    foot: {
      text: 'Figure 100',
      tock: 9
    }
  },
  s7c: {
    signal: [
      {
        name: 'clk',
        wave: 'p.....PPPPp....'
      },
      {
        name: 'dat',
        wave: 'x....2345x.....',
        data: 'a b c d'
      },
      {
        name: 'req',
        wave: '0....1...0.....'
      }
    ],
    head: {
      text: ['tspan',
        ['tspan', {
          class: 'error h1'
        }, 'error '],
        ['tspan', {
          class: 'warning h2'
        }, 'warning '],
        ['tspan', {
          class: 'info h3'
        }, 'info '],
        ['tspan', {
          class: 'success h4'
        }, 'success '],
        ['tspan', {
          class: 'muted h5'
        }, 'muted '],
        ['tspan', {
          class: 'h6'
        }, 'h6 '],
        'default ',
        ['tspan', {
          fill: 'pink',
          'font-weight': 'bold',
          'font-style': 'italic'
        }, 'pink-bold-italic']
      ]
    },
    foot: {
      text: ['tspan', 'E=mc',
        ['tspan', {
          dy: '-5'
        }, '2'],
        ['tspan', {
          dy: '5'
        }, '. '],
        ['tspan', {
          'font-size': '25'
        }, 'B '],
        ['tspan', {
          'text-decoration': 'overline'
        }, 'over '],
        ['tspan', {
          'text-decoration': 'underline'
        }, 'under '],
        ['tspan', {
          'baseline-shift': 'sub'
        }, 'sub '],
        ['tspan', {
          'baseline-shift': 'super'
        }, 'super ']
      ],
      tock: -5
    }
  },
  s8a: {
    signal: [
      {
        name: 'A',
        wave: '01........0....',
        node: '.a........j'
      },
      {
        name: 'B',
        wave: '0.1.......0.1..',
        node: '..b.......i'
      },
      {
        name: 'C',
        wave: '0..1....0...1..',
        node: '...c....h..'
      },
      {
        name: 'D',
        wave: '0...1..0.....1.',
        node: '....d..g...'
      },
      {
        name: 'E',
        wave: '0....10.......1',
        node: '.....ef....'
      }
    ],
    edge: [
      'a~b t1', 'c-~a t2', 'c-~>d time 3', 'd~-e',
      'e~>f', 'f->g', 'g-~>h', 'h~>i some text', 'h~->j'
    ]
  },
  s8b: {
    signal: [
      {
        name: 'A',
        wave: '01..0..',
        node: '.a..e..'
      },
      {
        name: 'B',
        wave: '0.1..0.',
        node: '..b..d.',
        phase: 0.5
      },
      {
        name: 'C',
        wave: '0..1..0',
        node: '...c..f'
      },
      {
        node: '...g..h'
      }
    ],
    edge: [
      'b-|a t1', 'a-|c t2', 'b-|-c t3', 'c-|->e t4', 'e-|>f more text',
      'e|->d t6', 'c-g', 'f-h', 'g<->h 3 ms'
    ]
  },
  s9: (function(bits, ticks) {
    var i, t, gray, state, data = [],
      arr = [];
    for (i = 0; i < bits; i++) {
      arr.push({
        name: i + '',
        wave: ''
      });
      state = 1;
      for (t = 0; t < ticks; t++) {
        data.push(t + '');
        gray = (((t >> 1) ^ t) >> i) & 1;
        arr[i].wave += (gray === state) ? '.' : gray + '';
        state = gray;
      }
    }
    arr.unshift('gray');
    return {
      signal: [{
        name: 'bin',
        wave: '='.repeat(ticks),
        data: data
      }, arr]
    };
  })(5, 16),
  pw: {
    signal: [{name: 'analog', wave: ['pw', {d: 'm0,0 l1,1'}]}]
  },
  ou: {
    signal: [{name: 'a', wave: '01010', over: '.2.3.', under: '..4..'}],
    config: {hscale: 2, skin: 'narrow', hbounds: [0, 4], marks: false},
    head: {text: 'title', tick: 0, every: 2}
  },
  reg1: {
    reg: [
      {name: 'IPO', bits: 8, attr: 'RO'},
      {bits: 7},
      {name: 'BRK', bits: 5, attr: ['RW', 3], type: 4, rotate: -90},
      {name: 1, bits: 1}
    ],
    config: {hspace: 888, lanes: 2, bits: 21, compact: true, fontfamily: 'monospace'}
  },
  assign1: {
    assign: [['out', ['|', ['&', 'a', 'b'], ['~', 'c']]]]
  },
  // wavedrom/test/test.html Test 13
  edges2: {
    signal: [
      {name: 'A', wave: '01..0..', node: '.a..e..'},
      {name: 'B', wave: '0.1..0.', node: '..b..d.', phase: 0.5},
      {name: 'C', wave: '0..1..0', node: '...c..f'},
      {node: '...g..h'},
      {node: '...I..J', phase: 0.5},
      {name: 'D', wave: '0..1..0', phase: 0.5}
    ],
    edge: [
      'b-|a t1', 'a-|c t2', 'b-|-c t3', 'c-|->e t4', 'e-|>f more text',
      'e|->d t6', 'c-g', 'f-h', 'g<->h 3 ms', 'I+J 5 ms', 'a<-|->b', 'a<-~>b', 'a<~>b', 'a<-|>b', 'a-|-b', 'a|-b', 'a-b', 'a~-b'
    ]
  },
  // wavedrom/test/test-sub-cycle.html
  subCycle: {
    signal: [
      {name: 'P1', wave: '==2<30>2<0xx1>2333444555', data: '0 1 2 a b c 3 4 5 d e f 6 7 8'},
      {name: 'P2', wave: '=2<15.1>2<01>2355', data: '0 1 2', period: 2},
      {name: 'B2', wave: 'x=<x|..>=<x|..>=.', data: 'a2 b2', period: 2},
      {name: 'colors', wave: '=23456789'}
    ]
  },
  // wavedrom/test/test.html Test 18
  overUnder: {
    signal: [
      {name: 'dat →', wave: 'x.3..4.5...6', data: 'D1 D2 D3', over: '0.1..2.3...4', under: '0...1010..10', period: 0.5, phase: 1.7}
    ],
    head: {tick: -1, every: 5}
  },
  // wavedrom/test/test.html Test A.0
  pieceWise: {
    signal: [
      {name: 'clock', wave: 'p.......'},
      {name: 'sawtooth', wave: ['pw', {d: ['m', 1, 0, 'l', 2, 1, 'v', -1, 'l', 2, 1, 'v', -1]}]},
      {name: 'triangle', wave: ['pw', {d: 'm,0,0  l,2,1  l,2,-1  l,2,1  l,2,-1'}]}
    ]
  },
  gaps: {
    signal: [{name: 'a', wave: '0101'}, {name: 'b', wave: '1010'}],
    gaps: '. 2 ( ) )( (( )) [ ] 0 1 | 3 s'
  },
  markup: {
    signal: [
      {name: '<o>RST</o>', wave: '10.'},
      {name: ['tspan', {class: 'h3'}, 'clk'], wave: 'p..', data: [['tspan', {fill: 'red'}, 'D']]},
      [1, {name: 'CS<sub>n</sub>', wave: '0.1'}]
    ],
    head: {text: 'a <b>b</b> <i>c</i>', tock: 1},
    foot: {tick: 'a b c d'},
    config: {arcFontSize: 9, hscale: 100}
  },
  // wavedrom/test/reg-opivi.json5
  regOpivi: {
    reg: [
      {bits: 7, name: 0x37, attr: ['OPIVI']},
      {bits: 5, name: 'vd', type: 2},
      {bits: 3, name: 3},
      {bits: 5, name: 'simm5', type: 5},
      {bits: 5, name: 'vs2', type: 2},
      {bits: 1, name: 'vm'},
      {bits: 6, name: 'funct6'}
    ]
  },
  // wavedrom/test/reg-vl.json5
  regVl: {
    reg: [
      {bits: 7, name: 0x07, attr: ['VLxU,VLE zero-extended', 'VLxU sign-extended']},
      {bits: 5, name: 'lumop', attr: [0, 16, null, 16]},
      {bits: 3, name: 'nf'}
    ]
  },
  regConfig: {
    reg: [
      {bits: 8, name: 'ctrl', type: 2, rect: {style: 'fill:#ff0'}},
      {bits: 8, name: 'stat', type: 4}
    ],
    config: {
      hspace: 800, vspace: 60, lanes: 2, fontsize: 12, sparse: true, uneven: true, vflip: true,
      offset: 16, trim: 8, legend: {Control: 2, Status: 4},
      label: {left: 'R', right: ['lo', 'hi']},
      margin: {top: 10, bottom: 10}
    }
  },
  // wavedrom/test/assign.json5
  assign2: {
    assign: [
      ['z', ['~&',
        ['~^', ['~', 'p0'], ['~', 'q0']],
        '...',
        ['~', '~en']
      ]]
    ]
  },
  assign3: {
    assign: [
      ['q', ['ffer', ['MUX', 's', 'a', 'b'], 'en', 'rst']],
      ['y', {width: 8}, ['=', 'n1', ['+', ['[7:0]', 'a'], 'b']]],
      ['pout', {instance: 'u0', pin: 'o'}, ['eq', {imm: '8\'h55'}, 'x']],
      ['w', ['pin', {instance: 'u1', pin: 'i', dir: 'in'}]]
    ],
    config: {fontWidth: 7, treeSpacing: 24}
  },
  // WaveDrom picks "signal" when several kinds are present
  priority: {
    signal: [{name: 'a', wave: '01'}],
    reg: 'ignored'
  },
  withSchema: {
    $schema: 'https://wavedrom.com/schema/wavedrom.json',
    signal: []
  }
};

const bad = {
  empty: {},
  noSignalArray: {signal: {name: 'a'}},
  laneName: {signal: [{name: 5, wave: '01'}]},
  laneWave: {signal: [{wave: 10}]},
  period: {signal: [{wave: '01', period: 0}]},
  edge: {signal: [], edge: 'a->b'},
  hscale: {signal: [], config: {hscale: 0}},
  hbounds: {signal: [], config: {hbounds: [1]}},
  regBits: {reg: [{bits: 0}]},
  regType: {reg: [{bits: 1, type: 'x'}]},
  assign: {assign: ['out']},
  notObject: [],
  waveChar: {signal: [{wave: '01-0'}]},
  waveCase: {signal: [{wave: 'X.Z'}]},
  edgeShape: {signal: [], edge: ['a-#>b']},
  edgeShort: {signal: [], edge: ['ab']},
  edgeNoNode: {signal: [], edge: ['->b']},
  gapsToken: {signal: [], gaps: '. x .'},
  gapsType: {signal: [], gaps: ['.']},
  over: {signal: [{wave: '01', over: '0a'}]},
  pwTag: {signal: [{wave: ['pl', {d: 'm0,0'}]}]},
  pwNoD: {signal: [{wave: ['pw', {}]}]},
  groupLabelBool: {signal: [[true, {wave: '01'}]]},
  tickArray: {signal: [], head: {tick: [0, 2]}},
  every: {signal: [], head: {tick: 0, every: 0}},
  hscaleMax: {signal: [], config: {hscale: 101}},
  arcFontSize: {signal: [], config: {arcFontSize: 0}},
  regNoBits: {reg: [{name: 'x'}]},
  regHspace: {reg: [{bits: 1}], config: {hspace: 10}},
  regLegend: {reg: [{bits: 1}], config: {legend: {a: 'red'}}},
  regLabel: {reg: [{bits: 1}], config: {label: {left: true}}},
  assignOp: {assign: [[true, 'a']]},
  assignDir: {assign: [['y', {dir: 'up'}, 'a']]},
  assignNotArray: {assign: 'y = a'}
};

const check = (validate, data, expected) => {
  const res = validate(data);
  expect(res, JSON.stringify(validate.errors)).to.equal(expected);
};

describe('defs + any', () => {
  const ajv = new Ajv({strict: false});
  const validate = ajv
    .addSchema(lib.defs)
    .compile(lib.any);

  Object.keys(dat).forEach(name => it(name, () => check(validate, dat[name], true)));
  Object.keys(bad).forEach(name => it('negative ' + name, () => check(validate, bad[name], false)));
});

describe('fragments', () => {
  Object.keys(lib.fragments).forEach(kind => {
    const defs = lib.fragments[kind];
    Object.keys(defs).forEach(name => it(kind + ': ' + name + ' consistent with defs', () => {
      expect(lib.defs[name]).to.deep.equal(defs[name]);
    }));
  });
});

describe('standalone (strict)', () => {
  const ajv = new Ajv({strict: true, allowUnionTypes: true});
  const validate = ajv.compile(standalone);

  it('draft-07 + $id', () => {
    expect(standalone.$schema).to.equal('http://json-schema.org/draft-07/schema#');
    expect(standalone.$id).to.equal('https://wavedrom.com/schema/wavedrom.json');
  });
  it('waveschema.json up to date', () => {
    expect(require('../waveschema.json')).to.deep.equal(standalone);
  });
  Object.keys(dat).forEach(name => it(name, () => check(validate, dat[name], true)));
  Object.keys(bad).forEach(name => it('negative ' + name, () => check(validate, bad[name], false)));
});



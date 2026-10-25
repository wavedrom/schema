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
  assign: {assign: ['out']}
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

describe('standalone (strict)', () => {
  const ajv = new Ajv({strict: true, allowUnionTypes: true});
  const validate = ajv.compile(standalone);

  it('draft-07 + $id', () => {
    expect(standalone.$schema).to.equal('http://json-schema.org/draft-07/schema#');
    expect(standalone.$id).to.equal('https://www.schemastore.org/wavedrom.json');
  });
  it('waveschema.json up to date', () => {
    expect(require('../waveschema.json')).to.deep.equal(standalone);
  });
  Object.keys(dat).forEach(name => it(name, () => check(validate, dat[name], true)));
  Object.keys(bad).forEach(name => it('negative ' + name, () => check(validate, bad[name], false)));
});



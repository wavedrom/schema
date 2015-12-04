'use strict';

var waveDromSchema = require('../wavedrom.json'),
    ZSchema = require('z-schema');

var dat = {
    s1: { signal: [{ name: "Alfa", wave: "01.zx=ud.23.45" }] },
    s2: { signal: [
        { name: "pclk", wave: 'p.......' },
        { name: "Pclk", wave: 'P.......' },
        { name: "nclk", wave: 'n.......' },
        { name: "Nclk", wave: 'N.......' },
        {},
        { name: 'clk0', wave: 'phnlPHNL' },
        { name: 'clk1', wave: 'xhlhLHl.' },
        { name: 'clk2', wave: 'hpHplnLn' },
        { name: 'clk3', wave: 'nhNhplPl' },
        { name: 'clk4', wave: 'xlh.L.Hx' },
    ]},
    s3: { signal: [
        { name: "clk",  wave: "P......" },
        { name: "bus",  wave: "x.==.=x", data: ["head", "body", "tail", "data"] },
        { name: "wire", wave: "0.1..0." }
    ]},
    s4: { signal: [
        { name: "clk",         wave: "p.....|..." },
        { name: "Data",        wave: "x.345x|=.x", data: ["head", "body", "tail", "data"] },
        { name: "Request",     wave: "0.1..0|1.0" },
        {},
        { name: "Acknowledge", wave: "1.....|01." }
    ]},
    s5: { signal: [
        {    name: 'clk',   wave: 'p..Pp..P'},
        ['Master',
            ['ctrl',
                {name: 'write', wave: '01.0....'},
                {name: 'read',  wave: '0...1..0'}
            ],
            {  name: 'addr',  wave: 'x3.x4..x', data: 'A1 A2'},
            {  name: 'wdata', wave: 'x3.x....', data: 'D1'   },
        ],
        {},
        ['Slave',
            ['ctrl',
                {name: 'ack',   wave: 'x01x0.1x'},
            ],
            {  name: 'rdata', wave: 'x.....4x', data: 'Q2'},
        ]
    ]},
    s6: { signal: [
        { name: "CK",   wave: "P.......",                                              period: 2  },
        { name: "CMD",  wave: "x.3x=x4x=x=x=x=x", data: "RAS NOP CAS NOP NOP NOP NOP", phase: 0.5 },
        { name: "ADDR", wave: "x.=x..=x........", data: "ROW COL",                     phase: 0.5 },
        { name: "DQS",  wave: "z.......0.1010z." },
        { name: "DQ",   wave: "z.........5555z.", data: "D0 D1 D2 D3" }
    ]},
    s7a: { signal: [
        { name: "clk",     wave: "p...." },
        { name: "Data",    wave: "x345x",  data: ["head", "body", "tail"] },
        { name: "Request", wave: "01..0" }
        ],
        config: { hscale: 1 }
    },
    s7b: {signal: [
        {name:'clk',         wave: 'p....' },
        {name:'Data',        wave: 'x345x', data: 'a b c' },
        {name:'Request',     wave: '01..0' }
        ],
        head:{
            text:'WaveDrom example',
            tick:0,
        },
        foot:{
            text:'Figure 100',
            tock:9
        }
    },
    s7c: {signal: [
      {name:'clk', wave: 'p.....PPPPp....' },
      {name:'dat', wave: 'x....2345x.....', data: 'a b c d' },
      {name:'req', wave: '0....1...0.....' }
    ],
    head: {text:
      ['tspan',
        ['tspan', {class:'error h1'}, 'error '],
        ['tspan', {class:'warning h2'}, 'warning '],
        ['tspan', {class:'info h3'}, 'info '],
        ['tspan', {class:'success h4'}, 'success '],
        ['tspan', {class:'muted h5'}, 'muted '],
        ['tspan', {class:'h6'}, 'h6 '],
        'default ',
        ['tspan', {fill:'pink', 'font-weight':'bold', 'font-style':'italic'}, 'pink-bold-italic']
      ]
    },
    foot: {text:
      ['tspan', 'E=mc',
        ['tspan', {dy:'-5'}, '2'],
        ['tspan', {dy: '5'}, '. '],
        ['tspan', {'font-size':'25'}, 'B '],
        ['tspan', {'text-decoration':'overline'},'over '],
        ['tspan', {'text-decoration':'underline'},'under '],
        ['tspan', {'baseline-shift':'sub'}, 'sub '],
        ['tspan', {'baseline-shift':'super'}, 'super ']
      ],tock:-5
    }
    },
    s8a: { signal: [
      { name: 'A', wave: '01........0....',  node: '.a........j' },
      { name: 'B', wave: '0.1.......0.1..',  node: '..b.......i' },
      { name: 'C', wave: '0..1....0...1..',  node: '...c....h..' },
      { name: 'D', wave: '0...1..0.....1.',  node: '....d..g...' },
      { name: 'E', wave: '0....10.......1',  node: '.....ef....' }
      ],
      edge: [
        'a~b t1', 'c-~a t2', 'c-~>d time 3', 'd~-e',
        'e~>f', 'f->g', 'g-~>h', 'h~>i some text', 'h~->j'
      ]
  },
  s8b: { signal: [
      { name: 'A', wave: '01..0..',  node: '.a..e..' },
      { name: 'B', wave: '0.1..0.',  node: '..b..d.', phase:0.5 },
      { name: 'C', wave: '0..1..0',  node: '...c..f' },
      {                              node: '...g..h' }
      ],
      edge: [
        'b-|a t1', 'a-|c t2', 'b-|-c t3', 'c-|->e t4', 'e-|>f more text',
        'e|->d t6', 'c-g', 'f-h', 'g<->h 3 ms'
      ]
  },
  s9: (function (bits, ticks) {
      var i, t, gray, state, data = [], arr = [];
      for (i = 0; i < bits; i++) {
        arr.push({name: i + '', wave: ''});
        state = 1;
        for (t = 0; t < ticks; t++) {
          data.push(t + '');
          gray = (((t >> 1) ^ t) >> i) & 1;
          arr[i].wave += (gray === state) ? '.' : gray + '';
          state = gray;
        }
      }
      arr.unshift('gray');
      return {signal: [
        {name: 'bin', wave: '='.repeat(ticks), data: data}, arr
      ]};
    })(5, 16)
}

var validator = new ZSchema();

describe('basic', function () {
    Object.keys(dat).forEach(function (name) {
        it(name, function (done) {
            validator.validate(dat[name], waveDromSchema, function (err, valid) {
                if (err) {
                    throw err;
                }
                done();
            });
        });
    });
});

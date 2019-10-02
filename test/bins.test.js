const test = require('tape')
const bins = require('../src/lib/bins')

test('searchBin', t => {
  const d1 = bins.create({
    'a': 1
  })
  t.equal(d1.keys[bins.searchBin(d1.cumulative, -1)], 'a')
  t.equal(d1.keys[bins.searchBin(d1.cumulative, 0)], 'a')
  t.equal(d1.keys[bins.searchBin(d1.cumulative, 3)], 'a')


  const d2 = bins.create({
    'a': 1,
    'b': 2
  })
  t.equal(d2.keys[bins.searchBin(d2.cumulative, -1)], 'a')
  t.equal(d2.keys[bins.searchBin(d2.cumulative, 0)], 'a')
  t.equal(d2.keys[bins.searchBin(d2.cumulative, 0.8)], 'a')
  t.equal(d2.keys[bins.searchBin(d2.cumulative, 1)], 'a')
  t.equal(d2.keys[bins.searchBin(d2.cumulative, 1.1)], 'b')
  t.equal(d2.keys[bins.searchBin(d2.cumulative, 555)], 'b')

  const d3 = bins.create({
    'a': 2,
    'b': 0,
    'c': 30
  })
  t.equal(d3.keys[bins.searchBin(d3.cumulative, 1.9)], 'a')
  t.equal(d3.keys[bins.searchBin(d3.cumulative, 2)], 'a')
  t.equal(d3.keys[bins.searchBin(d3.cumulative, 2.1)], 'c')

  t.end()
})

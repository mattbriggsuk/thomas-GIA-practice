const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const files = ['reasoning', 'perceptual-speed', 'number-speed-accuracy', 'word-meaning', 'spatial-visualisation'];
const context = vm.createContext({ window: {}, Math, performance, console });
vm.runInContext(fs.readFileSync(path.join(root, 'shared.js'), 'utf8'), context);
context.GIA = context.window.GIA;
let definition;
context.GIA.mountTest = value => { definition = value; };
for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, `${file}.js`), 'utf8'), context);
  const answerCounts = new Map();
  for (let i = 0; i < 5000; i++) {
    const q = definition.generate();
    assert.ok(q.options.length >= 2 && q.options.length <= 5);
    assert.equal(new Set(q.options).size, q.options.length);
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length);
    assert.ok(q.explanation && q.prompt && q.signature);
    const chosen = q.options[q.correct];
    answerCounts.set(chosen, (answerCounts.get(chosen) || 0) + 1);
    if (file === 'reasoning') {
      const a = q.statement.split(' ')[0];
      const b = q.statement.split(' ').at(-1).replace('.', '');
      const high = q.statement.includes('not as') ? b : a;
      const low = high === a ? b : a;
      assert.equal(chosen, q.detail.askMore ? high : low);
    } else if (file === 'perceptual-speed') {
      const count = q.detail.filter(([a,b]) => a.toLowerCase() === b.toLowerCase()).length;
      assert.equal(Number(chosen), count);
      assert.equal(q.detail.length, 4);
    } else if (file === 'number-speed-accuracy') {
      const values = q.options.map(Number).sort((a,b) => a-b);
      const left = values[1] - values[0], right = values[2] - values[1];
      assert.notEqual(left, right);
      assert.equal(Number(chosen), left > right ? values[0] : values[2]);
    } else if (file === 'word-meaning') {
      assert.equal(chosen, q.detail.odd);
      q.detail.pair.forEach(word => assert.ok(q.options.includes(word)));
    } else if (file === 'spatial-visualisation') {
      assert.equal(q.detail.length, 2);
      assert.equal(Number(chosen), q.detail.filter(p => p.topMirror === p.bottomMirror).length);
      q.detail.forEach(p => {
        assert.ok([0,90,180,270].includes(p.topRotation));
        assert.ok([0,90,180,270].includes(p.bottomRotation));
      });
      assert.equal((q.visual.match(/<svg /g) || []).length, 4);
    }
  }
  assert.ok(answerCounts.size >= (file === 'spatial-visualisation' ? 3 : file === 'perceptual-speed' ? 5 : 10));
  console.log(`PASS ${file}: 5,000 generated questions`);
}
for (const file of ['index', ...files]) {
  const html = fs.readFileSync(path.join(root, `${file}.html`), 'utf8');
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!/^https?:/.test(asset)) assert.ok(fs.existsSync(path.join(root, asset)), `Missing ${asset}`);
  }
}
console.log('PASS all HTML asset references');

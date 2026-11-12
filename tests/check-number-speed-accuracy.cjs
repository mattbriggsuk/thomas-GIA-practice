const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Inject the displayed numbers through shuffle, then exercise the real generator
// and its scoring index. No test-only answer calculator is used by the app.
let definition;
let displayedNumbers;
let draw = 0;
const context = vm.createContext({
  GIA: {
    random: () => [1, 1, 2][draw++ % 3],
    shuffle: numbers => displayedNumbers ? [...displayedNumbers] : numbers,
    mountTest: value => { definition = value; }
  }
});
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'number-speed-accuracy.js'), 'utf8'), context);

function permutations([a, b, c]) {
  return [[a,b,c], [a,c,b], [b,a,c], [b,c,a], [c,a,b], [c,b,a]];
}

function check(numbers, expected) {
  displayedNumbers = numbers;
  const question = definition.generate();
  assert.deepEqual(Array.from(question.options, Number), numbers, 'Button order must be preserved');
  assert.equal(Number(question.options[question.correct]), expected, `Wrong answer for [${numbers}]`);
  const lowest = Math.min(...numbers);
  const highest = Math.max(...numbers);
  const remaining = numbers.find(number => number !== lowest && number !== highest);
  assert.notEqual(Number(question.options[question.correct]), remaining, 'Remaining value must never be correct');
  assert.equal(question.detail.remaining, remaining);
  assert.equal(question.detail.distanceToHighest, Math.abs(highest - remaining));
  assert.equal(question.detail.distanceToLowest, Math.abs(lowest - remaining));
}

const examples = [
  [[4,2,8], 8],
  [[12,3,5], 12],
  [[2,8,4], 8],
  [[10,7,5], 10],
  [[11,13,16], 16]
];
for (const [numbers, expected] of examples) {
  for (const order of permutations(numbers)) check(order, expected);
  console.log(`PASS [${numbers.join(', ')}] -> ${expected}, all six screen orders`);
}

for (const [numbers, expected] of [
  [[1,9,12], 1], // The lowest can be correct.
  [[3,10,12], 3], // Numeric rather than lexicographic ordering.
  [[-10,-3,-1], -10],
  [[2,4,6], 2] // Equal distances use the requested "otherwise minimum" rule.
]) {
  for (const order of permutations(numbers)) check(order, expected);
}

let checked = 0;
for (let a = 1; a <= 23; a++) {
  for (let b = a + 1; b <= 24; b++) {
    for (let c = b + 1; c <= 25; c++) {
      const expected = Math.abs(c - b) > Math.abs(a - b) ? c : a;
      for (const order of permutations([a,b,c])) {
        check(order, expected);
        checked++;
      }
    }
  }
}
console.log(`PASS ${checked.toLocaleString('en-GB')} exhaustive screen-order checks, plus lowest-answer, negative-number and tie cases`);

(function(){
  'use strict';
  const {random,shuffle,mountTest} = GIA;
  function buildQuestion(numbers) {
    // Sort a copy by numeric value. Preserve the original order for the buttons.
    const [lowest, remaining, highest] = [...numbers].sort((a, b) => a - b);
    const distanceToHighest = Math.abs(highest - remaining);
    const distanceToLowest = Math.abs(lowest - remaining);
    const answer = distanceToHighest > distanceToLowest ? highest : lowest;
    const explanationSteps = [
      `The lowest number is ${lowest} and the highest is ${highest}, leaving ${remaining}.`,
      `The distance from ${highest} to ${remaining} is ${distanceToHighest}.`,
      `The distance from ${lowest} to ${remaining} is ${distanceToLowest}.`,
      distanceToHighest === distanceToLowest
        ? `The distances are equal; the tie rule selects the lowest number, ${answer}.`
        : `${answer} is further from ${remaining}, so choose ${answer}.`,
      'Screen position does not affect the answer.'
    ];

    return {
      prompt: 'Which extreme is furthest from the remaining number?',
      options: numbers.map(String),
      correct: numbers.indexOf(answer),
      signature: numbers.join(','),
      detail: {lowest, remaining, highest, distanceToHighest, distanceToLowest},
      explanationSteps,
      explanation: explanationSteps.join(' ')
    };
  }

  mountTest({id:'number-speed-accuracy',number:'03',title:'Number Speed & Accuracy',description:'Find the highest and lowest numbers, then choose the one furthest from the remaining number.',instructions:['Identify the smallest and largest of the three numbers. The leftover value is the remaining number.','Compare the distance from the highest to the remaining number with the distance from the lowest to the remaining number.','Choose the highest if its distance is larger; otherwise choose the lowest. Ignore screen position completely. The remaining number is never the answer.','Practice questions exclude equal distances.'],example:'<div class="answers"><span class="answer">11</span><span class="answer">13</span><span class="answer">16</span></div>',exampleExplanation:'The remaining number is 13. 11 is 2 away and 16 is 3 away. Choose 16.',generate(){
    const lowest = random(1,70), gapBelow = random(1,18);
    let gapAbove = random(1,18);
    while (gapAbove === gapBelow) gapAbove = random(1,18);
    const remaining = lowest + gapBelow;
    const highest = remaining + gapAbove;
    return buildQuestion(shuffle([lowest, remaining, highest]));
  }});
})();

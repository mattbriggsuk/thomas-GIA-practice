(function(){
  'use strict';
  const {pick,random,shuffle,mountTest} = GIA;
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
  const visual = pairs => `<div class="practice-mat" role="img" aria-label="Four letter pairs, read top to bottom: ${pairs.map(p=>p.join(' and ')).join('; ')}"><div class="letter-columns">${pairs.map(p=>`<div class="letter-column"><span>${p[0]}</span><span>${p[1]}</span></div>`).join('')}</div></div>`;
  mountTest({id:'perceptual-speed',number:'02',title:'Perceptual Speed',description:'Compare four letter pairs and count how many contain the same letter.',instructions:['Each column contains one pair of letters. Compare the top letter with the one directly below it.','Uppercase and lowercase versions count as the same letter: A matches a.','Choose the number of matching pairs, from 0 to 4.'],example:visual([['F','f'],['D','d'],['M','r'],['H','h']]),exampleExplanation:'F/f, D/d and H/h match. M/r does not. There are 3 matching pairs, so choose 3.',generate(){
    const count = random(0,4); const matches = shuffle([0,1,2,3]).slice(0,count); const pairs = Array.from({length:4},(_,i)=>{const top=pick(letters);const bottom=matches.includes(i)?top:pick(letters.filter(l=>l!==top));return random(0,1)?[top.toLowerCase(),bottom]:[top,bottom.toLowerCase()];});
    return {prompt:'How many letter pairs match?',visual:visual(pairs),options:['0','1','2','3','4'],correct:count,signature:JSON.stringify(pairs),detail:pairs,explanation:pairs.map((p,i)=>`Pair ${i+1}: ${p[0]}/${p[1]} ${p[0].toLowerCase()===p[1].toLowerCase()?'matches':'does not match'}`).join('. ')+`. Total: ${count}.`};
  }});
})();

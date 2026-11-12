(function(){
  'use strict';
  const {pick,shuffle,random,mountTest} = GIA;
  const names = ['Alex','Beth','Chris','Dana','Ella','Finn','Grace','Hugo','Iris','Jack','Kai','Leah','Maya','Noah','Owen','Priya','Rose','Sam','Theo','Zara','Amir','Ben','Chloe','David','Emma','Farah','George','Hannah','Isaac','Jade'];
  const traits = [['taller','shorter','tall'],['heavier','lighter','heavy'],['stronger','weaker','strong'],['older','younger','old'],['faster','slower','fast'],['warmer','colder','warm'],['happier','sadder','happy'],['louder','quieter','loud']];
  mountTest({id:'reasoning',number:'01',title:'Reasoning',description:'Read a comparison, remember it, and answer a question about the two people.',instructions:['Read the statement comparing two people. Click Show question when you are ready.','The statement disappears. Choose the person who answers the question.','Work quickly and accurately. Your answer time includes reading the statement.'],example:'<div class="stimulus">Maya is not as tall as Owen.</div><p>Who is shorter? <strong>Maya</strong> or Owen?</p>',exampleExplanation:'Maya is shorter than Owen, so Maya is the correct answer.',generate(){
    const [a,b] = shuffle(names).slice(0,2); const [more,less,base] = pick(traits); const negative = !!random(0,1); const askMore = !!random(0,1); const statement = negative ? `${a} is not as ${base} as ${b}.` : `${a} is ${more} than ${b}.`; const higher = negative ? b : a; const lower = negative ? a : b; const winner = askMore ? higher : lower; const options = shuffle([a,b]); const prompt = `Who is ${askMore ? more : less}?`;
    return {statement,prompt,options,correct:options.indexOf(winner),signature:statement+prompt,explanation:`${higher} is ${more} than ${lower}. Therefore ${winner} is ${askMore ? more : less}.`,detail:{higher,lower,more,less,askMore}};
  }});
})();

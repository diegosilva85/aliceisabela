const assert=require('node:assert/strict');
const C=require('../dist/pet-core.js');
const angry=C.create(()=>.75);
assert.equal(angry.breed,3);assert.equal(angry.mood,'angry');
assert.equal(C.touch(angry,'shower',0,4000),'angry');
assert.equal(angry.arched,true);assert.equal(angry.progress[0],0);
angry.feeding=true;assert.equal(C.touch(angry,'shower',0,4000),'ignored');
C.calm(angry);assert.equal(angry.arched,false);
assert.equal(C.touch(angry,'dryer',0,4000),'ignored');
assert.equal(C.touch(angry,'shower',0,1250),'working');
assert.equal(angry.progress[0],.5);
assert.equal(C.touch(angry,'shower',0,1250),'region');
assert.equal(C.touch(angry,'shower',0,4000),'ignored');
for(let i=1;i<9;i++) C.touch(angry,'shower',i,4000);
assert.equal(angry.stage,'soap');assert.deepEqual(angry.progress,Array(9).fill(0));
for(const [stage,tool] of [['soap','soap'],['rinseSoap','shower'],['dry','dryer']]){
 assert.equal(angry.stage,stage);
 for(let i=0;i<9;i++){assert.equal(C.touch(angry,tool,i,1499),'working');const result=C.touch(angry,tool,i,1);assert.equal(result,i===8?(stage==='dry'?'finished':'stage'):'region');}
}
assert.equal(angry.stage,'done');assert.equal(C.touch(angry,'shower',0,5000),'ignored');
assert.equal(C.create(()=>0).mood,'sad');
console.log('Pet Shop: randomização, raiva, biscoito, tempos e quatro etapas OK.');
assert.deepEqual(C.durations,{rinse:2500,soap:1500,rinseSoap:1500,dry:1500});
function simulate(path){const m=C.motion();let credit=0;for(let i=0;i<150;i++){const [x,y]=path(i);credit+=C.movement(m,x,y,i*20,0);}return credit;}
assert.equal(simulate(()=>[.5,.5]),0,'Segurar parado não limpa');
assert.ok(simulate(i=>[i*.04,.5])>2000,'Linha reta limpa');
assert.ok(simulate(i=>[i%2?.6:.4,.5])>2000,'Vai e volta limpa');
for(const direction of [1,-1])assert.ok(simulate(i=>[.5+.25*Math.cos(i*.18*direction),.5+.25*Math.sin(i*.18*direction)])>2000,'Círculos também limpam');
const m=C.motion();for(let i=0;i<40;i++)C.movement(m,Math.cos(i*.2),Math.sin(i*.2),i*20,0);
assert.equal(C.movement(m,0,0,5000,0),0,'Pausa reinicia o gesto');
assert.equal(C.movement(m,.1,.1,5020,1),0,'Outra região exige novo gesto');
console.log('Gestos: qualquer movimento limpa; pausa, troca de região e imobilidade não contam.');
const wetCat=C.create(()=>0);
for(let i=0;i<4;i++)C.touch(wetCat,'shower',i,2500);
assert.equal(C.isWet(wetCat),false);
C.touch(wetCat,'shower',4,2500);
assert.equal(C.isWet(wetCat),true);
assert.equal(wetCat.stage,'rinse');
assert.deepEqual(wetCat.progress,[1,1,1,1,1,0,0,0,0],'As quatro manchas restantes continuam');
assert.equal(C.elapsedForTool('dryer',50,0),50,'Secador parado conta tempo');
assert.equal(C.elapsedForTool('shower',50,0),50,'Ducha parada conta tempo');
assert.equal(C.elapsedForTool('soap',50,0),0,'Sabonete parado não conta tempo');
assert.equal(C.elapsedForTool('soap',50,30),30,'Sabão exige movimento');
assert.deepEqual(C.offsetPoint(100,200,false,false),{x:100,y:200},'Desktop não desloca o ponto');
assert.deepEqual(C.offsetPoint(100,200,false,true),{x:190,y:200},'Mobile horizontal desloca para a direita');
assert.deepEqual(C.offsetPoint(100,200,true,true),{x:100,y:290},'Tela girada mantém o deslocamento no eixo horizontal do jogo');
// Every random bin must choose one of the other three breeds, without retries.
for(let previous=0;previous<4;previous++){
 const counts=[0,0,0,0];
 for(let i=0;i<300;i++){const next=C.create(()=>(i+.5)/300,previous);assert.notEqual(next.breed,previous);counts[next.breed]++;}
 assert.deepEqual(counts,counts.map((_,i)=>i===previous?0:100));
 for(const value of [0,1-Number.EPSILON])assert.notEqual(C.create(()=>value,previous).breed,previous);
}
for(const invalid of [null,undefined,-1,4,'2',{}])assert.deepEqual([.125,.375,.625,.875].map(r=>C.create(()=>r,invalid).breed),[0,1,2,3]);
let previous=null;for(let i=0;i<1000;i++){const next=C.create(()=>.5,previous).breed;assert.notEqual(next,previous);previous=next;}
console.log('Sorteio: sem repetição consecutiva e chances iguais para as outras três raças OK.');

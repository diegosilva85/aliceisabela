const assert=require('node:assert/strict');
const C=require('../dist/pet-core.js');
const angry=C.create(()=>.75);
assert.equal(angry.breed,3);assert.equal(angry.mood,'angry');
assert.equal(C.touch(angry,'shower',0,4000),'angry');
assert.equal(angry.arched,true);assert.equal(angry.progress[0],0);
angry.feeding=true;assert.equal(C.touch(angry,'shower',0,4000),'ignored');
C.calm(angry);assert.equal(angry.arched,false);
assert.equal(C.touch(angry,'dryer',0,4000),'ignored');
assert.equal(C.touch(angry,'shower',0,2000),'working');
assert.equal(angry.progress[0],.5);
assert.equal(C.touch(angry,'shower',0,2000),'region');
assert.equal(C.touch(angry,'shower',0,4000),'ignored');
for(let i=1;i<9;i++) C.touch(angry,'shower',i,4000);
assert.equal(angry.stage,'soap');assert.deepEqual(angry.progress,Array(9).fill(0));
for(const [stage,tool] of [['soap','soap'],['rinseSoap','shower'],['dry','dryer']]){
 assert.equal(angry.stage,stage);
 for(let i=0;i<9;i++){assert.equal(C.touch(angry,tool,i,2999),'working');const result=C.touch(angry,tool,i,1);assert.equal(result,i===8?(stage==='dry'?'finished':'stage'):'region');}
}
assert.equal(angry.stage,'done');assert.equal(C.touch(angry,'shower',0,5000),'ignored');
assert.equal(C.create(()=>0).mood,'sad');
console.log('Pet Shop: randomização, raiva, biscoito, tempos e quatro etapas OK.');

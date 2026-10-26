const assert=require('node:assert/strict');
const A=require('../dist/pet-accessories.js');
assert.equal(A.items.filter(i=>i.type==='bow').length,3);
assert.equal(A.items.filter(i=>i.type==='tie').length,3);
for(let breed=0;breed<4;breed++){
 const neck=A.placement(breed,'tie',10,10);assert.equal(neck.slot,'neck');assert.ok(neck.y>=52&&neck.y<=54);assert.ok(neck.x>49&&neck.x<58);
 const left=A.placement(breed,'bow',2,2);assert.equal(left.slot,'headLeft');assert.equal(left.x,29);assert.ok(left.y>=12);assert.ok(left.angle<0);
 const right=A.placement(breed,'bow',99,30);assert.equal(right.slot,'headRight');assert.equal(right.x,79);assert.ok(right.y<=23);assert.ok(right.angle>0);
 assert.equal(A.placement(breed,'bow',52,80).slot,'neck');
}
console.log('Acessórios: seis opções, encaixe no pescoço e limites da cabeça nos quatro gatos OK.');

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
console.log('Acessórios: encaixe no pescoço e limites da cabeça nos quatro gatos OK.');
assert.equal(A.items.filter(i=>i.type==='mask').length,3);
assert.equal(A.items.filter(i=>i.type==='cape').length,2);
for(let breed=0;breed<4;breed++){
 const mask=A.placement(breed,'mask',90,90);assert.equal(mask.slot,'mask');assert.ok(mask.y>=30&&mask.y<=33);
 const cape=A.placement(breed,'cape',5,5);assert.equal(cape.slot,'cape');assert.ok(cape.width>100);
}
assert.ok(A.items.some(i=>i.id==='gorro-link'&&i.type==='hat'));
for(let breed=0;breed<6;breed++){
 const hat=A.placement(breed,'hat',54,18);assert.equal(hat.slot,'hat');assert.ok(hat.y<20);
 for(const [x,y] of [[54,53],[54,90],[5,18],[95,18],[54,-1]])assert.equal(A.placement(breed,'hat',x,y),null);
}
console.log('Link hat: head-only placement on all six pets OK');
assert.ok(A.items.some(i=>i.id==='vestido-zelda'&&i.type==='dress'));
for(let breed=0;breed<6;breed++){
 const dress=A.placement(breed,'dress',54,69);
 assert.equal(dress.slot,'body');
 assert.ok(dress.y-dress.height/2>=48);
 assert.ok(dress.y+dress.height/2<=90);
 for(const [x,y] of [[54,18],[54,32],[54,96],[5,69],[95,69]])assert.equal(A.placement(breed,'dress',x,y),null);
}
console.log('Zelda dress: body-only placement on all six pets OK');

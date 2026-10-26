const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../dist/pet-core.js'),N=require('../dist/pet-nails.js'),A=require('../dist/pet-accessories.js');
for(let breed=0;breed<5;breed++)for(const bite of ['inteiro','mordido-30','mordido-70']){
 const file=C.treatFile(breed,bite);
 assert.equal(file.includes('cachorro'),breed===4);
 assert.ok(fs.existsSync(path.join(__dirname,'../dist/assets/petshop',file)),file);
}
const dog=C.create(()=>.99);assert.equal(dog.breed,4);
assert.equal(C.touch(dog,'shower',0,3000),'angry');assert.ok(dog.arched);assert.ok(dog.progress.every(p=>p===0));
C.calm(dog);for(let i=0;i<5;i++)C.touch(dog,'shower',i,2500);assert.ok(C.isWet(dog));assert.equal(dog.progress.filter(p=>p===0).length,4);
const nails=N.create();nails.selected=true;
for(let paw=0;paw<4;paw++){nails.paw=paw;assert.equal(N.pawTips(4,paw).length,nails.cut[paw].length);for(let i=0;i<nails.cut[paw].length;i++)assert.ok(N.clip(nails,i));}
assert.equal(N.total(nails),18);assert.notDeepEqual(N.pawTips(4,0),N.pawTips(0,0));
assert.equal(A.items.find(i=>i.id==='visor-laser').type,'mask');assert.equal(A.placement(4,'mask',0,0).y,30);
console.log('Dálmata: biscoitos exclusivos, raiva/sujeira, transição molhada, 18 unhas e visor OK.');

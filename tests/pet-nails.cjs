const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const N=require('../dist/pet-nails.js');
const s=N.create();assert.equal(N.clip(s,0),false);s.selected=true;
for(let p=0;p<4;p++){s.paw=p;for(let n=0;n<s.cut[p].length;n++){assert.equal(N.clip(s,n),true);assert.equal(N.clip(s,n),false);}assert.equal(N.clip(s,-1),false);assert.equal(N.clip(s,8),false);}
assert.equal(N.total(s),18);assert.deepEqual(s.cut.map(p=>p.length),[5,5,4,4]);
for(let b=0;b<4;b++)for(let p=0;p<4;p++)assert.ok(fs.existsSync(path.join(__dirname,'../dist',N.file(b,p))));
const main=fs.readFileSync(path.join(__dirname,'../dist/pet.js'),'utf8');assert.ok(main.includes('PetNails.stop();'));assert.match(main,/PetNails.mount\(\{breed:state.breed,onClip:.*onComplete:.*PetAccessories.mount/);
console.log('18 individual cuts, duplicate rejection, tool selection, four breeds and flow integration OK');

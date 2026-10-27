const assert=require('node:assert/strict'),C=require('../dist/pokemon-core');global.window={};require('../dist/pokemon-data');const cards=window.PokemonTableData.cards;
let seed=123;const rng=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
for(const a of C.types)for(const b of C.types)assert.ok([12,25,50].includes(C.damage(a,b)));
assert.equal(C.damage('fire','grass'),50);assert.equal(C.damage('fire','water'),12);assert.equal(C.damage('normal','dark'),25);assert.equal(C.damage('psychic','dark'),12);
for(let run=0;run<150;run++){
 let now=1000;const s=C.create(cards,now,rng),counts={};assert.equal(new Set(s.pool.map(c=>c.id)).size,10);for(const c of s.pool){counts[c.type]=(counts[c.type]||0)+1;assert.ok(counts[c.type]<=2);assert.equal(c.hp,50);}
 assert.equal(C.draft(s,1,s.pool[0].id,now),false);
 while(s.phase==='draft'){const turn=s.turn;assert.ok(C.draft(s,turn,s.pool[0].id,now));now+=10;}
 assert.equal(s.hands[0].length,5);assert.equal(s.hands[1].length,5);
 while(s.phase!=='over'){
  assert.equal(s.phase,'choose');const a=C.available(s,0)[0],b=C.available(s,1)[0],hp=[a.hp,b.hp];
  assert.ok(C.choose(s,0,a.id,now));assert.equal(C.view(s,1).choices[0],true);assert.equal(C.choose(s,0,a.id,now),false);assert.equal(C.choose(s,1,'fake',now),false);assert.ok(C.choose(s,1,b.id,now));
  assert.equal(s.phase,'countdown');assert.equal(a.hp,hp[0]);assert.equal(s.result,null);now=s.deadline;C.tick(s,now,rng);assert.equal(s.phase,'result');assert.equal(a.hp,Math.max(0,hp[0]-C.damage(b.type,a.type)));assert.equal(b.hp,Math.max(0,hp[1]-C.damage(a.type,b.type)));assert.deepEqual(s.result.cards.map(c=>c.hp),hp);
  assert.equal(C.tick(s,s.deadline-1,rng),false);now=s.deadline;C.tick(s,now,rng);assert.ok(s.round<=7);
 }
}
// Both attacks land even when the first would knock out its target.
const s={phase:'choose',hands:[[{id:'a',type:'normal',hp:12}],[{id:'b',type:'normal',hp:12}]],choices:[null,null],round:1,revision:0,deadline:5000};C.choose(s,0,'a',0);C.choose(s,1,'b',0);C.tick(s,s.deadline);assert.deepEqual(s.result.hp,[0,0]);C.tick(s,s.deadline);assert.equal(s.winner,'draw');
// No-input expiry chooses automatically and still finishes a full game.
const idle=C.create(cards,0,rng);while(idle.phase==='draft')C.draft(idle,idle.turn,idle.pool[0].id,0);for(let i=0;i<120&&idle.phase!=='over';i++)C.tick(idle,idle.deadline,rng);assert.equal(idle.phase,'over');
assert.throws(()=>C.deal(cards.filter(c=>c.type==='water')),/tipos suficientes/);
console.log('150 matches: balanced deals, persistent HP, simultaneous damage, hidden choices, deadlines and draws OK');

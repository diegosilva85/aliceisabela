const assert=require('node:assert/strict'),C=require('../dist/burrinho-core');
for(let run=0;run<500;run++){
 const s=C.create();assert.deepEqual(s.hands.map(h=>h.length),[3,3]);assert.equal(s.stock.length,22);let steps=0;
 while(!s.over&&steps++<200){const p=s.turn,m=C.moves(s);assert.equal(C.draw(s,1-p),false);if(m.length){assert.equal(C.draw(s,p),false);const choice=m[Math.floor(Math.random()*m.length)];assert.ok(C.play(s,p,choice.id,choice.side));}else if(s.stock.length)assert.ok(C.draw(s,p));else assert.ok(C.pass(s,p));
 const all=[...s.hands.flat(),...s.stock,...s.board];assert.equal(all.length,28);assert.equal(new Set(all.map(t=>t.id)).size,28);for(let i=1;i<s.board.length;i++)assert.equal(s.board[i-1].b,s.board[i].a);
 }
 assert.ok(s.over);if(s.winner!==null)assert.equal(s.hands[s.winner].length,0);
}
const s={hands:[[{id:'0-1',a:0,b:1}],[{id:'2-3',a:2,b:3}]],stock:[],board:[{id:'4-4',a:4,b:4}],turn:0,over:false,passes:0,winner:null};assert.ok(C.pass(s,0));assert.ok(C.pass(s,1));assert.equal(s.over,true);assert.equal(s.winner,null);
console.log('500 complete games: legal matching, ownership, 28 unique tiles, drawing, passing, victories and blocked draw OK');

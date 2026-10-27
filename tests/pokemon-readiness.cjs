const assert=require('node:assert/strict'),{Matchmaking}=require('../server/matchmaking.cjs');
let now=0;const m=new Matchmaking({now:()=>now,rng:()=>.4}),a=m.join().token,b=m.join().token;
const heartbeat=t=>{const s=m.state(t);return m.action(t,{kind:'heartbeat',active:true,phase:s.phase,round:s.round,deadline:s.deadline});};
for(let i=0;i<10;i++){const s=m.state(a);m.action(s.turn?b:a,{kind:'draft',picks:s.picks,id:s.pool[0].id});}
heartbeat(a);assert.equal(m.state(a).phase,'ready');heartbeat(b);
for(let i=0;i<10;i++){now+=450;heartbeat(a);heartbeat(b);}
now=5000;heartbeat(a);assert.equal(m.state(a).phase,'choose');assert.equal(m.state(a).result,null);
now+=1600;heartbeat(a);assert.equal(m.state(a).phase,'paused');assert.deepEqual(m.state(a).choices,[null,false]);
heartbeat(b);heartbeat(a);heartbeat(b);let s=m.state(a);assert.equal(s.phase,'choose');assert.equal(s.deadline,now+5000);
for(let i=0;i<11;i++){now+=450;heartbeat(a);heartbeat(b);}
now+=100;heartbeat(a);assert.equal(m.state(a).phase,'choose');heartbeat(b);assert.equal(m.state(a).phase,'countdown');
for(let i=0;i<24;i++){now+=450;heartbeat(a);heartbeat(b);}
s=m.state(a);assert.equal(s.round,2);assert.equal(s.phase,'choose');
m.action(b,{kind:'heartbeat',active:false});assert.equal(m.state(a).phase,'paused');
const hp=m.state(a).hands.map(h=>h.map(c=>c.hp));for(let i=0;i<20;i++){now+=500;heartbeat(a);}assert.deepEqual(m.state(a).hands.map(h=>h.map(c=>c.hp)),hp);assert.equal(m.state(a).round,2);
console.log('Readiness: dual barrier, expiry acknowledgments, late disconnect, fresh timer, hidden tab and frozen HP OK');

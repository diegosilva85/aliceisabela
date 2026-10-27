const assert=require('node:assert/strict'),{Matchmaking}=require('../server/matchmaking.cjs'),{createServer}=require('../server/server.cjs');
let now=1000;const m=new Matchmaking({now:()=>now,rng:()=>.4});const a=m.join();assert.equal(a.phase,'waiting');const b=m.join();assert.equal(b.phase,'draft');let s=m.state(a.token);assert.equal(s.you,0);assert.equal(b.you,1);assert.deepEqual(s.pool,b.pool);
assert.throws(()=>m.action(b.token,{kind:'draft',id:s.pool[0].id,picks:0}),/disponível/);
for(let i=0;i<10;i++){s=m.state(a.token);m.action(s.turn===0?a.token:b.token,{kind:'draft',id:s.pool[0].id,picks:s.picks});}
s=m.state(a.token);assert.equal(s.phase,'ready');
const beat=(token,active=true)=>{const v=m.state(token);return m.action(token,{kind:'heartbeat',active,phase:v.phase,round:v.round,deadline:v.deadline});};
beat(a.token);assert.equal(m.state(a.token).phase,'ready');beat(b.token);assert.equal(m.state(a.token).phase,'choose');
now+=1600;m.sweep();assert.equal(m.state(a.token).phase,'paused');assert.equal(m.state(a.token).result,null);
beat(a.token);assert.equal(m.state(a.token).phase,'paused');beat(b.token);beat(a.token);beat(b.token);s=m.state(a.token);assert.equal(s.phase,'choose');
m.action(a.token,{kind:'choose',round:s.round,id:s.hands[0][0].id});assert.equal(m.state(b.token).choices[0],true);
m.action(b.token,{kind:'choose',round:s.round,id:s.hands[1][0].id});
for(let i=0;i<7;i++){now+=450;beat(a.token);beat(b.token);}s=m.state(a.token);assert.equal(s.phase,'result');assert.ok(s.result.damage.every(d=>[12,25,50].includes(d)));
m.leave(b.token);s=m.state(a.token);assert.equal(s.phase,'over');assert.equal(s.winner,null);assert.throws(()=>m.state('invalid'),/Sessão/);
const q=m.join();now+=31000;m.sweep();assert.throws(()=>m.state(q.token),/Sessão/);assert.equal(m.rooms.size,0);
(async()=>{const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;try{
 const post=(p,body={},token='',origin)=>fetch(url+'/api/pokemon/'+p,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token,...(origin?{Origin:origin}:{})},body:JSON.stringify(body)});
 assert.equal((await fetch(url+'/api/pokemon/state')).status,401);assert.equal((await post('join',{},'','https://evil.example')).status,403);
 const first=await (await post('join')).json(),second=await (await post('join')).json();assert.equal(first.phase,'waiting');assert.equal(second.phase,'draft');assert.notEqual(first.token,second.token);
 assert.equal((await post('action',{kind:'choose',id:'fake',round:1},second.token)).status,409);
 assert.equal((await post('leave',{},first.token)).status,200);const state=await (await fetch(url+'/api/pokemon/state',{headers:{Authorization:'Bearer '+second.token}})).json();assert.equal(state.phase,'over');assert.equal(state.winner,null);
 console.log('Matchmaking: pairing, authorization, hidden moves, stale actions, timeout, leave and HTTP API OK');
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});

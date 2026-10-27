const assert=require('node:assert/strict'),{withPrivateRooms}=require('../server/private-rooms.cjs'),{Matchmaking}=require('../server/matchmaking.cjs'),{KeepupMatchmaking}=require('../server/keepup-matchmaking.cjs');
for(const [game,Class] of [['pokemon',Matchmaking],['keepup',KeepupMatchmaking]]){
 let now=1000;const m=withPrivateRooms(new Class({now:()=>now,rng:()=>.4}),game);
 const host=m.join({private:true,preferHost:true,lanOnly:true,level:'easy'});assert.equal(host.phase,'lobby');assert.match(host.lobby.code,/^[a-f0-9]{48}$/);
 const publicA=m.join({level:'easy'});assert.equal(publicA.phase,'waiting');const publicB=m.join({level:'easy'});assert.notEqual(publicB.phase,'lobby');assert.equal(m.state(host.token).lobby.full,false);
 assert.throws(()=>m.join({invite:'invalid'}),/inválido/);assert.throws(()=>m.action(host.token,{kind:'room-start'}),/Aguarde/);
 const friend=m.join({invite:host.lobby.code});assert.equal(friend.you,1);assert.equal(friend.lobby.owner,false);assert.equal(m.state(host.token).lobby.full,true);
 assert.throws(()=>m.join({invite:host.lobby.code}),/ocupada/);assert.throws(()=>m.action(friend.token,{kind:'room-start'}),/anfitrião/);
 const starting=m.action(host.token,{kind:'room-start'});assert.equal(starting.phase,'connecting');
 assert.throws(()=>m.action(publicA.token,{kind:'room-signal',signal:{type:'offer',sdp:'x'}}),/encontrada/);
 assert.throws(()=>m.action(friend.token,{kind:'room-signal',signal:{type:'offer',sdp:'x'}}),/inválido/);
 m.action(host.token,{kind:'room-signal',signal:{type:'offer',sdp:'offer'}});assert.equal(m.state(friend.token).signal.sdp,'offer');assert.equal(m.state(host.token).signal,null);
 m.action(host.token,{kind:'room-connected',lan:{localType:'host',remoteType:'host',localAddress:'192.168.1.10',remoteAddress:'192.168.1.20'}});assert.equal(m.state(host.token).phase,'connecting');m.action(friend.token,{kind:'room-connected',lan:{localType:'host',remoteType:'host',localAddress:'192.168.1.20',remoteAddress:'192.168.1.10'}});assert.equal(m.state(host.token).phase,'direct');
 m.leave(friend.token);assert.equal(m.state(host.token).lobby.closed,true);assert.throws(()=>m.join({invite:host.lobby.code}),/expirou/);
 const h=m.join({private:true,preferHost:true,lanOnly:true}),g=m.join({invite:h.lobby.code});m.action(h.token,{kind:'room-start'});now+=10001;let v=m.state(h.token);assert.equal(v.lobby.transport,'server','fallback selected for both peers');assert.equal(m.state(g.token).lobby.transport,'server');
 // Replays retain seats, participants and invitation; no new queue pairing.
 const r=m.rooms.get(m.sessions.get(h.token).room);if(game==='pokemon'){r.state.phase='over';r.state.winner='draw';}else{r.phase='over';r.state={over:true};}
 m.action(h.token,{kind:'rematch'});assert.equal(m.state(g.token).rematch[0],true);m.action(g.token,{kind:'rematch'});v=m.state(h.token);assert.equal(v.generation,1);assert.equal(v.phase,game==='pokemon'?'draft':'characters');assert.equal(v.lobby.code,h.lobby.code);
 assert.throws(()=>m.action(g.token,{kind:game==='pokemon'?'draft':'character',id:'bad',character:'bluey',picks:0,generation:0}),/mudou/);
 if(game==='pokemon'){assert.equal(v.pool.length,12);assert.equal(v.hands[0].length,0);}else assert.deepEqual(v.characters,[null,null]);
 m.leave(h.token);assert.equal(m.state(g.token).phase,'over');now+=40000;m.sweep();assert.equal(m.sessions.size,0);
}
console.log('Private rooms: unguessable invites, queue isolation, two seats, owner start, signaling isolation, shared fallback, same-room rematch and cleanup OK');

const assert=require('node:assert/strict'),N=require('../dist/online-network.js'),{withPrivateRooms}=require('../server/private-rooms.cjs'),{Matchmaking}=require('../server/matchmaking.cjs'),{KeepupMatchmaking}=require('../server/keepup-matchmaking.cjs');
const lan=(a='192.168.1.10',b='192.168.1.20')=>({localType:'host',remoteType:'host',localAddress:a,remoteAddress:b});
assert.equal(N.eligible(lan()),true);assert.equal(N.eligible(lan('10.2.3.4','10.2.3.5')),true);
for(const e of [null,lan('8.8.8.8','8.8.8.9'),lan('192.168.1.2','192.168.2.3'),lan('100.64.0.1','100.64.0.2'),lan('hidden.local','peer.local'),lan('::1','::1'),lan('192.168.1.999','192.168.1.3'),{...lan(),remoteType:'srflx'},{...lan(),localType:'relay'}])assert.equal(N.eligible(e),false);
assert.equal(N.reciprocal(lan(),lan('192.168.1.20','192.168.1.10')),true);assert.equal(N.reciprocal(lan(),lan()),false);
const stats=new Map([['t',{type:'transport',selectedCandidatePairId:'p'}],['p',{type:'candidate-pair',state:'succeeded',localCandidateId:'l',remoteCandidateId:'r'}],['l',{candidateType:'host',address:'192.168.1.10'}],['r',{candidateType:'host',address:'192.168.1.20'}]]);
assert.deepEqual(N.fromStats(stats),lan());stats.get('p').state='in-progress';assert.equal(N.fromStats(stats),null);stats.get('p').state='succeeded';stats.delete('t');assert.equal(N.fromStats(stats),null,'only selected routes qualify');stats.get('p').selected=true;assert.deepEqual(N.fromStats(stats),lan());stats.get('r').address='hidden.local';assert.equal(N.fromStats(stats),null);
for(const [game,Class] of [['pokemon',Matchmaking],['keepup',KeepupMatchmaking]]){
 const m=withPrivateRooms(new Class(),game);
 const start=opts=>{const a=m.join({private:true,...opts}),b=m.join({invite:a.lobby.code});return {a,b,state:m.action(a.token,{kind:'room-start'})};};
 for(const opts of [{},{preferHost:true},{preferHost:false,lanOnly:true}])assert.equal(start(opts).state.lobby.transport,'server','default and legacy clients use server');
 for(const evidence of [undefined,lan('8.8.8.8','8.8.8.9'),lan('192.168.1.10','192.168.2.20')]){const {a,b}=start({preferHost:true,lanOnly:true});m.action(a.token,{kind:'room-connected',lan:evidence});assert.equal(m.state(b.token).lobby.transport,'server');}
 const {a,b}=start({preferHost:true,lanOnly:true});m.action(a.token,{kind:'room-connected',lan:lan()});assert.equal(m.state(b.token).lobby.transport,'connecting');m.action(b.token,{kind:'room-connected',lan:lan()});assert.equal(m.state(a.token).lobby.transport,'server','inconsistent endpoint reports fail closed');
}
console.log('LAN policy: server default, legacy clients, selected ICE route, private subnet, hidden/public/VPN-ambiguous addresses, reciprocal endpoints and both games OK');

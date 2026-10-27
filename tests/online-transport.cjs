const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let requests=0;
const context={PokemonSessions:require('../server/matchmaking.cjs'),KeepupSessions:require('../server/keepup-matchmaking.cjs'),PokemonTableData:require('../dist/pokemon-data-node.cjs'),setTimeout,clearTimeout,setInterval,clearInterval,AbortController,URL,addEventListener(){},fetch:async()=>{requests++;return {ok:true,json:async()=>({})};}};context.window=context;
vm.runInNewContext(fs.readFileSync('dist/online-rooms.js','utf8'),context);
const {Connection}=context.OnlineRooms;
(async()=>{for(const game of ['pokemon','keepup']){
 const host=new Connection(game,'host','easy'),guest=new Connection(game,'guest','easy');host.owner=true;host.initEngine();host.direct=guest.direct=true;
 const a={readyState:'open',bufferedAmount:0,send:s=>queueMicrotask(()=>b.onmessage({data:s})),close(){}},b={readyState:'open',bufferedAmount:0,send:s=>queueMicrotask(()=>a.onmessage({data:s})),close(){}};host.attach(a);guest.attach(b);const before=requests;
 const own=await host.request('state'),remote=await guest.request('state');assert.equal(own.you,0);assert.equal(remote.you,1);
 if(game==='pokemon'){assert.equal(remote.pool.length,12);const id=own.pool[0].id;await host.request('action',{kind:'draft',id,picks:0,generation:0});const response=await guest.request('state');assert.equal(response.turn,1);await guest.request('action',{kind:'draft',id:response.pool[0].id,picks:1,generation:0});assert.equal((await host.request('state')).hands[1].length,1);}
 else{await host.request('action',{kind:'character',character:'bluey'});await guest.request('action',{kind:'character',character:'bingo'});assert.equal((await guest.request('state')).phase,'playing');await assert.rejects(guest.request('action',{kind:'input',sequence:0,direction:8}),/inválida/);}
 assert.equal(requests,before,'gameplay uses the peer channel, not HTTP');assert.equal(guest.pending.size,0);guest.linkLost=true;await assert.rejects(guest.request('state'),e=>e.status===401);host.close();guest.close();
}console.log('Direct transport: host authority, guest RPC, six-card draft integration, valid characters, error replies, cleanup, disconnect and no HTTP gameplay OK');})().catch(e=>{console.error(e);process.exitCode=1;});

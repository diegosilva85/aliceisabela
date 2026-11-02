'use strict';
const crypto=require('node:crypto'),C=require('../dist/burrinho-core.js');
const fail=(text,status=409)=>{throw Object.assign(Error(text),{status});};
class BurrinhoMatchmaking{
 constructor({now=Date.now,rng=Math.random}={}){this.now=now;this.rng=rng;this.sessions=new Map();this.rooms=new Map();this.queue=[];}
 get(t){const s=this.sessions.get(t);if(!s)fail('Sessão encerrada. Entre novamente.',401);return s;}
 join(){this.sweep();if(this.sessions.size>=200)fail('Servidor cheio.',503);const token=crypto.randomBytes(24).toString('hex');this.sessions.set(token,{token,seen:this.now(),created:this.now(),room:null,seat:null});this.queue.push(token);while(this.queue.length>=2)this.makeRoom(this.queue.splice(0,2));return {token,...this.state(token)};}
 makeRoom(tokens){const id=crypto.randomUUID();this.rooms.set(id,{state:C.create(this.rng),tokens,revision:0,generation:0,rematch:[false,false],presence:[this.now(),this.now()],active:[true,true],paused:false,reason:''});tokens.forEach((t,seat)=>Object.assign(this.get(t),{room:id,seat}));return id;}
 advance(r){const paused=!r.state.over&&r.tokens.some((t,p)=>!this.sessions.has(t)||!r.active[p]||this.now()-r.presence[p]>5000);if(paused!==r.paused){r.paused=paused;r.revision++;}}
 state(t){const s=this.get(t);s.seen=this.now();const r=this.rooms.get(s.room);if(!r)return {phase:'waiting'};this.advance(r);const g=r.state;return {phase:g.over?'over':r.paused?'paused':'playing',you:s.seat,turn:g.turn,over:g.over,winner:g.winner,reason:r.reason,board:g.board.map(t=>({...t})),hands:g.hands.map((h,p)=>p===s.seat?h.map(t=>({...t})):h.map(()=>({hidden:true}))),stockCount:g.stock.length,revision:r.revision,generation:r.generation,rematch:[...r.rematch]};}
 action(t,b){const s=this.get(t);s.seen=this.now();const r=this.rooms.get(s.room);if(!r){if(b.kind==='heartbeat')return this.state(t);fail('Aguardando oponente.');}
 if(b.kind==='heartbeat'){r.presence[s.seat]=this.now();r.active[s.seat]=b.active===true;return this.state(t);}
 if(b.generation!==r.generation)fail('A partida já mudou.');
 if(b.kind==='rematch'){if(!r.state.over||r.reason||!r.tokens.every(t=>this.sessions.has(t)))fail('O oponente precisa estar na sala.');r.rematch[s.seat]=true;r.revision++;if(r.rematch.every(Boolean)){r.state=C.create(this.rng);r.generation++;r.rematch=[false,false];r.presence=[this.now(),this.now()];r.active=[true,true];r.paused=false;}return this.state(t);}
 this.advance(r);if(r.paused)fail('Aguardando o outro jogador reconectar.');if(b.revision!==r.revision)fail('A mesa mudou. Confira sua jogada.');
 const ok=b.kind==='play'?C.play(r.state,s.seat,b.id,b.side):b.kind==='draw'?C.draw(r.state,s.seat):b.kind==='pass'?C.pass(r.state,s.seat):false;if(!ok)fail('Jogada inválida.');r.revision++;return this.state(t);}
 leave(t){const s=this.sessions.get(t);if(!s)return;const r=this.rooms.get(s.room);if(r){r.state.over=true;r.state.winner=null;r.reason='O oponente saiu ou não reconectou. Partida encerrada sem vencedor.';r.revision++;}this.sessions.delete(t);this.queue=this.queue.filter(k=>k!==t);}
 sweep(){for(const [t,s] of this.sessions)if(this.now()-s.seen>60000||this.now()-s.created>3600000)this.leave(t);for(const [id,r] of this.rooms){this.advance(r);if(r.tokens.every(t=>!this.sessions.has(t)))this.rooms.delete(id);}}
}
module.exports={BurrinhoMatchmaking};

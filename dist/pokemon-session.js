(function(root){
'use strict';
const node=typeof module!=='undefined'&&module.exports;
const crypto=node?require('node:crypto'):root.crypto;
const secret=()=>node?crypto.randomBytes(24).toString('hex'):Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
const uid=()=>crypto.randomUUID();
const Core=node?require('./pokemon-core.js'):root.PokemonTableCore;
const cards=node?(()=>{const data=require('./pokemon-data-node.cjs');return data.cards;})():root.PokemonTableData.cards;
class Matchmaking{
 constructor({now=Date.now,rng=Math.random}={}){this.now=now;this.rng=rng;this.sessions=new Map();this.rooms=new Map();this.queue=[];}
 join(){this.sweep();if(this.sessions.size>=200)throw Object.assign(Error('Servidor cheio. Tente em instantes.'),{status:503});const token=secret(),s={token,seen:this.now(),created:this.now(),room:null,seat:null};this.sessions.set(token,s);this.queue.push(token);this.pair();return {token,...this.state(token)};}
 makeRoom(tokens,options={}){const id=uid(),state=Core.create(cards,this.now(),this.rng);this.rooms.set(id,{state,tokens,created:this.now(),ready:[false,false],presence:[this.now(),this.now()],active:[true,true],expiry:[false,false],paused:null,rematch:[false,false],generation:0});tokens.forEach((t,p)=>Object.assign(this.sessions.get(t),{room:id,seat:p}));return id;}
 pair(){while(this.queue.length>=2)this.makeRoom(this.queue.splice(0,2));}
 get(token){const s=this.sessions.get(token);if(!s)throw Object.assign(Error('Sessão encerrada. Entre novamente.'),{status:401});return s;}
 gate(r){if(r.state.phase==='choose'){r.state.phase='ready';r.state.deadline=null;r.ready=[false,false];r.expiry=[false,false];r.state.revision++;}}
 advance(r){const now=this.now(),st=r.state;if(st.phase==='over')return;
 const connected=r.tokens.map((t,p)=>this.sessions.has(t)&&r.active[p]&&now-r.presence[p]<1500);
 if(!connected.every(Boolean)){if(!r.paused){r.paused={phase:st.phase,remaining:st.deadline===null?null:Math.max(0,st.deadline-now),at:now};st.phase='paused';st.deadline=null;st.revision++;}return;}
 if(r.paused){const saved=r.paused;r.paused=null;st.phase=saved.phase;st.deadline=saved.remaining===null?null:now+saved.remaining;if(st.result)st.result.at+=now-saved.at;st.revision++;if(st.phase==='choose'){st.choices=[null,null];this.gate(r);}if(st.phase==='ready')r.ready=[false,false];}
 if(st.phase==='choose'&&now>=st.deadline&&!r.expiry.every(Boolean))return;
 const before=st.phase;Core.tick(st,now,this.rng);if(before==='result')this.gate(r);
 }
 state(token){const s=this.get(token),r=this.rooms.get(s.room);if(r)this.advance(r);s.seen=this.now();if(!r)return {phase:'waiting',serverNow:this.now()};return {...Core.view(r.state,s.seat),ready:r.ready,rematch:r.rematch||[false,false],generation:r.generation||0,serverNow:this.now()};}
 action(token,{kind,id,round,picks,phase,deadline,active,generation}){const s=this.get(token),r=this.rooms.get(s.room);s.seen=this.now();if(!r){if(kind==='heartbeat')return this.state(token);throw Object.assign(Error('Aguardando oponente'),{status:409});}
 if(generation!==undefined&&generation!==(r.generation||0)){if(kind==='heartbeat')return this.state(token);throw Object.assign(Error('A partida já mudou.'),{status:409});}
 if(kind==='rematch'){if(r.state.phase!=='over'||!r.tokens.every(t=>this.sessions.has(t)))throw Object.assign(Error('A outra pessoa precisa estar na sala.'),{status:409});r.rematch??=[false,false];r.rematch[s.seat]=true;if(r.rematch.every(Boolean)){const revision=r.state.revision+1;r.state=Core.create(cards,this.now(),this.rng);r.state.revision=revision;r.ready=[false,false];r.presence=[this.now(),this.now()];r.active=[true,true];r.expiry=[false,false];r.paused=null;r.rematch=[false,false];r.generation=(r.generation||0)+1;}return this.state(token);}
 this.advance(r);const st=r.state;
 if(kind==='heartbeat'){r.presence[s.seat]=this.now();r.active[s.seat]=active===true;this.advance(r);
 if(active===true&&round===st.round&&phase===st.phase){
 if(st.phase==='ready'){r.ready[s.seat]=true;if(r.ready.every(Boolean)){st.phase='choose';st.deadline=this.now()+Core.CHOOSE_MS;r.expiry=[false,false];st.revision++;}}
 if(st.phase==='choose'&&deadline===st.deadline&&this.now()>=st.deadline)r.expiry[s.seat]=true;
 }this.advance(r);return this.state(token);}
 let ok=false;if(kind==='draft'&&picks===st.picks)ok=Core.draft(st,s.seat,id,this.now());if(kind==='choose'&&round===st.round)ok=Core.choose(st,s.seat,id,this.now());this.gateAfterDraft(r,kind,ok);if(!ok)throw Object.assign(Error('Essa escolha não está disponível.'),{status:409});return this.state(token);}
 gateAfterDraft(r,kind,ok){if(ok&&kind==='draft')this.gate(r);}
 leave(token){const s=this.sessions.get(token);if(!s)return;this.queue=this.queue.filter(t=>t!==token);const r=this.rooms.get(s.room);if(r&&r.state.phase!=='over'){r.state.phase='over';r.state.winner=null;r.state.reason='Partida interrompida: o oponente saiu ou não reconectou. Sem vencedor.';r.state.revision++;}this.sessions.delete(token);}
 sweep(){const now=this.now();for(const [t,s] of this.sessions){if(now-s.seen>30000||now-s.created>3600000)this.leave(t);}for(const [id,r] of this.rooms){this.advance(r);if(r.tokens.every(t=>!this.sessions.has(t)))this.rooms.delete(id);}this.queue=this.queue.filter(t=>this.sessions.has(t));}
}
const api={Matchmaking};if(node)module.exports=api;else root.PokemonSessions=api;
})(typeof window==='undefined'?globalThis:window);

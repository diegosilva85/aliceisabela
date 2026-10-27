'use strict';
const crypto=require('node:crypto'),Core=require('../dist/pokemon-core');
global.window={};require('../dist/pokemon-data');const cards=window.PokemonTableData.cards;
class Matchmaking{
 constructor({now=Date.now,rng=Math.random}={}){this.now=now;this.rng=rng;this.sessions=new Map();this.rooms=new Map();this.queue=[];}
 join(){this.sweep();if(this.sessions.size>=200)throw Object.assign(Error('Servidor cheio. Tente em instantes.'),{status:503});const token=crypto.randomBytes(24).toString('hex'),s={token,seen:this.now(),created:this.now(),room:null,seat:null};this.sessions.set(token,s);this.queue.push(token);this.pair();return {token,...this.state(token)};}
 pair(){while(this.queue.length>=2){const tokens=this.queue.splice(0,2),id=crypto.randomUUID(),state=Core.create(cards,this.now(),this.rng);this.rooms.set(id,{state,tokens,created:this.now()});tokens.forEach((t,p)=>Object.assign(this.sessions.get(t),{room:id,seat:p}));}}
 get(token){const s=this.sessions.get(token);if(!s)throw Object.assign(Error('Sessão encerrada. Entre novamente.'),{status:401});return s;}
 state(token){const s=this.get(token);s.seen=this.now();const r=this.rooms.get(s.room);if(!r)return {phase:'waiting',serverNow:this.now()};Core.tick(r.state,this.now(),this.rng);return {...Core.view(r.state,s.seat),serverNow:this.now()};}
 action(token,{kind,id,round,picks}){const s=this.get(token),r=this.rooms.get(s.room);s.seen=this.now();if(!r)throw Object.assign(Error('Aguardando oponente'),{status:409});Core.tick(r.state,this.now(),this.rng);const st=r.state;let ok=false;if(kind==='draft'&&picks===st.picks)ok=Core.draft(st,s.seat,id,this.now());if(kind==='choose'&&round===st.round)ok=Core.choose(st,s.seat,id,this.now());if(!ok)throw Object.assign(Error('Essa escolha não está disponível.'),{status:409});return this.state(token);}
 leave(token){const s=this.sessions.get(token);if(!s)return;this.queue=this.queue.filter(t=>t!==token);const r=this.rooms.get(s.room);if(r&&r.state.phase!=='over'){r.state.phase='over';r.state.winner=1-s.seat;r.state.reason='O oponente saiu ou perdeu a conexão.';r.state.revision++;}this.sessions.delete(token);}
 sweep(){const now=this.now();for(const [t,s] of this.sessions){if(now-s.seen>30000||now-s.created>3600000)this.leave(t);}for(const [id,r] of this.rooms){Core.tick(r.state,now,this.rng);if(r.tokens.every(t=>!this.sessions.has(t)))this.rooms.delete(id);}this.queue=this.queue.filter(t=>this.sessions.has(t));}
}
module.exports={Matchmaking};

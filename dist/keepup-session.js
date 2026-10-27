(function(root){
'use strict';
const node=typeof module!=='undefined'&&module.exports;
const crypto=node?require('node:crypto'):root.crypto;
const secret=()=>node?crypto.randomBytes(24).toString('hex'):Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
const uid=()=>crypto.randomUUID();
const Core=node?require('./keepup-core.js'):root.KeepUpCore;
class KeepupMatchmaking {
 constructor({now=Date.now,rng=Math.random}={}){this.now=now;this.rng=rng;this.sessions=new Map();this.rooms=new Map();}
 get(token){const s=this.sessions.get(token);if(!s)throw Object.assign(Error('Sessão encerrada. Entre novamente.'),{status:401});s.seen=this.now();return s;}
 join({level='easy'}={}){this.sweep();if(!Object.hasOwn(Core.intervals,level))throw Object.assign(Error('Dificuldade inválida'),{status:400});if(this.sessions.size>=200)throw Object.assign(Error('Servidor cheio'),{status:503});const token=secret(),s={level,seen:this.now(),created:this.now(),room:null,seat:0};const other=[...this.sessions].find(([,p])=>!p.private&&!p.room&&p.level===level);this.sessions.set(token,s);if(other)this.makeRoom([other[0],token]);return {token,...this.state(token)};}
 makeRoom(tokens){const id=uid();tokens.forEach((t,seat)=>Object.assign(this.sessions.get(t),{room:id,seat}));this.rooms.set(id,{tokens,phase:'characters',characters:[null,null],directions:[0,0],ready:[false,false],active:[true,true],inputAt:[0,0],sequence:[-1,-1],state:null,last:this.now(),rematch:[false,false],generation:0});return id;}

 state(token){const s=this.get(token),r=this.rooms.get(s.room);if(!r)return {phase:'waiting',level:s.level};return {phase:r.phase,you:s.seat,characters:r.characters,state:r.state?{...r.state,paused:r.phase==='playing'&&(!r.ready.every(Boolean)||!r.active.every(Boolean)||r.inputAt.some(t=>this.now()-t>1500))}:null,reason:r.reason,rematch:r.rematch,generation:r.generation,serverNow:this.now()};}
 action(token,body){const s=this.get(token),r=this.rooms.get(s.room);if(!r)throw Object.assign(Error('Aguardando jogador'),{status:409});if(body.generation!==undefined&&body.generation!==r.generation)throw Object.assign(Error('A partida já mudou.'),{status:409});if(body.kind==='rematch'){if(r.phase!=='over'||!r.tokens.every(t=>this.sessions.has(t)))throw Object.assign(Error('A outra pessoa precisa estar na sala.'),{status:409});r.rematch[s.seat]=true;if(r.rematch.every(Boolean)){r.phase='characters';r.characters=[null,null];r.state=null;r.reason='';r.ready=[false,false];r.active=[true,true];r.inputAt=[0,0];r.directions=[0,0];r.sequence=[-1,-1];r.rematch=[false,false];r.generation++;r.last=this.now();}return this.state(token);}
 if(body.kind==='character'){if(r.phase!=='characters'||!['bluey','bingo'].includes(body.character)||r.characters[1-s.seat]===body.character)throw Object.assign(Error('Personagem indisponível'),{status:409});r.characters[s.seat]=body.character;if(r.characters.every(Boolean)){r.state=Core.create(s.level,this.rng);r.state.players=[{...r.state.player,x:600},{...r.state.player,x:1000}];r.phase='playing';r.last=this.now();}}
 else if(body.kind==='ready'){if(r.phase==='playing'&&!r.ready[s.seat]){r.ready[s.seat]=true;r.inputAt[s.seat]=this.now();r.last=this.now();}}
 else if(body.kind==='input'){if(![-1,0,1].includes(body.direction)||!Number.isSafeInteger(body.sequence))throw Object.assign(Error('Entrada inválida'),{status:400});if(body.sequence>r.sequence[s.seat]){r.sequence[s.seat]=body.sequence;r.active[s.seat]=body.active!==false;r.directions[s.seat]=r.active[s.seat]?body.direction:0;r.inputAt[s.seat]=this.now();}}
 else throw Object.assign(Error('Ação inválida'),{status:400});return this.state(token);}
 leave(token){const s=this.sessions.get(token);if(!s)return;const r=this.rooms.get(s.room);if(r&&r.phase!=='over'){r.phase='over';r.reason='A outra pessoa saiu ou perdeu a conexão.';if(r.state)r.state.over=true;}this.sessions.delete(token);}
 sweep(){const now=this.now();for(const [t,s] of this.sessions)if(now-s.seen>15000||now-s.created>3600000)this.leave(t);for(const [id,r] of this.rooms){if(r.tokens.every(t=>!this.sessions.has(t))){this.rooms.delete(id);continue;}if(r.phase==='playing'){if(!r.ready.every(Boolean)||!r.active.every(Boolean)||r.inputAt.some(t=>now-t>1500)){r.last=now;continue;}let remaining=Math.min(.25,(now-r.last)/1000);r.last=now;const dirs=r.directions.map((v,i)=>now-r.inputAt[i]>700?0:v);while(remaining>0){const dt=Math.min(remaining,1/120);Core.step(r.state,dt,dirs,this.rng);Core.animate(r.state,dt);remaining-=dt;}if(r.state.over)r.phase='over';}}}
}
const api={KeepupMatchmaking};if(node)module.exports=api;else root.KeepupSessions=api;
})(typeof window==='undefined'?globalThis:window);

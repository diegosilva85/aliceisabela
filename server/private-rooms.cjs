'use strict';
const crypto=require('node:crypto');
const fail=(message,status=409)=>{throw Object.assign(Error(message),{status});};
function withPrivateRooms(service,game){
 const rooms=new Map(),member=new Map();
 const original={};for(const name of ['join','state','action','leave','sweep'])original[name]=service[name].bind(service);
 const info=(r,t)=>({code:r.code,owner:r.tokens[0]===t,full:r.tokens.length===2,started:r.started,closed:r.closed,preferHost:r.preferHost,transport:r.transport,level:r.level});
 const find=t=>{service.get(t);const r=rooms.get(member.get(t));if(!r)fail('Sala não encontrada.',404);return r;};
 const fresh=t=>{const s=service.get(t);s.seen=service.now();return s;};
 service.join=function(options={}){
  if(!options.private&&!options.invite)return original.join(options);
  service.sweep();if(service.sessions.size>=200)fail('Servidor cheio.',503);
  let r;if(options.invite){if(typeof options.invite!=='string'||!/^[a-f0-9]{48}$/.test(options.invite))fail('Convite inválido.',404);r=rooms.get(options.invite);if(!r||r.closed)fail('Este convite expirou.',404);if(r.started||r.tokens.length>=2)fail('Esta sala já está ocupada.');}
  else{const level=options.level||'easy';if(game==='keepup'&&!['easy','medium','hard'].includes(level))fail('Dificuldade inválida.',400);r={code:crypto.randomBytes(24).toString('hex'),tokens:[],level,started:false,closed:false,preferHost:options.preferHost===true,transport:'server',signals:[null,null],connected:[false,false],created:service.now()};rooms.set(r.code,r);}
  const token=crypto.randomBytes(24).toString('hex');service.sessions.set(token,{token,private:true,level:r.level,seen:service.now(),created:service.now(),room:null,seat:r.tokens.length});r.tokens.push(token);member.set(token,r.code);return {token,...service.state(token)};
 };
 service.state=function(t){const s=fresh(t),r=rooms.get(member.get(t));if(!r)return original.state(t);
  if(r.closed)return {phase:'over',reason:'A outra pessoa saiu da sala.',lobby:info(r,t),serverNow:service.now()};
  if(r.started&&r.transport==='connecting'&&service.now()-r.startedAt>10000)r.transport='server';
  if(!r.started||r.transport==='connecting'||r.transport==='direct')return {phase:!r.started?'lobby':r.transport==='direct'?'direct':'connecting',you:s.seat,lobby:info(r,t),signal:r.signals[1-s.seat],serverNow:service.now()};
  return {...original.state(t),lobby:info(r,t)};
 };
 service.action=function(t,b){
  if(!String(b.kind).startsWith('room-')){const r=rooms.get(member.get(t));if(r&&(!r.started||r.closed||r.transport!=='server'))fail('A sala ainda não está pronta.');return original.action(t,b);}
  const r=find(t),s=fresh(t);if(r.closed)fail('A sala foi encerrada.');
  if(b.kind==='room-start'){if(r.tokens[0]!==t)fail('Somente o anfitrião pode começar.',403);if(r.started) return service.state(t);if(r.tokens.length!==2||!r.tokens.every(k=>service.sessions.has(k)))fail('Aguarde seu amigo entrar.');service.makeRoom(r.tokens);r.started=true;r.startedAt=service.now();r.transport=r.preferHost?'connecting':'server';}
  else if(b.kind==='room-signal'){if(r.transport!=='connecting')return service.state(t);const v=b.signal,expected=s.seat===0?'offer':'answer';if(!v||v.type!==expected||typeof v.sdp!=='string'||v.sdp.length>24000)fail('Sinal inválido.',400);r.signals[s.seat]={type:v.type,sdp:v.sdp};}
  else if(b.kind==='room-connected'){if(r.transport==='connecting'){r.connected[s.seat]=true;if(r.connected.every(Boolean))r.transport='direct';}}
  else if(b.kind==='room-fallback'){if(r.transport==='connecting')r.transport='server';}
  else fail('Ação inválida.',400);
  return service.state(t);
 };
 service.leave=function(t){const code=member.get(t),r=rooms.get(code);if(r){r.closed=true;member.delete(t);}original.leave(t);};
 service.sweep=function(){original.sweep();for(const [code,r] of rooms)if(r.tokens.every(t=>!service.sessions.has(t))||service.now()-r.created>3600000){rooms.delete(code);r.tokens.forEach(t=>member.delete(t));}};
 return service;
}
module.exports={withPrivateRooms};

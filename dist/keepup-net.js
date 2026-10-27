(function(root){
'use strict';
const Core=typeof module!=='undefined'?require('./keepup-core.js'):root.KeepUpCore;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Visual prediction only. The server remains responsible for hits, pops and score.
class Presentation{
 constructor(){this.reset();}
 reset(){this.snapshot=null;this.received=0;this.local=null;this.target=null;this.positions=new Map();this.seat=0;this.rtt=0;}
 accept(state,seat,now,rtt=0){this.snapshot=state;this.seat=seat;this.received=now;this.rtt=clamp(rtt,0,200);const p=state.players?.[seat];if(p){this.target={...p,x:clamp(p.x+p.vx*this.rtt/2000,112,1488)};if(!this.local||state.over)this.local={...this.target};}const alive=new Set(state.balloons.map(b=>'b'+b.id));for(const key of this.positions.keys())if(key.startsWith('b')&&!alive.has(key))this.positions.delete(key);}
 frame(dt,direction,now){const s=this.snapshot;if(!s)return null;dt=clamp(dt,0,.05);const age=Math.max(0,(now-this.received)/1000),fresh=age<.35&&!s.over&&!s.paused;
 if(this.local&&fresh){let remaining=dt;while(remaining>1e-6){const step=Math.min(remaining,1/120);Core.movePlayer(this.local,step,direction);Core.movePlayer(this.target,step,direction);remaining-=step;}const error=this.target.x-this.local.x;this.local.x=Math.abs(error)>180?this.target.x:this.local.x+error*(1-Math.exp(-8*dt));}
 const ahead=s.over||s.paused?0:Math.min(.10,age+this.rtt/2000),alpha=1-Math.exp(-22*dt);
 const position=(key,p,isPlayer=false)=>{const x=clamp(p.x+(p.vx||0)*ahead,isPlayer?112:p.r,isPlayer?1488:1600-p.r),y=isPlayer?p.y:clamp(p.y+p.vy*ahead,-80,Core.floor-p.r);let v=this.positions.get(key);if(!v||Math.hypot(v.x-x,v.y-y)>180||s.over)v={x,y};else{v={x:v.x+(x-v.x)*alpha,y:v.y+(y-v.y)*alpha};}this.positions.set(key,v);return {...p,...v};};
 return {...s,players:s.players?.map((p,i)=>i===this.seat&&this.local?{...this.local}:position('p'+i,p,true)),balloons:s.balloons.map(b=>position('b'+b.id,b)),stale:age>.7};
 }
}
const api={Presentation};root.KeepUpNet=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);

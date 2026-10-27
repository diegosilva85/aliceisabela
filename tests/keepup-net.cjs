const assert=require('node:assert/strict'),Core=require('../dist/keepup-core'),{Presentation}=require('../dist/keepup-net');
const state=Core.create('easy',()=>.5);state.players=[{...state.player,x:600},{...state.player,x:1000}];
const original=JSON.stringify(state),p=new Presentation();p.accept(state,0,1000,80);
let view=p.frame(1/60,1,1016);assert.ok(view.players[0].x>600,'local input moves before server reply');assert.equal(JSON.stringify(state),original,'prediction never changes authoritative physics');
for(let i=0;i<120;i++)view=p.frame(1/60,1,1100+i*16);
assert.equal(view.stale,true);const frozen=view.players[0].x;view=p.frame(.05,1,4000);assert.equal(view.players[0].x,frozen,'prediction freezes during loss');
const updated=structuredClone(state);updated.players[0].x=1200;p.accept(updated,0,4000,90);view=p.frame(1/60,0,4016);assert.ok(Math.abs(view.players[0].x-1200)<1,'large desync reconciles');
updated.paused=true;p.accept(updated,0,4050);view=p.frame(.05,1,4060);const pausedX=view.players[0].x;assert.equal(p.frame(.05,1,4070).players[0].x,pausedX);
updated.balloons=[];p.accept(updated,0,4080);assert.equal(p.frame(.016,0,4090).balloons.length,0);
p.reset();assert.equal(p.frame(.016,0,4100),null);
// Motion prediction stays in bounds regardless of render frequency.
for(const fps of [30,60,120]){const q=new Presentation();q.accept(state,0,0);for(let n=0;n<fps*3;n++){const t=n*1000/fps;if(n%Math.ceil(fps/10)===0)q.accept({...state,players:[{...state.players[0],x:112},state.players[1]]},0,t);const v=q.frame(1/fps,-1,t);assert.ok(v.players[0].x>=112&&v.players[0].x<=1488);}}
console.log('Bluey network: immediate prediction, immutable authority, stalled connection, reconciliation, pause, cleanup and frame rates OK');

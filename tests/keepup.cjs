const assert=require('node:assert/strict'),C=require('../dist/keepup-core');
for(const [level,interval] of Object.entries(C.intervals)){let s=C.create(level,()=>.5);assert.equal(s.balloons.length,1);for(let i=0;i<interval*120+2;i++){s.balloons=[];C.step(s,1/120,0,()=>.5);}assert.equal(s.next,2);assert.equal(s.nextSpawn,interval*2);}
function bounce(v){let s=C.create('easy');s.player.vx=v;s.balloons=[{x:800,y:613,vx:0,vy:80,r:43,cool:0}];C.step(s,1/120,v?1:0);assert.equal(s.hits,1);assert.ok(s.balloons[0].vy<0);return s.balloons[0];}
assert.ok(bounce(500).vx>bounce(0).vx+200);
let s=C.create('hard');s.balloons=[{x:300,y:850,vx:0,vy:100,r:43,cool:0}];C.step(s,1/120,0);assert.ok(s.over);let t=s.elapsed;C.step(s,1,0);assert.equal(s.elapsed,t);
s=C.create('easy');s.balloons=[];for(let i=0;i<600;i++)C.step(s,1/120,-1);assert.equal(s.player.x,112);assert.equal(s.player.face,-1);
s=C.create('easy');s.balloons=[{x:42,y:250,vx:-80,vy:0,r:43,cool:0}];C.step(s,1/120,0);assert.ok(s.balloons[0].vx>0);
console.log('KeepUp: all spawn intervals, momentum bounce, walls, player limits, floor and game over OK');

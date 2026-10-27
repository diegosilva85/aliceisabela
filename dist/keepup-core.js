(function(root){
const W=1600,H=900,floor=868,intervals={easy:10,medium:8,hard:6};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function spawn(s,random=Math.random){s.balloons.push({id:s.next++,x:90+random()*(W-180),y:-60,vx:(random()-.5)*70,vy:42,r:43,color:Math.min(7,Math.floor(random()*8)),cool:0});}
function create(level,random=Math.random){const s={level,elapsed:0,nextSpawn:intervals[level]||10,player:{x:800,y:690,vx:0,face:1,stride:0},balloons:[],next:0,hits:0,misses:0,bursts:[],over:false};spawn(s,random);return s;}
function contact(b,p){
 // Rounded upper body and raised-hand area; excludes transparent sprite margins.
 const boxes=[{x:p.x-69,y:655,w:143,h:192},{x:p.x+(p.face>0?44:-114),y:700,w:70,h:107}];
 for(const box of boxes){const x=clamp(b.x,box.x,box.x+box.w),y=clamp(b.y,box.y,box.y+box.h);if((b.x-x)**2+(b.y-y)**2<=b.r*b.r)return {x,y};}return null;
}
// Shared by authoritative simulation and visual prediction; no predicted collisions.
function movePlayer(p,dt,dir){const target=dir*540;p.vx+=(target-p.vx)*Math.min(1,dt*(dir?9:14));if(dir)p.face=dir;p.x=clamp(p.x+p.vx*dt,112,W-112);if(p.x===112||p.x===W-112)p.vx=0;p.stride+=Math.abs(p.vx)*dt;}
function step(s,dt,direction,random=Math.random){if(s.over)return;s.elapsed+=dt;for(const [index,p] of (s.players||[s.player]).entries())movePlayer(p,dt,Array.isArray(direction)?direction[index]:direction);
 while(s.elapsed>=s.nextSpawn){spawn(s,random);s.nextSpawn+=intervals[s.level]||10;}
 for(const b of s.balloons){b.cool=Math.max(0,b.cool-dt);b.vy=Math.min(140,b.vy+80*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.exp(-.16*dt);
 if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.85;}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*.85;}
 if(b.y<b.r&&b.vy<0){b.y=b.r;b.vy=Math.abs(b.vy)*.25;}
 for(const p of (s.players||[s.player])){const hit=contact(b,p);if(hit&&b.cool===0&&b.vy>0){const angle=clamp((b.x-p.x)/110,-1,1);b.vx=clamp(angle*155+p.vx*.65,-430,430);b.vy=-275-Math.abs(p.vx)*.12;b.y=Math.min(b.y,hit.y-b.r-2);b.cool=.3;s.hits++;}}
 if(b.y+b.r>=floor){b.popped=true;s.misses++;s.bursts.push({x:b.x,y:floor-b.r,color:b.color,age:0});if(s.misses===3){s.over=true;break;}}
 }s.balloons=s.balloons.filter(b=>!b.popped);}
function animate(s,dt){for(const b of s.bursts)b.age+=dt;s.bursts=s.bursts.filter(b=>b.age<.55);}
const api={W,H,floor,intervals,create,step,movePlayer,spawn,contact,animate};root.KeepUpCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

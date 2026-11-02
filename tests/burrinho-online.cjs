const assert=require('node:assert/strict'),{BurrinhoMatchmaking}=require('../server/burrinho-matchmaking.cjs'),{withPrivateRooms}=require('../server/private-rooms.cjs'),C=require('../dist/burrinho-core'),layout=require('../dist/burrinho-layout');
let now=1000;const m=withPrivateRooms(new BurrinhoMatchmaking({now:()=>now}),'burrinho');
const host=m.join({private:true,preferHost:true,lanOnly:true});assert.equal(host.lobby.preferHost,false);const a=m.join(),b=m.join();assert.equal(a.phase,'waiting');assert.equal(b.phase,'playing');assert.equal(m.state(host.token).lobby.full,false);
const friend=m.join({invite:host.lobby.code});assert.throws(()=>m.join({invite:host.lobby.code}),/ocupada/);assert.throws(()=>m.action(friend.token,{kind:'room-start'}),/anfitrião/);m.action(host.token,{kind:'room-start'});assert.equal(m.state(host.token).lobby.transport,'server');
for(const pair of [[a.token,b.token],[host.token,friend.token]]){
 for(const token of pair)m.action(token,{kind:'heartbeat',active:true});
 let steps=0;
 while(steps++<200){const v=m.state(pair[0]);if(v.over)break;const token=pair[v.turn],s=m.state(token);assert.ok(s.hands[1-s.you].every(t=>t.hidden&&!('a'in t)));assert.equal(s.stock,undefined);const moves=C.moves(s,s.you),move=moves[0],body={kind:move?'play':s.stockCount?'draw':'pass',...move,generation:s.generation,revision:s.revision};const result=m.action(token,body);assert.ok(result.revision>s.revision);assert.throws(()=>m.action(token,body));}
 assert.ok(m.state(pair[0]).over);m.action(pair[0],{kind:'rematch',generation:0});m.action(pair[1],{kind:'rematch',generation:0});assert.equal(m.state(pair[0]).generation,1);assert.equal(m.state(pair[0]).phase,'playing');
 now+=6000;assert.equal(m.state(pair[0]).phase,'paused');assert.throws(()=>m.action(pair[0],{kind:'draw',generation:1,revision:m.state(pair[0]).revision}),/reconectar/);m.action(pair[0],{kind:'heartbeat',active:true});m.action(pair[1],{kind:'heartbeat',active:true});assert.equal(m.state(pair[0]).phase,'playing');
}
m.leave(friend.token);assert.equal(m.state(host.token).lobby.closed,true);
for(let n=1;n<=28;n++){const l=layout(n);assert.equal(l.tiles.length,n);for(const t of l.tiles){assert.ok(t.x+l.dx>=0&&t.y+l.dy>=0&&t.x+t.w+l.dx<=l.size&&t.y+t.h+l.dy<=l.size);}for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const a=l.tiles[i],b=l.tiles[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'no overlap');}for(let i=1;i<n;i++){const a=l.tiles[i-1],b=l.tiles[i];assert.ok((a.x+a.w===b.x||b.x+b.w===a.x)&&Math.min(a.y+a.h,b.y+b.h)>Math.max(a.y,b.y)||(a.y+a.h===b.y||b.y+b.h===a.y)&&Math.min(a.x+a.w,b.x+b.w)>Math.max(a.x,b.x),'continuous chain');}}
console.log('Burrinho: queue, private isolation, hidden hands, complete matches, replay, pause/reconnect and all 28 layouts OK');
// Optional fishing is authorized by the server even on an empty board (all tiles playable).
const qa=m.join(),qb=m.join(),v=m.state(qa.token),who=v.turn===0?qa.token:qb.token,ready=m.state(who);
assert.ok(C.moves(ready,ready.you).length);const drawn=m.action(who,{kind:'draw',generation:ready.generation,revision:ready.revision});assert.equal(drawn.hands[drawn.you].length,4);assert.equal(drawn.turn,ready.turn);
// Hit testing follows the actual endpoint halves, including vertical and reversed tiles.
for(let n=1;n<=28;n++){const l=layout(n),last=l.tiles.at(-1);assert.equal(layout.dropSide(n,l.dx+.5,l.dy+.5),'left');const x=last.x+l.dx+(last.w===2?(last.reverse?.5:1.5):.5),y=last.y+l.dy+(last.h===2?1.5:.5);assert.equal(layout.dropSide(n,x,y),'right');assert.equal(layout.dropSide(n,-10,-10),null);}
assert.equal(layout.dropSide(0,0,0),'right');console.log('Voluntary online draw and rotated endpoint hit testing OK');

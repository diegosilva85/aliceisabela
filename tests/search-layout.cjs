const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={console,home(){},showCatalog(){},fashion(){}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/search-game.js','utf8'),sandbox);
vm.runInContext(`
for(const level of Object.keys(searchLevels))for(const room of Object.keys(roomSpots))for(let run=0;run<15;run++){
 const pool=Array.from({length:searchLevels[level].total},(_,n)=>({id:'toy'+n}));
 for(const t of pool){const width=30,height=20+Math.floor(Math.random()*65),mask=new Uint8ClampedArray(width*height*4);for(let n=3;n<mask.length;n+=4)mask[n]=255;toySprites.set(t.id,{canvas:{width,height},ratio:width/height,mask})}
 const layout=makeSearchLayout(pool,level,room);
 if(layout.length!==searchLevels[level].total)throw Error('Wrong count');
 for(const i of layout){if(i.x-i.w/2<0||i.x+i.w/2>100||i.y-i.h<0||i.y>100)throw Error('Out of bounds '+room);if(!spriteContains(i,i.x,i.y-i.h/2))throw Error('Hit testing failed')}
 if(layout.filter(i=>visibleShare(i,layout)>=.12).length<searchLevels[level].goal)throw Error('Not enough discoverable targets');
}
`,sandbox);
console.log('225 layouts passed: counts, bounds, visible targets and alpha hit detection.');

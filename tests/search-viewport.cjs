const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/search-viewport.js','utf8').split('let searchViewportFrame')[0],ctx=vm.createContext({});vm.runInContext(source,ctx);
for(const [width,height] of [[1,1],[320,180],[390,700],[748,373],[748,275],[1450,900],[0,0]]){const s=vm.runInContext(`fitSearchRoomSize(${width},${height})`,ctx);assert.ok(s.width<=width&&s.height<=height);assert.ok(s.width>=0&&s.height>=0);if(s.width>5)assert.ok(Math.abs(s.height-s.width*941/1672)<1)}
console.log('Room sizing fits all available cells, including reduced browser viewport heights.');

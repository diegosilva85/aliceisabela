const assert=require('node:assert/strict'),fs=require('node:fs');
const manifest=require('../dist/assets/pokemon-table/audio/sources.json');
let requests=0;const nodes=[];
class Context{
 constructor(){this.state='running';this.currentTime=0;this.destination={};}
 resume(){return Promise.resolve();}
 decodeAudioData(){return Promise.resolve({duration:4.69});}
 createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
 createBufferSource(){const n={connect(){},disconnect(){},start(){this.started=true;},stop(t){this.stopped=t??true;}};nodes.push(n);return n;}
}
global.window={AudioContext:Context};
global.fetch=async url=>{requests++;const b=fs.readFileSync('dist/'+url);assert.equal(b.toString('ascii',0,4),'RIFF');return {ok:true,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};};
require('../dist/pokemon-battle-audio');
(async()=>{
 const a=window.PokemonBattleAudio;a.unlock();await new Promise(setImmediate);
 assert.equal(requests,8);
 for(const type of Object.keys(manifest.mapping)){a.play(type);assert.ok(nodes.at(-1).started);assert.equal(nodes.at(-1).stopped,2);}
 a.stop();assert.ok(nodes.every(n=>n.stopped===true));
 const count=nodes.length;a.toggle();a.play('steel');assert.equal(nodes.length,count);
 a.toggle();a.play('dark');assert.equal(nodes.length,count+1);a.toggle();assert.equal(nodes.at(-1).stopped,true);
 a.unlock();await new Promise(setImmediate);assert.equal(requests,8);
 console.log('WAV assets, all nine types, preload cache, duration limit, stop and mute OK');
})().catch(e=>{console.error(e);process.exitCode=1;});

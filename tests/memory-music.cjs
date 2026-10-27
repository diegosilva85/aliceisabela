const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('dist/memory.js','utf8');
const code=s.slice(s.indexOf('let memoryMusicLoading='),s.indexOf("document.addEventListener('visibilitychange'"));
let starts=0,stops=0,resolveFetch,lastGain;
const ctx={memoryRound:{},memorySound:true,memoryRun:1,document:{hidden:false},window:{},fetch:()=>new Promise(r=>resolveFetch=r),memoryAudio:{resume:()=>Promise.resolve(),decodeAudioData:async()=>({duration:90}),createBufferSource:()=>({connect(){},disconnect(){},start(){starts++},stop(){stops++;this.onended?.()}}),createGain:()=>lastGain=({gain:{setTargetAtTime(value){this.value=value}},connect(){},disconnect(){}})}};
vm.createContext(ctx);vm.runInContext(code,ctx);vm.runInContext('memoryMusicActive=true',ctx);
(async()=>{
ctx.memoryRound=null;ctx.memoryMusicSync();ctx.memoryRun++;ctx.memoryMusicSync();resolveFetch({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});await new Promise(r=>setImmediate(r));assert.equal(starts,1,'No duplicate sources');
assert.equal(vm.runInContext('memoryMusicSource.loopEnd',ctx),90);
assert.equal(lastGain.gain.value,.3,'Fixed 30%');
Object.assign(ctx,{cancelAnimationFrame(){},clearTimeout(){},memoryFrame:0,memoryMismatch:0,memoryOwnFullscreen:false});
vm.runInContext(s.slice(s.indexOf('function memoryStop('),s.indexOf('function memoryFullScreen(')),ctx);
ctx.memoryStop(true,true);ctx.memoryMusicSync();await new Promise(r=>setImmediate(r));assert.equal(stops,0);assert.equal(starts,1,'Same source across rounds');
ctx.memoryStop(false,true);ctx.memoryMusicSync();await new Promise(r=>setImmediate(r));assert.equal(starts,1,'Same source on theme screen');



ctx.memorySound=false;ctx.memoryMusicSync();assert.equal(stops,1);
ctx.memorySound=true;ctx.memoryMusicSync();await new Promise(r=>setImmediate(r));assert.equal(starts,2);
ctx.document.hidden=true;ctx.memoryMusicSync();assert.equal(stops,2);
ctx.memoryStop();ctx.document.hidden=false;ctx.memoryMusicSync();await new Promise(r=>setImmediate(r));assert.equal(starts,2);
console.log('Memory music: loop, single source, mute, background and exit OK');
})().catch(e=>{console.error(e);process.exitCode=1});

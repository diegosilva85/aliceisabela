const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('dist/memory.js','utf8');
const code=s.slice(s.indexOf('let memoryMusicLoading='),s.indexOf("document.addEventListener('visibilitychange'"));
let starts=0,stops=0,resolveFetch;
const ctx={memoryRound:{},memorySound:true,memoryRun:1,document:{hidden:false},window:{},fetch:()=>new Promise(r=>resolveFetch=r),memoryAudio:{resume:()=>Promise.resolve(),decodeAudioData:async()=>({duration:90}),createBufferSource:()=>({connect(){},disconnect(){},start(){starts++},stop(){stops++;this.onended?.()}}),createGain:()=>({gain:{setTargetAtTime(value){this.value=value}},connect(){},disconnect(){}})}};
vm.createContext(ctx);vm.runInContext(code,ctx);
(async()=>{
ctx.memoryMusicSync();ctx.memoryMusicSync();resolveFetch({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});await new Promise(r=>setImmediate(r));assert.equal(starts,1,'No duplicate sources');
assert.equal(vm.runInContext('memoryMusicSource.loopEnd',ctx),90);


ctx.memorySound=false;ctx.memoryMusicSync();assert.equal(stops,1);
ctx.memorySound=true;ctx.memoryMusicSync();await new Promise(r=>setImmediate(r));assert.equal(starts,2);
ctx.document.hidden=true;ctx.memoryMusicSync();assert.equal(stops,2);
ctx.memoryRound=null;ctx.document.hidden=false;ctx.memoryMusicSync();await new Promise(r=>setImmediate(r));assert.equal(starts,2);
console.log('Memory music: loop, single source, mute, background and exit OK');
})().catch(e=>{console.error(e);process.exitCode=1});

const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('dist/pet.js','utf8');
const code=s.slice(s.indexOf('let musicBuffer='),s.indexOf('let lastBreed='));
let starts=0,stops=0,resolveFetch;
const ctx={state:{},soundOn:true,run:1,document:{hidden:false},window:{},fetch:()=>new Promise(r=>resolveFetch=r),audio:{resume:()=>Promise.resolve(),decodeAudioData:async()=>({duration:60}),createBufferSource:()=>({connect(){},disconnect(){},start(){starts++},stop(){stops++;this.onended?.()}}),createGain:()=>({gain:{},connect(){},disconnect(){}})}};
vm.createContext(ctx);vm.runInContext(code,ctx);
(async()=>{
ctx.syncMusic();ctx.syncMusic();resolveFetch({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});await new Promise(r=>setImmediate(r));assert.equal(starts,1,'No duplicate sources');
assert.equal(vm.runInContext('musicSource.loopEnd',ctx),60);
ctx.soundOn=false;ctx.syncMusic();assert.equal(stops,1);
ctx.soundOn=true;ctx.syncMusic();await new Promise(r=>setImmediate(r));assert.equal(starts,2);
ctx.document.hidden=true;ctx.syncMusic();assert.equal(stops,2);
ctx.state=null;ctx.document.hidden=false;ctx.syncMusic();await new Promise(r=>setImmediate(r));assert.equal(starts,2);
console.log('Pet Shop music: loop, single source, mute, background and exit OK');
})().catch(e=>{console.error(e);process.exitCode=1});

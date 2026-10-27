const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('dist/keepup.js','utf8');let created=0,plays=0,pauses=0;
const ctx={document:{hidden:false},Audio:class{constructor(){created++}play(){plays++;return Promise.resolve()}pause(){pauses++}}};vm.createContext(ctx);vm.runInContext(s.slice(s.indexOf('let music='),s.indexOf('function musicButton')),ctx);
vm.runInContext('musicActive=true;musicSync();musicSync()',ctx);assert.equal(created,1);assert.equal(vm.runInContext('music.volume',ctx),.25);assert.equal(vm.runInContext('music.loop',ctx),true);
vm.runInContext('musicEnabled=false;musicSync()',ctx);assert.equal(pauses,1);let n=plays;vm.runInContext('musicEnabled=true;musicActive=false;musicSync()',ctx);assert.equal(plays,n);
ctx.document.hidden=true;vm.runInContext('musicActive=true;musicSync()',ctx);assert.equal(plays,n);ctx.document.hidden=false;vm.runInContext('musicSync()',ctx);assert.equal(plays,n+1);
console.log('KeepUp music: single audio, volume, loop, mute, exit and hidden tab OK');

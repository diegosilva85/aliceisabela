const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../dist/keepup-core');
const source=fs.readFileSync('dist/keepup.js','utf8');let pops=0;
const ctx={state:C.create('easy'),KeepUpCore:C,popSound(){pops++}};vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function stepWithSound('),source.indexOf('const keys=')),ctx);
const fallen=()=>({x:300,y:850,vx:0,vy:100,r:43,cool:0,color:2});
ctx.state.balloons=[fallen(),fallen()];ctx.stepWithSound(1/120,0);assert.equal(pops,2);ctx.stepWithSound(1/120,0);assert.equal(pops,2,'No repeated sound for removed balloons');
ctx.state.balloons=[fallen()];ctx.stepWithSound(1/120,0);assert.equal(pops,3,'Third pop audible');assert.ok(ctx.state.over);ctx.stepWithSound(1/120,0);assert.equal(pops,3);
console.log('KeepUp pop: one sound per burst, simultaneous bursts and final burst OK');

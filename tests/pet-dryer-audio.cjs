const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('dist/pet.js','utf8');
let starts=0,stops=0;
const ctx={state:{ready:true,stage:'dry'},held:true,tool:'dryer',active:0,soundOn:true,document:{hidden:false},audio:{createBufferSource:()=>({connect(){},disconnect(){},start(){starts++},stop(){stops++;this.onended()}}),createGain:()=>({gain:{},connect(){},disconnect(){}})}};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('let dryerBuffer='),source.indexOf('let lastBreed=')),ctx);
vm.runInContext('dryerBuffer={};',ctx);
ctx.syncDryer();ctx.syncDryer();assert.equal(starts,1);
ctx.held=false;ctx.syncDryer();assert.equal(stops,1);
ctx.held=true;ctx.state.stage='dry';ctx.syncDryer();assert.equal(starts,2);
for(const [obj,key,value] of [[ctx,'tool','soap'],[ctx,'active',-1],[ctx,'soundOn',false],[ctx.document,'hidden',true],[ctx.state,'arched',true],[ctx.state,'feeding',true],[ctx.state,'stage','soap']]){
 const old=obj[key];obj[key]=value;ctx.syncDryer();assert.equal(starts,stops);obj[key]=old;ctx.syncDryer();assert.equal(starts,stops+1);
}
ctx.state=null;ctx.syncDryer();assert.equal(starts,stops);
assert.match(source,/function release\(\)\{stopShower\(\);stopDryer\(\)/);
console.log('Dryer sound: loop, no duplicates, release, rinse, mute, hidden, anger, tools and exit OK');

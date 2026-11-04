const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('dist/pet.js','utf8');
let starts=0,stops=0;
const ctx={state:{ready:true,stage:'rinse'},held:true,tool:'shower',active:0,soundOn:true,document:{hidden:false},audio:{createBufferSource:()=>({connect(){},disconnect(){},start(){starts++},stop(){stops++;this.onended()}}),createGain:()=>({gain:{},connect(){},disconnect(){}})}};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('let showerBuffer='),source.indexOf('let lastBreed=')),ctx);
vm.runInContext('showerBuffer={};',ctx);
ctx.syncShower();ctx.syncShower();assert.equal(starts,1);
ctx.held=false;ctx.syncShower();assert.equal(stops,1);
ctx.held=true;ctx.state.stage='rinseSoap';ctx.syncShower();assert.equal(starts,2);
for(const [obj,key,value] of [[ctx,'tool','soap'],[ctx,'active',-1],[ctx,'soundOn',false],[ctx.document,'hidden',true],[ctx.state,'arched',true],[ctx.state,'feeding',true],[ctx.state,'stage','dry']]){
 const old=obj[key];obj[key]=value;ctx.syncShower();assert.equal(starts,stops);obj[key]=old;ctx.syncShower();assert.equal(starts,stops+1);
}
ctx.state=null;ctx.syncShower();assert.equal(starts,stops);
assert.match(source,/function release\(\)\{stopShower\(\)/);
console.log('Shower sound: loop, no duplicates, release, rinse, mute, hidden, anger, tools and exit OK');

const assert=require('node:assert/strict'),fs=require('node:fs');
global.window={};require('../dist/pokemon-attacks-data');
for(const [type,count] of Object.entries({fire:3,water:3,electric:3,fighting:3,grass:6,psychic:6,dark:3})){
 const a=window.PokemonAttacksData[type];assert.equal(a.frames.length,count);for(const path of a.frames)assert.ok(fs.existsSync('dist/'+path));
}
let next=null;global.requestAnimationFrame=fn=>(next=fn,1);global.cancelAnimationFrame=()=>{next=null;};
global.Image=class{decode(){return Promise.resolve();}};require('../dist/pokemon-attacks');
(async()=>{let done=0;const img={};const stop=window.PokemonAttacks.play(img,'fire',{loops:1,onEnd:()=>done++});await new Promise(r=>setImmediate(r));next(0);assert.match(img.src,/fire-v2-01/);next(130);assert.match(img.src,/fire-v2-02/);next(260);assert.match(img.src,/fire-v2-03/);next(390);assert.equal(done,1);stop();assert.equal(next,null);console.log('Attack assets, frame order, completion and cancellation OK');})().catch(e=>{console.error(e);process.exitCode=1;});

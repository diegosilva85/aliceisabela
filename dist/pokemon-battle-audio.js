window.PokemonBattleAudio=(()=>{
 'use strict';
 const files={fire:'FireBlast2.wav',water:'Bubblebeam1.wav',electric:'ThunderShock.wav',grass:'RazorLeaf.wav',fighting:'DoubleKick.wav',normal:'DoubleKick.wav',psychic:'Psychic.wav',steel:'Sonicboom.wav',dark:'Swift2.wav'};
 const hits={25:'IMHIT_Damage.wav',12:'IMHITWEAK_Not_Very_Effective.wav',50:'IMHITSUPER_Super_Effective.wav'};
 const buffers=new Map(),pending=new Map(),active=new Set();
 let ctx,enabled=true;
 function load(file){
  if(buffers.has(file)||pending.has(file))return;
  const job=fetch('assets/pokemon-table/audio/'+file).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.arrayBuffer();}).then(data=>ctx.decodeAudioData(data)).then(buffer=>buffers.set(file,buffer)).catch(e=>console.warn('Não foi possível carregar '+file,e)).finally(()=>pending.delete(file));
  pending.set(file,job);
 }
 function unlock(){try{ctx??=new (window.AudioContext||window.webkitAudioContext)();ctx.resume().catch(()=>{});for(const file of new Set([...Object.values(files),...Object.values(hits)]))load(file);}catch{}}
 function stop(){for(const node of active){try{node.stop();}catch{}}active.clear();}
 function playFile(file,limit){
  stop();
  if(!enabled||!ctx||ctx.state!=='running')return;
  const buffer=buffers.get(file);if(!buffer){load(file);return;}
  const t=ctx.currentTime,g=ctx.createGain(),node=ctx.createBufferSource(),d=Math.min(buffer.duration,limit);
  node.buffer=buffer;g.gain.setValueAtTime(.3,t);g.gain.setValueAtTime(.3,t+Math.max(0,d-.04));g.gain.linearRampToValueAtTime(0,t+d);
  node.connect(g);g.connect(ctx.destination);active.add(node);node.onended=()=>{active.delete(node);node.disconnect();g.disconnect();};node.start(t);node.stop(t+d);
 }
 function play(type){playFile(files[type]||files.normal,2);}
 function impact(damage){playFile(hits[damage]||hits[25],1.2);}
 return {unlock,play,impact,stop,toggle(){enabled=!enabled;if(!enabled)stop();return enabled;},get enabled(){return enabled;}};
})();

window.PokemonBattleAudio=(()=>{
 'use strict';
 const files={fire:'FireBlast2.wav',water:'Bubblebeam1.wav',electric:'ThunderShock.wav',grass:'RazorLeaf.wav',fighting:'DoubleKick.wav',normal:'DoubleKick.wav',psychic:'Psychic.wav',steel:'Sonicboom.wav',dark:'Swift2.wav'};
 const buffers=new Map(),pending=new Map(),active=new Set();
 let ctx,enabled=true;
 function load(file){
  if(buffers.has(file)||pending.has(file))return;
  const job=fetch('assets/pokemon-table/audio/'+file).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.arrayBuffer();}).then(data=>ctx.decodeAudioData(data)).then(buffer=>buffers.set(file,buffer)).catch(e=>console.warn('Não foi possível carregar '+file,e)).finally(()=>pending.delete(file));
  pending.set(file,job);
 }
 function unlock(){try{ctx??=new (window.AudioContext||window.webkitAudioContext)();ctx.resume().catch(()=>{});for(const file of new Set(Object.values(files)))load(file);}catch{}}
 function stop(){for(const node of active){try{node.stop();}catch{}}active.clear();}
 function play(type,hit=false){
  if(!enabled||!ctx||ctx.state!=='running')return;
  const t=ctx.currentTime,g=ctx.createGain();let node,d;
  if(hit){
   // A short, quiet impact accompanies the health-bar change, without replaying the attack.
   d=.12;node=ctx.createOscillator();node.frequency.setValueAtTime(130,t);node.frequency.exponentialRampToValueAtTime(45,t+d);g.gain.setValueAtTime(.045,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  }else{
   const buffer=buffers.get(files[type]);if(!buffer){load(files[type]||files.normal);return;}
   node=ctx.createBufferSource();node.buffer=buffer;d=Math.min(buffer.duration,2);
   g.gain.setValueAtTime(.3,t);g.gain.setValueAtTime(.3,t+Math.max(0,d-.08));g.gain.linearRampToValueAtTime(0,t+d);
  }
  node.connect(g);g.connect(ctx.destination);active.add(node);node.onended=()=>{active.delete(node);node.disconnect();g.disconnect();};node.start(t);node.stop(t+d);
 }
 return {unlock,play,stop,toggle(){enabled=!enabled;if(!enabled)stop();return enabled;},get enabled(){return enabled;}};
})();

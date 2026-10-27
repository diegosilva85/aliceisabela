/* Shared frame player. Returns a cancellation function for scene cleanup. */
window.PokemonAttacks={play(image,type,{loops=3,onEnd=()=>{}}={}){
 const asset=window.PokemonAttacksData[type];if(!asset)return ()=>{};
 let cancelled=false,raf=0,start=null;
 const frames=asset.frames.map(src=>{const i=new Image();i.src=src;return i;});
 const stop=()=>{cancelled=true;cancelAnimationFrame(raf);};
 Promise.all(frames.map(i=>i.decode())).then(()=>{
  if(cancelled)return;
  function tick(t){if(cancelled)return;if(start===null)start=t;
   const step=Math.floor((t-start)/asset.frameMs);
   if(step>=asset.frames.length*loops){image.src=asset.frames.at(-1);onEnd();return;}
   image.src=asset.frames[step%asset.frames.length];raf=requestAnimationFrame(tick);
  }raf=requestAnimationFrame(tick);
 }).catch(()=>{if(!cancelled){image.alt='Não foi possível carregar o efeito';onEnd();}});
 return stop;
}};

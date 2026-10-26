(function(root){
  const stages=['rinse','soap','rinseSoap','dry','done'];
  const durations={rinse:2500,soap:1500,rinseSoap:1500,dry:1500};
  const expected={rinse:'shower',soap:'soap',rinseSoap:'shower',dry:'dryer'};
  function create(random=Math.random,previousBreed=null){
    const breeds=[0,1,2,3,4,5];
    const choices=breeds.includes(previousBreed)?breeds.filter(b=>isDog(b)!==isDog(previousBreed)):breeds;
    return {breed:choices[Math.floor(random()*choices.length)],mood:random()<.5?'sad':'angry',arched:false,stage:'rinse',progress:Array(9).fill(0),feeding:false};
  }
  function isDog(breed){return breed===4||breed===5;}
  function treatFile(breed,bite='inteiro'){return 'biscoito-'+(isDog(breed)?'cachorro-':'')+bite+'-v1.webp';}
  function touch(s,tool,index,ms){
    if(s.feeding||s.stage==='done'||index<0||index>8)return 'ignored';
    if(s.mood==='angry'){if(tool==='shower'){s.arched=true;return 'angry';}return 'ignored';}
    if(tool!==expected[s.stage]||s.progress[index]>=1)return 'ignored';
    s.progress[index]=Math.min(1,s.progress[index]+Math.max(0,ms)/durations[s.stage]);
    if(s.progress[index]<1)return 'working';
    if(s.progress.every(p=>p>=1)){s.stage=stages[stages.indexOf(s.stage)+1];s.progress=Array(9).fill(0);return s.stage==='done'?'finished':'stage';}
    return 'region';
  }
  function calm(s){s.mood='calm';s.arched=false;s.feeding=false;}
  function isWet(s){return s.stage!=='done'&&(s.stage!=='rinse'||s.progress.filter(p=>p>=1).length>=5);}
  function elapsedForTool(tool,elapsed,circularCredit){return tool==='soap'?circularCredit:Math.min(100,Math.max(0,elapsed));}
  function offsetPoint(x,y,portrait,mobile,distance=90){
    if(!mobile)return {x,y};
    return portrait?{x,y:y+distance}:{x:x+distance,y};
  }
  // Normalize coordinates to the region size, so small touch screens use the same gesture.
  function motion(){return {points:[],zone:-1};}
  function movement(m,x,y,time,zone){
    if(zone<0||m.zone!==zone){m.points=[];m.zone=zone;}
    if(zone<0)return 0;
    const last=m.points.at(-1);
    m.points=[{x,y,t:time}];
    if(!last||time-last.t>180)return 0;
    return Math.hypot(x-last.x,y-last.y)>=.015?Math.min(80,time-last.t):0;
  }
  const api={create,touch,calm,durations,expected,motion,movement,circle:movement,isWet,elapsedForTool,offsetPoint,isDog,treatFile};root.PetCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

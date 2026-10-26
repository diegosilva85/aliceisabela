(function(root){
  const stages=['rinse','soap','rinseSoap','dry','done'];
  const durations={rinse:2500,soap:1500,rinseSoap:1500,dry:1500};
  const expected={rinse:'shower',soap:'soap',rinseSoap:'shower',dry:'dryer'};
  function create(random=Math.random){return {breed:Math.floor(random()*4),mood:random()<.5?'sad':'angry',arched:false,stage:'rinse',progress:Array(9).fill(0),feeding:false};}
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
  // Normalize coordinates to the region size, so small touch screens use the same gesture.
  function motion(){return {points:[],zone:-1};}
  function circle(m,x,y,time,zone){
    if(zone<0||m.zone!==zone){m.points=[];m.zone=zone;}
    if(zone<0)return 0;
    const prev=m.points.at(-1);
    if(prev&&time-prev.t>180)m.points=[];
    const last=m.points.at(-1);
    if(last&&Math.hypot(x-last.x,y-last.y)<.025)return 0;
    m.points.push({x,y,t:time});m.points=m.points.filter(p=>time-p.t<650);
    if(m.points.length<4)return 0;
    let turn=0,total=0,distance=0;
    for(let i=1;i<m.points.length;i++){
      const a=m.points[i-1],b=m.points[i];distance+=Math.hypot(b.x-a.x,b.y-a.y);
      if(i<2)continue;
      const c=m.points[i-2],u=Math.atan2(a.y-c.y,a.x-c.x),v=Math.atan2(b.y-a.y,b.x-a.x);
      const angle=Math.atan2(Math.sin(v-u),Math.cos(v-u));
      if(Math.abs(angle)>1.3){m.points=m.points.slice(-2);return 0;}
      turn+=angle;total+=Math.abs(angle);
    }
    return Math.abs(turn)>.65&&Math.abs(turn)>total*.7&&distance>.2?Math.min(80,time-last.t):0;
  }
  const api={create,touch,calm,durations,expected,motion,circle,isWet,elapsedForTool};root.PetCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

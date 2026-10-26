(function(root){
  const stages=['rinse','soap','rinseSoap','dry','done'];
  const durations={rinse:4000,soap:3000,rinseSoap:3000,dry:3000};
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
  const api={create,touch,calm,durations,expected};root.PetCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

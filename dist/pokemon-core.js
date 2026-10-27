(function(root){
'use strict';
const types=['fire','water','grass','electric','fighting','psychic','dark','normal','steel'];
// Simplified single-type house chart: neutral=25, advantage=50, resistance=12.
const strong={fire:['grass','steel'],water:['fire'],grass:['water'],electric:['water'],fighting:['normal','dark','steel'],psychic:['fighting'],dark:['psychic'],normal:[],steel:['psychic']};
const weak={fire:['fire','water'],water:['water','grass'],grass:['fire','grass','steel'],electric:['electric','grass'],fighting:['psychic'],psychic:['psychic','dark','steel'],dark:['fighting','dark'],normal:['steel'],steel:['fire','water','electric','steel']};
const CHOOSE_MS=5000,RESULT_MS=7200;
function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function damage(a,b){if(!types.includes(a)||!types.includes(b))throw Error('Tipo desconhecido');return strong[a].includes(b)?50:weak[a].includes(b)?12:25;}
function deal(cards,rng=Math.random){
 if(new Set(cards.map(c=>c.id)).size!==cards.length)throw Error('Cartas duplicadas');
 const groups=Object.fromEntries(types.map(t=>[t,[]]));
 for(const c of cards){if(!types.includes(c.type))throw Error('Tipo desconhecido');groups[c.type].push(c);}
 if(types.some(t=>!groups[t].length))throw Error('Não há tipos suficientes: é necessária uma carta de cada tipo');
 const pool=types.map(t=>{const group=groups[t];return group.splice(Math.floor(rng()*group.length),1)[0];});
 const extraTypes=types.filter(t=>t!=='fighting'&&t!=='normal'&&groups[t].length);
 if(!extraTypes.length)throw Error('Não há carta extra disponível fora de Lutador e Normal');
 const extraType=extraTypes[Math.floor(rng()*extraTypes.length)],extraGroup=groups[extraType];
 pool.push(extraGroup[Math.floor(rng()*extraGroup.length)]);
 return shuffle(pool,rng).map(c=>({...c,hp:50}));
}
function create(cards,now=Date.now(),rng=Math.random){return {phase:'draft',pool:deal(cards,rng),hands:[[],[]],turn:0,picks:0,round:0,choices:[null,null],deadline:null,result:null,winner:null,revision:0};}
function available(s,p){return s.hands[p].filter(c=>c.hp>0);}
function standings(s){return s.hands.map(h=>({alive:h.filter(c=>c.hp>0).length,hp:h.reduce((n,c)=>n+Math.max(0,c.hp),0)}));}
function winner(s){const [a,b]=standings(s),diff=a.alive-b.alive||a.hp-b.hp;return diff===0?'draw':diff>0?0:1;}
function begin(s,now){s.phase='choose';s.round++;s.choices=[null,null];s.deadline=now+CHOOSE_MS;s.revision++;}
function draft(s,p,id,now=Date.now()){if(s.phase!=='draft'||p!==s.turn )return false;const i=s.pool.findIndex(c=>c.id===id);if(i<0)return false;s.hands[p].push(s.pool.splice(i,1)[0]);s.picks++;s.turn=1-p;s.deadline=null;s.revision++;if(!s.pool.length)begin(s,now);return true;}
function countdown(s,now){s.phase='countdown';s.result=null;s.deadline=now+3000;s.revision++;}
function resolve(s,now){const cards=s.choices.map((id,p)=>s.hands[p].find(c=>c.id===id));const before=cards.map(c=>({...c}));const hits=[damage(cards[0].type,cards[1].type),damage(cards[1].type,cards[0].type)];cards[0].hp=Math.max(0,cards[0].hp-hits[1]);cards[1].hp=Math.max(0,cards[1].hp-hits[0]);s.result={round:s.round,cards:before,damage:hits,hp:cards.map(c=>c.hp),at:now};s.phase='result';s.deadline=now+RESULT_MS;s.revision++;}
function choose(s,p,id,now=Date.now()){if(s.phase!=='choose'||s.choices[p]||now>=s.deadline||!available(s,p).some(c=>c.id===id))return false;s.choices[p]=id;s.revision++;if(s.choices.every(Boolean))countdown(s,now);return true;}
function tick(s,now=Date.now(),rng=Math.random){if(now<s.deadline||s.phase==='over')return false;if(s.phase==='draft')return false;if(s.phase==='countdown'){resolve(s,now);return true;}
 if(s.phase==='choose'){for(let p=0;p<2;p++)if(!s.choices[p]){const a=available(s,p);s.choices[p]=a[Math.floor(rng()*a.length)].id;}countdown(s,now);return true;}
 if(s.phase==='result'){const alive=[available(s,0).length,available(s,1).length];if(!alive[0]||!alive[1]||s.round>=7){s.phase='over';s.winner=winner(s);s.revision++;}else begin(s,now);return true;}return false;}
function view(s,p){return {...s,you:p,choices:s.choices.map((c,i)=>i===p?c:!!c),hands:s.hands.map(h=>h.map(c=>({...c})))};}
const api={standings,winner,types,strong,weak,CHOOSE_MS,RESULT_MS,shuffle,damage,deal,create,available,draft,choose,tick,view};root.PokemonTableCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);

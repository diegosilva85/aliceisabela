(function(root){
const types=['fire','grass','water','electric','normal'];
// House rules for five-type rock-paper-scissors, not the official TCG chart.
const beats={fire:['grass','normal'],grass:['water','electric'],water:['fire','electric'],electric:['fire','normal'],normal:['grass','water']};
function shuffle(cards,rng=Math.random){const a=[...cards];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(cards,rng=Math.random){if(cards.length<10||new Set(cards.map(c=>c.id)).size!==cards.length)throw Error('São necessários 10 Pokémon diferentes.');if(cards.some(c=>!types.includes(c.type)))throw Error('Tipo desconhecido');return {pool:shuffle(cards,rng).slice(0,10),player:[],cpu:[],used:[],rounds:[],phase:'draft',turn:'player',score:[0,0],cpuChoice:null};}
function draft(s,id){if(s.phase!=='draft'||s.turn!=='player')return false;const i=s.pool.findIndex(c=>c.id===id);if(i<0)return false;s.player.push(s.pool.splice(i,1)[0]);s.turn='cpu';return true;}
function cpuDraft(s,rng=Math.random){if(s.phase!=='draft'||s.turn!=='cpu')return false;s.cpu.push(s.pool.splice(Math.floor(rng()*s.pool.length),1)[0]);s.turn='player';if(!s.pool.length){s.phase='battle';prepare(s,rng);}return true;}
function prepare(s,rng=Math.random){if(s.phase==='battle')s.cpuChoice=s.cpu[Math.floor(rng()*s.cpu.length)].id;}
function play(s,id,rng=Math.random){if(s.phase!=='battle')return null;const i=s.player.findIndex(c=>c.id===id),j=s.cpu.findIndex(c=>c.id===s.cpuChoice);if(i<0||j<0)return null;const player=s.player.splice(i,1)[0],cpu=s.cpu.splice(j,1)[0],tie=player.type===cpu.type;const winner=tie?(rng()<.5?'player':'cpu'):(beats[player.type].includes(cpu.type)?'player':'cpu');const result={player,cpu,winner,tie};s.score[winner==='player'?0:1]++;s.rounds.push(result);s.used.push(player.id,cpu.id);s.cpuChoice=null;s.phase=s.rounds.length===5?'over':'result';return result;}
function next(s,rng=Math.random){if(s.phase!=='result')return false;s.phase='battle';prepare(s,rng);return true;}
const api={types,beats,create,draft,cpuDraft,play,next};root.PokemonTableCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);

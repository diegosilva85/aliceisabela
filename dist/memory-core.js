(function(root){
 function shuffle(list,random=Math.random){const copy=[...list];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
 function deckFor(images,pairs,random=Math.random){const unique=[...new Map(images.map(x=>[x.id,x])).values()];if(unique.length<pairs)throw Error('Imagens insuficientes');return shuffle(shuffle(unique,random).slice(0,pairs).flatMap(image=>[0,1].map(copy=>({key:image.id+'-'+copy,image,matched:false}))),random)}
 function score(pairs,moves,elapsedMs){const seconds=Math.max(1,elapsedMs/1000);const movePoints=Math.round(10000*pairs/Math.max(pairs,moves));const timePoints=Math.round(100000/seconds);return {movePoints,timePoints,total:movePoints+timePoints,perfect:moves===pairs,seconds}}
 function createRound(deck){return {deck,open:[],moves:0,matches:0,locked:false,finished:false}}
 function reveal(round,index){const card=round.deck[index];if(!card||round.finished||round.locked||card.matched||round.open.includes(index))return {type:'ignored'};round.open.push(index);if(round.open.length===1)return {type:'first'};round.moves++;const [a,b]=round.open;if(round.deck[a].image.id===round.deck[b].image.id){round.deck[a].matched=round.deck[b].matched=true;round.matches++;round.open=[];round.finished=round.matches===round.deck.length/2;return {type:round.finished?'complete':'match',indices:[a,b]}}round.locked=true;return {type:'miss',indices:[a,b]}}
 function conceal(round){if(round.locked){round.open=[];round.locked=false}}
 const api={shuffle,deckFor,score,createRound,reveal,conceal};if(typeof module!=='undefined')module.exports=api;else root.MemoryCore=api;
})(typeof window!=='undefined'?window:this);

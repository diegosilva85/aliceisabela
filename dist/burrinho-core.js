(function(root){
'use strict';
function create(rng=Math.random){
 const deck=[];for(let a=0;a<7;a++)for(let b=a;b<7;b++)deck.push({id:a+'-'+b,a,b});
 for(let i=deck.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
 return {hands:[deck.splice(0,3),deck.splice(0,3)],stock:deck,board:[],turn:Math.floor(rng()*2),over:false,winner:null,passes:0};
}
function ends(s){return s.board.length?[s.board[0].a,s.board.at(-1).b]:[];}
function sides(s,t){if(!s.board.length)return ['right'];const [l,r]=ends(s);return [...(t.a===l||t.b===l?['left']:[]),...(t.a===r||t.b===r?['right']:[])];}
function moves(s,p=s.turn){return s.hands[p].flatMap(t=>sides(s,t).map(side=>({id:t.id,side})));}
function play(s,p,id,side){
 if(s.over||p!==s.turn)return false;const i=s.hands[p].findIndex(t=>t.id===id),t=s.hands[p][i];if(!t||!sides(s,t).includes(side))return false;
 let tile={...t};if(s.board.length){const [l,r]=ends(s);if(side==='left'&&tile.b!==l||side==='right'&&tile.a!==r)[tile.a,tile.b]=[tile.b,tile.a];}
 s.hands[p].splice(i,1);if(side==='left')s.board.unshift(tile);else s.board.push(tile);s.passes=0;
 if(!s.hands[p].length){s.over=true;s.winner=p;}else s.turn=1-p;return true;
}
function draw(s,p){if(s.over||p!==s.turn||moves(s,p).length||!s.stock.length)return false;s.hands[p].push(s.stock.pop());s.passes=0;return true;}
function pass(s,p){if(s.over||p!==s.turn||s.stock.length||moves(s,p).length)return false;s.passes++;if(s.passes===2){s.over=true;s.winner=null;}else s.turn=1-p;return true;}
const api={create,ends,sides,moves,play,draw,pass};if(typeof module!=='undefined')module.exports=api;else root.BurrinhoCore=api;
})(typeof window!=='undefined'?window:globalThis);

(function(root){
// Dominoes turn downward at each row end; adjoining character halves touch.
function layout(n){const k=Math.max(2,Math.ceil(Math.sqrt(n/1.5))),tiles=[];let row=0,col=0;for(let i=0;i<n;i++){const reverse=row%2===1;if(col<k){tiles.push({x:(reverse?k-1-col:col)*2,y:row*3,w:2,h:1,reverse});col++;}else{tiles.push({x:reverse?0:2*k-1,y:row*3+1,w:1,h:2,reverse:false});row++;col=0;}}const width=Math.max(2,...tiles.map(t=>t.x+t.w)),height=Math.max(1,...tiles.map(t=>t.y+t.h)),size=Math.max(width,height)+.6;return {tiles,size,dx:(size-width)/2,dy:(size-height)/2};}
layout.dropSide=function(n,x,y,padding=0){
 if(!n)return 'right';const l=layout(n),first=l.tiles[0],last=l.tiles.at(-1);
 const center=(r,end)=>({x:r.x+l.dx+(r.w===2?(r.reverse?1-end:end)+.5:.5),y:r.y+l.dy+(r.h===2?end+.5:.5)});
 const a=center(first,0),b=center(last,1),da=Math.hypot(x-a.x,y-a.y),db=Math.hypot(x-b.x,y-b.y);
 return Math.min(da,db)<=Math.max(.8,padding)?(da<=db?'left':'right'):null;
};
if(typeof module!=='undefined')module.exports=layout;else root.BurrinhoLayout=layout;
})(typeof window==='undefined'?globalThis:window);

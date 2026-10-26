(function(root){
const items=[
 {id:'laco-rosa',name:'Lacinho de pérola',type:'bow'},
 {id:'laco-lilas',name:'Lacinho estrela',type:'bow'},
 {id:'laco-azul',name:'Lacinho de bolinhas',type:'bow'},
 {id:'gravata-vermelha',name:'Gravatinha vermelha',type:'tie'},
 {id:'gravata-azul',name:'Gravatinha listrada',type:'tie'},
 {id:'gravata-verde',name:'Gravatinha xadrez',type:'tie'}
];
const fit=[{neck:[53.5,53],head:[29,79,13,23]},{neck:[53.5,53],head:[29,79,13,23]},{neck:[53.5,53.5],head:[29,79,13,23]},{neck:[53.5,53],head:[29,79,12,22]}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function placement(breed,type,x,y){const f=fit[breed]||fit[0];if(type==='tie'||y>34)return {slot:'neck',x:clamp(x,f.neck[0]-3,f.neck[0]+3),y:f.neck[1],width:type==='tie'?32:28,angle:0};return {slot:x<54?'headLeft':'headRight',x:clamp(x,f.head[0],f.head[1]),y:clamp(y,f.head[2],f.head[3]),width:26,angle:x<54?-12:12};}
let cleanup=()=>{};
function mount({breed,onNext,onPlace}){
 cleanup();const stage=document.querySelector('.pet-play'),cat=stage.querySelector('.pet-cat'),panel=stage.querySelector('.pet-tools'),base='assets/petshop/';
 let selected=items[0],placed={},drag=null;
 const abort=new AbortController(),listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
 stage.classList.add('pet-dressing');stage.querySelector('.pet-cursor').hidden=true;
 stage.querySelector('.pet-finish').hidden=true;stage.querySelector('.pet-regions').hidden=true;
 stage.querySelector('#pet-message').textContent='Um toque de charme!';
 stage.querySelector('#pet-count').textContent='Escolha e coloque no gatinho';
 stage.querySelector('.pet-steps').innerHTML='<span class="current">5 · Acessórios</span>';
 panel.classList.add('pet-accessory-panel');panel.setAttribute('aria-label','Acessórios');
 panel.innerHTML='<h2>Lacinhos e gravatinhas</h2><div class="pet-accessory-list">'+items.map(i=>'<button data-accessory="'+i.id+'" aria-label="'+i.name+'" aria-pressed="false"><img draggable="false" src="'+base+i.id+'-v1.webp" alt=""><span>'+i.name+'</span></button>').join('')+'</div><button class="pet-remove">Retirar acessórios</button><button class="pet-dress-next">Outro gatinho →</button>';
 const layer=document.createElement('div');layer.className='pet-accessory-layer';cat.append(layer);
 const zones=document.createElement('div');zones.className='pet-accessory-zones';zones.innerHTML='<button data-place="left" aria-label="Colocar lacinho à esquerda da cabeça"></button><button data-place="right" aria-label="Colocar lacinho à direita da cabeça"></button><button data-place="neck" aria-label="Colocar acessório no pescoço"></button>';cat.append(zones);
 const ghost=document.createElement('img');ghost.className='pet-accessory-ghost';ghost.hidden=true;stage.append(ghost);
 function choose(item){selected=item;panel.querySelectorAll('[data-accessory]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.accessory===item.id));zones.dataset.type=item.type;stage.querySelector('.pet-hint').textContent=item.type==='tie'?'Escolha a gravatinha e toque no pescoço. Também pode arrastar.':'Escolha o lacinho e toque na cabeça ou no pescoço. Também pode arrastar.';}
 function draw(){layer.innerHTML=Object.entries(placed).map(([slot,a])=>'<button data-worn="'+slot+'" aria-label="Mover '+a.item.name+'" style="left:'+a.x+'%;top:'+a.y+'%;width:'+a.width+'%;transform:translate(-50%,-50%) rotate('+a.angle+'deg)"><img draggable="false" src="'+base+a.item.id+'-v1.webp" alt=""></button>').join('');}
 function coordinates(e){const r=cat.getBoundingClientRect();return stage.classList.contains('pet-portrait')?{x:(e.clientY-r.top)/r.height*100,y:(r.right-e.clientX)/r.width*100}:{x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100};}
 function place(x,y,from){if(x<0||x>100||y<0||y>100)return false;const p=placement(breed,selected.type,x,y);if(from)delete placed[from];placed[p.slot]={...p,item:selected};draw();onPlace?.();return true;}
 listen(panel,'click',e=>{const button=e.target.closest('[data-accessory]');if(button)choose(items.find(i=>i.id===button.dataset.accessory));});
 listen(panel.querySelector('.pet-remove'),'click',()=>{placed={};draw();});
 listen(panel.querySelector('.pet-dress-next'),'click',onNext);
 listen(stage,'pointerdown',e=>{const pick=e.target.closest('[data-accessory]'),worn=e.target.closest('[data-worn]');if(!pick&&!worn)return;e.preventDefault();if(pick)choose(items.find(i=>i.id===pick.dataset.accessory));drag={id:e.pointerId,x:e.clientX,y:e.clientY,from:worn?.dataset.worn,item:worn?placed[worn.dataset.worn].item:selected,moved:false};(pick||worn).setPointerCapture(e.pointerId);ghost.src=base+selected.id+'-v1.webp';});
 listen(stage,'pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5){drag.moved=true;choose(drag.item);ghost.src=base+selected.id+'-v1.webp';}if(!drag.moved)return;const r=stage.getBoundingClientRect(),rotated=stage.classList.contains('pet-portrait');ghost.style.left=(rotated?e.clientY-r.top:e.clientX-r.left)+'px';ghost.style.top=(rotated?r.right-e.clientX:e.clientY-r.top)+'px';ghost.hidden=false;});
 listen(stage,'pointerup',e=>{if(drag){if(e.pointerId!==drag.id)return;if(drag.moved||drag.from){const p=coordinates(e);place(p.x,p.y,drag.from);}drag=null;ghost.hidden=true;return;}if(e.target.closest('.pet-cat')){const p=coordinates(e);place(p.x,p.y);}});
 listen(stage,'pointercancel',()=>{drag=null;ghost.hidden=true;});
 zones.querySelectorAll('button').forEach(b=>listen(b,'keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const spot=b.dataset.place;place(spot==='left'?35:spot==='right'?73:53.5,spot==='neck'?53:18);}}));
 choose(selected);panel.querySelector('[data-accessory]').focus();
 cleanup=()=>{abort.abort();ghost.remove();layer.remove();zones.remove();};
}
root.PetAccessories={items,placement,mount,stop:()=>cleanup()};
if(typeof module!=='undefined')module.exports={items,placement};
})(typeof window!=='undefined'?window:globalThis);

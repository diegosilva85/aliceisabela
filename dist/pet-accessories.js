(function(root){
const items=[
 {id:'laco-rosa',name:'Lacinho de pérola',type:'bow'},
 {id:'laco-lilas',name:'Lacinho estrela',type:'bow'},
 {id:'laco-azul',name:'Lacinho de bolinhas',type:'bow'},
 {id:'gravata-vermelha',name:'Gravatinha vermelha',type:'tie'},
 {id:'gravata-azul',name:'Gravatinha listrada',type:'tie'},
 {id:'gravata-verde',name:'Gravatinha xadrez',type:'tie'},
 {id:'mascara-roxa',name:'Máscara roxa e dourada',type:'mask'},
 {id:'mascara-azul',name:'Máscara azul e dourada',type:'mask'},
 {id:'capa-roxa',name:'Capa roxa e dourada',type:'cape'},
 {id:'capa-azul',name:'Capa azul e dourada',type:'cape'}
];
const fit=[{neck:[53.5,53],head:[29,79,13,23]},{neck:[53.5,53],head:[29,79,13,23]},{neck:[53.5,53.5],head:[29,79,13,23]},{neck:[53.5,53],head:[29,79,12,22]}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function placement(breed,type,x,y){const f=fit[breed]||fit[0];if(type==='mask')return {slot:'mask',x:54.5,y:breed===3?31:32,width:65,height:18,angle:2};if(type==='cape')return {slot:'cape',x:53.5,y:72,width:118,height:57,angle:0};if(type==='tie'||y>34)return {slot:'neck',x:clamp(x,f.neck[0]-3,f.neck[0]+3),y:f.neck[1],width:type==='tie'?32:28,angle:0};return {slot:x<54?'headLeft':'headRight',x:clamp(x,f.head[0],f.head[1]),y:clamp(y,f.head[2],f.head[3]),width:26,angle:x<54?-12:12};}
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
 panel.innerHTML='<h2>Acessórios</h2><div class="pet-accessory-tabs"><button data-group="bow" aria-pressed="true">Laços</button><button data-group="tie" aria-pressed="false">Gravatas</button><button data-group="hero" aria-pressed="false">Heróis</button></div><div class="pet-accessory-list">'+items.map(i=>'<button data-accessory="'+i.id+'" aria-label="'+i.name+'" aria-pressed="false"><img draggable="false" src="'+base+i.id+'-v1.webp" alt=""><span>'+i.name+'</span></button>').join('')+'</div><button class="pet-remove">Retirar acessórios</button><button class="pet-dress-next">Outro gatinho →</button>';
 const back=document.createElement('div');back.className='pet-accessory-back';cat.prepend(back);
 const layer=document.createElement('div');layer.className='pet-accessory-layer';cat.append(layer);
 const zones=document.createElement('div');zones.className='pet-accessory-zones';zones.innerHTML='<button data-place="left" aria-label="Colocar lacinho à esquerda da cabeça"></button><button data-place="right" aria-label="Colocar lacinho à direita da cabeça"></button><button data-place="neck" aria-label="Colocar acessório no pescoço"></button><button data-place="eyes" aria-label="Colocar máscara nos olhos"></button><button data-place="cape" aria-label="Colocar capa atrás do gato"></button>';cat.append(zones);
 const ghost=document.createElement('img');ghost.className='pet-accessory-ghost';ghost.hidden=true;stage.append(ghost);
 function guide(){zones.dataset.occupied=String(!!placed[selected.type==='mask'?'mask':selected.type==='cape'?'cape':selected.type==='tie'?'neck':'none']);}
 function choose(item){selected=item;guide();panel.querySelectorAll('[data-accessory]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.accessory===item.id));zones.dataset.type=item.type;stage.querySelector('.pet-hint').textContent=item.type==='mask'?'Toque no rosto para encaixar a máscara nos olhos.':item.type==='cape'?'Toque no gatinho para vestir a capa e os cordões.':item.type==='tie'?'Escolha a gravatinha e toque no pescoço. Também pode arrastar.':'Escolha o lacinho e toque na cabeça ou no pescoço. Também pode arrastar.';}
 function draw(){guide();back.innerHTML=placed.cape?'<img class="pet-worn-cape" src="'+base+placed.cape.item.id+'-v1.webp" alt="" style="left:53.5%;top:43.5%;width:118%;height:57%">':'';layer.innerHTML=Object.entries(placed).filter(([slot])=>slot!=='cape').map(([slot,a])=>'<button data-worn="'+slot+'" aria-label="Mover '+a.item.name+'" style="left:'+a.x+'%;top:'+a.y+'%;width:'+a.width+'%;'+(a.height?'height:'+a.height+'%;':'')+'transform:translate(-50%,-50%) rotate('+a.angle+'deg)"><img draggable="false" src="'+base+a.item.id+'-v1.webp" alt=""></button>').join('');if(placed.cape)layer.insertAdjacentHTML('beforeend','<button data-worn="cape" class="pet-cape-cord" aria-label="Mover '+placed.cape.item.name+'" style="left:53.5%;top:51%;width:46%;height:14%;transform:translate(-50%,-50%)"><img draggable="false" src="'+base+'cordao-'+placed.cape.item.id+'-v1.webp" alt=""></button>');}
 function coordinates(e){const r=cat.getBoundingClientRect();return stage.classList.contains('pet-portrait')?{x:(e.clientY-r.top)/r.height*100,y:(r.right-e.clientX)/r.width*100}:{x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100};}
 function place(x,y,from){if(x<0||x>100||y<0||y>100)return false;const p=placement(breed,selected.type,x,y);if(from&&placed[from]?.item.id===selected.id)delete placed[from];placed[p.slot]={...p,item:selected};draw();onPlace?.();return true;}
 function group(value){panel.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.group===value));panel.querySelectorAll('[data-accessory]').forEach(b=>{const item=items.find(i=>i.id===b.dataset.accessory);b.hidden=(value==='hero'?!['mask','cape'].includes(item.type):item.type!==value);});choose(items.find(i=>value==='hero'?i.type==='mask':i.type===value));}
 listen(panel,'click',e=>{const category=e.target.closest('[data-group]');if(category){group(category.dataset.group);return;}const button=e.target.closest('[data-accessory]');if(button)choose(items.find(i=>i.id===button.dataset.accessory));});
 listen(panel.querySelector('.pet-remove'),'click',()=>{placed={};draw();});
 listen(panel.querySelector('.pet-dress-next'),'click',onNext);
 listen(stage,'pointerdown',e=>{const pick=e.target.closest('[data-accessory]'),worn=e.target.closest('[data-worn]');if(!pick&&!worn)return;e.preventDefault();if(pick)choose(items.find(i=>i.id===pick.dataset.accessory));drag={id:e.pointerId,x:e.clientX,y:e.clientY,from:worn?.dataset.worn,item:worn?placed[worn.dataset.worn].item:selected,moved:false};(pick||worn).setPointerCapture(e.pointerId);ghost.src=base+selected.id+'-v1.webp';});
 listen(stage,'pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5){drag.moved=true;choose(drag.item);ghost.src=base+selected.id+'-v1.webp';}if(!drag.moved)return;const r=stage.getBoundingClientRect(),rotated=stage.classList.contains('pet-portrait');ghost.style.left=(rotated?e.clientY-r.top:e.clientX-r.left)+'px';ghost.style.top=(rotated?r.right-e.clientX:e.clientY-r.top)+'px';ghost.hidden=false;});
 listen(stage,'pointerup',e=>{if(drag){if(e.pointerId!==drag.id)return;if(drag.moved||drag.from){const p=coordinates(e);place(p.x,p.y,drag.from);}drag=null;ghost.hidden=true;return;}if(e.target.closest('.pet-cat')){const p=coordinates(e);place(p.x,p.y);}});
 listen(stage,'pointercancel',()=>{drag=null;ghost.hidden=true;});
 zones.querySelectorAll('button').forEach(b=>listen(b,'keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const spot=b.dataset.place;place(spot==='left'?35:spot==='right'?73:53.5,spot==='neck'?53:18);}}));
 group('bow');panel.querySelector('[data-accessory]').focus();
 cleanup=()=>{abort.abort();ghost.remove();back.remove();layer.remove();zones.remove();};
}
root.PetAccessories={items,placement,mount,stop:()=>cleanup()};
if(typeof module!=='undefined')module.exports={items,placement};
})(typeof window!=='undefined'?window:globalThis);

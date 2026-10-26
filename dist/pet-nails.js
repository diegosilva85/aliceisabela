(function(root){
const base='assets/petshop/';
const paws=['dianteira-esquerda','dianteira-direita','traseira-esquerda','traseira-direita'];
const labels=['Dianteira esquerda','Dianteira direita','Traseira esquerda','Traseira direita'];
// Percent coordinates of the distal claw tips. The black mask removes only
// the tip, retaining the original fur and the short base of each claw.
const tips=[
 [[15,12,9,12],[33,0,10,13],[58,0,9,13],[76,10,9,14],[83,43,8,7]],
 [[5,31,13,7],[25,5,11,11],[47,0,14,11],[68,7,13,11],[84,22,14,10]],
 [[22,12,8,11],[37,3,11,11],[55,6,9,11],[72,16,12,10]],
 [[21,16,8,12],[38,3,9,12],[56,3,9,12],[73,14,9,12]]
];
function file(breed,paw){return base+(['','gatinho-branco-','gatinho-siames-','gatinho-scottish-fold-'][breed]||'')+'pata-'+paws[paw]+(breed===3?'-v2.webp':'-v1.webp');}
function create(){return {paw:0,cut:paws.map((_,i)=>tips[i].map(()=>false)),selected:false};}
function clip(s,index){if(!s.selected||!Number.isInteger(index)||index<0||index>=s.cut[s.paw].length||s.cut[s.paw][index])return false;s.cut[s.paw][index]=true;return true;}
function total(s){return s.cut.flat().filter(Boolean).length;}
let cleanup=()=>{};
function mount({breed,onClip,onComplete}){
 cleanup();const stage=document.querySelector('.pet-play'),panel=stage.querySelector('.pet-tools'),s=create();
 const abort=new AbortController(),listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
 let timer=0,loadTimer=0,token=0,ready=false,locked=false;
 stage.classList.add('pet-nails');stage.querySelector('.pet-cursor').hidden=true;
 stage.querySelector('.pet-steps').innerHTML='<span class="current">5 · Cortar as unhas</span>';
 stage.querySelector('.pet-hint').textContent='Pegue o cortador e toque em cada unha.';
 panel.setAttribute('aria-label','Cortar as unhas');
 panel.innerHTML='<button class="pet-pick-clipper" aria-pressed="false"><img src="'+base+'cortador-unhas-v1.webp" alt=""><span>Pegar cortador</span></button><div class="pet-paw-progress" aria-label="Progresso das patas"></div>';
 const area=document.createElement('div');area.className='pet-paw-area';stage.append(area);
 const cursor=document.createElement('img');cursor.className='pet-nail-cursor';cursor.src=base+'cortador-unhas-v1.webp';cursor.alt='';cursor.hidden=true;stage.append(cursor);
 function message(text){stage.querySelector('#pet-message').textContent=text;}
 function progress(){stage.querySelector('#pet-count').textContent='Pata '+(s.paw+1)+' de 4 · '+total(s)+' / 18 unhas';stage.querySelector('.pet-total-fill').style.width=total(s)/18*100+'%';panel.querySelector('.pet-paw-progress').innerHTML=labels.map((label,i)=>'<span class="'+(i===s.paw?'current':'')+'">'+(s.cut[i].every(Boolean)?'✓':i+1)+' · '+label+'</span>').join('');}
 function paint(){const cuts=area.querySelector('#pet-claw-cuts');if(!cuts)return;cuts.innerHTML=tips[s.paw].map((r,i)=>s.cut[s.paw][i]?'<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" fill="black"/>':'').join('');area.querySelectorAll('[data-claw]').forEach((b,i)=>{b.hidden=s.cut[s.paw][i];b.disabled=!ready||locked;});progress();}
 function render(){ready=false;locked=false;cursor.hidden=true;const id=++token;clearTimeout(loadTimer);area.innerHTML='<div class="pet-paw-loading" role="status">Preparando a patinha…</div>';message(labels[s.paw]);progress();const img=new Image();
 const fail=()=>{if(id!==token||abort.signal.aborted)return;clearTimeout(loadTimer);area.innerHTML='<div class="pet-paw-loading">Não foi possível carregar a patinha.<button class="pet-paw-retry">Tentar novamente</button></div>';area.querySelector('button').onclick=render;};
 img.onload=()=>{if(id!==token||abort.signal.aborted)return;clearTimeout(loadTimer);ready=true;area.innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true"><defs><mask id="pet-claw-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="white"/><g id="pet-claw-cuts"></g></mask></defs><image href="'+file(breed,s.paw)+'" width="100" height="100" mask="url(#pet-claw-mask)"/></svg>'+tips[s.paw].map((r,i)=>'<button data-claw="'+i+'" aria-label="Cortar unha '+(i+1)+' da pata '+labels[s.paw].toLowerCase()+'" style="left:'+(r[0]+r[2]/2)+'%;top:'+(r[1]+r[3]*.65)+'%;width:'+Math.max(10,r[2])+'%;height:'+Math.max(10,r[3])+'%"></button>').join('');paint();};img.onerror=fail;loadTimer=setTimeout(fail,15000);img.src=file(breed,s.paw);
 }
 function position(e){if(!s.selected||!ready||locked)return;const r=stage.getBoundingClientRect(),rotated=stage.classList.contains('pet-portrait');cursor.style.left=(rotated?e.clientY-r.top:e.clientX-r.left)+'px';cursor.style.top=(rotated?r.right-e.clientX:e.clientY-r.top)+'px';cursor.hidden=false;}
 listen(panel.querySelector('.pet-pick-clipper'),'click',()=>{s.selected=true;stage.classList.add('pet-clipper-selected');panel.querySelector('button').setAttribute('aria-pressed','true');stage.querySelector('.pet-hint').textContent='Clique ou toque em cada unha para cortar a pontinha.';});
 listen(stage,'pointermove',position);listen(stage,'pointerleave',()=>cursor.hidden=true);listen(stage,'pointercancel',()=>cursor.hidden=true);
 listen(area,'click',e=>{const b=e.target.closest('[data-claw]');if(!b||!ready||locked)return;if(!s.selected){message('Primeiro, pegue o cortador ao lado.');return;}const i=+b.dataset.claw;if(!clip(s,i))return;if(e.detail)position(e);cursor.classList.remove('snip');void cursor.offsetWidth;cursor.classList.add('snip');onClip?.();const r=tips[s.paw][i],star=document.createElement('span');star.className='pet-glitter';star.textContent='✦';star.style.left=(r[0]+r[2]/2)+'%';star.style.top=(r[1]+r[3])+'%';area.append(star);star.addEventListener('animationend',()=>star.remove(),{once:true});paint();
 if(s.cut[s.paw].every(Boolean)){locked=true;paint();message(s.paw===3?'Todas as unhas prontinhas!':'Patinha pronta!');timer=setTimeout(()=>{if(s.paw<3){s.paw++;render();}else{cleanup();onComplete?.();}},950);}
 });
 cleanup=()=>{abort.abort();token++;clearTimeout(timer);clearTimeout(loadTimer);area.remove();cursor.remove();stage.classList.remove('pet-nails','pet-clipper-selected');cleanup=()=>{};};render();
}
root.PetNails={mount,stop:()=>cleanup(),create,clip,total,file,tips};
if(typeof module!=='undefined')module.exports=root.PetNails;
})(typeof window!=='undefined'?window:globalThis);

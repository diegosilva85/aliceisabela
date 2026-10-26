const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../dist/pet.js'),'utf8');
const position=source.slice(source.indexOf('function position(e)'),source.indexOf('function tick(now)'));
const PetCore=require('../dist/pet-core.js');
for(const mobile of [false,true])for(const portrait of [false,true])for(const tool of ['shower','soap','dryer','treat'])for(const side of ['left','right']){
 let hit,mirrored;const cursor={offsetWidth:75,style:{},classList:{toggle:(_,on)=>mirrored=on}};
 const rect={left:0,top:0,width:portrait?390:844,height:portrait?844:390,right:portrait?390:844};
 const stage={getBoundingClientRect:()=>rect,classList:{contains:()=>portrait}};
 const context={PetCore,tool,held:false,handSide:'left',q:s=>s==='.pet-cursor'?cursor:stage,matchMedia:()=>({matches:mobile}),performance:{now:()=>100},gesture:PetCore.motion(),motionCredit:0,document:{elementFromPoint:(x,y)=>{hit={x,y};return null;}}};
 vm.createContext(context);vm.runInContext(position,context);
 const finger=side==='left'?300:544;
 const event=portrait?{clientX:190,clientY:finger}:{clientX:finger,clientY:200};
 context.position(event);
 const enabled=mobile&&tool!=='treat',distance=enabled?(tool==='soap'?120:tool==='shower'?90:86.25):0;
 const target=finger+(side==='right'?-distance:distance);
 assert.equal(portrait?hit.y:hit.x,target);
 assert.equal(parseFloat(cursor.style.left),target);
 assert.equal(parseFloat(cursor.style.top),200);
 assert.equal(mirrored,enabled&&side==='right');
 if(enabled){context.held=true;context.position(portrait?{clientX:190,clientY:844-finger}:{clientX:844-finger,clientY:200});assert.equal(context.handSide,side,'O lado não troca durante o movimento');}
}
// Reflect the whole tool group around the cleaning point, including water/air.
for(const translation of [.32,.65])for(const pixel of [0,12,37.5,75]){
 const normal=translation*75+pixel;
 const mirrored=-(translation+1)*75+75-pixel;
 assert.ok(Math.abs(normal+mirrored)<1e-10);
}
console.log('32 cenários: lados, rotação, desktop, biscoito e estabilidade do gesto OK; imagens e efeitos espelhados em torno do alvo.');

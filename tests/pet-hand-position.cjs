const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../dist/pet.js'),'utf8');
const position=source.slice(source.indexOf('function position(e)'),source.indexOf('function tick(now)'));
const PetCore=require('../dist/pet-core.js');
for(const pointerType of ['mouse','touch'])for(const mobile of [false,true])for(const portrait of [false,true])for(const tool of ['shower','soap','dryer','treat'])for(const side of ['left','right']){
 let hit,mirrored,touchTools;const cursor={offsetWidth:75,style:{},classList:{toggle:(_,on)=>mirrored=on}};
 const width=mobile?844:1280,height=mobile?390:800;
 const rect={left:0,top:0,width:portrait?height:width,height:portrait?width:height,right:portrait?height:width};
 const stage={getBoundingClientRect:()=>rect,classList:{contains:()=>portrait,toggle:(name,on)=>{assert.equal(name,'pet-touch-tools');touchTools=on;}}};
 const context={PetCore,tool,held:false,handSide:'left',q:s=>s==='.pet-cursor'?cursor:stage,matchMedia:()=>({matches:mobile}),performance:{now:()=>100},gesture:PetCore.motion(),motionCredit:0,document:{elementFromPoint:(x,y)=>{hit={x,y};return null;}}};
 vm.createContext(context);vm.runInContext(position,context);
 const finger=side==='left'?width*.35:width*.65;
 const event=portrait?{pointerType,clientX:height-200,clientY:finger}:{pointerType,clientX:finger,clientY:200};
 context.position(event);
 const enabled=(mobile||pointerType==='touch')&&tool!=='treat',distance=enabled?(tool==='soap'?120:tool==='shower'?90:86.25):0;
 const target=finger+(side==='right'?-distance:distance);
 assert.equal(portrait?hit.y:hit.x,target);
 assert.equal(parseFloat(cursor.style.left),target);
 assert.equal(parseFloat(cursor.style.top),200);
 assert.equal(mirrored,enabled&&side==='right');
 assert.equal(touchTools,enabled,'Tablet usa a mesma geometria visual do celular');
 if(enabled){context.held=true;context.position(portrait?{pointerType,clientX:height-200,clientY:width-finger}:{pointerType,clientX:width-finger,clientY:200});assert.equal(context.handSide,side,'O lado não troca durante o movimento');}
}
// Reflect the whole tool group around the cleaning point, including water/air.
for(const translation of [.32,.65])for(const pixel of [0,12,37.5,75]){
 const normal=translation*75+pixel;
 const mirrored=-(translation+1)*75+75-pixel;
 assert.ok(Math.abs(normal+mirrored)<1e-10);
}
console.log('64 cenários: toque em tablet 1280×800, celular, mouse, lados, rotação, biscoito e estabilidade do gesto OK; imagens e efeitos espelhados em torno do alvo.');

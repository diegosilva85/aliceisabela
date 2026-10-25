// Clothing colors are saved per piece, separately from face and hair colors.
const garmentPalette=[['Castanho','#68412d'],['Preto','#29222c'],['Dourado','#dba74d'],['Coral','#dc7c69'],['Roxo','#8051bd'],['Rosa','#d85488'],['Chocolate','#432d29'],['Caramelo','#b57a49'],['Creme','#f0deb2'],['Prateado','#aeb5c5'],['Azul','#326bb0'],['Verde menta','#63b6a1'],['Lilás','#b18bd2'],['Cereja','#973c61'],['Verde','#528268'],['Branco','#f6f2e9']];
function shadeColor(hex,factor){const rgb=hex.slice(1).match(/../g).map(n=>parseInt(n,16));return '#'+rgb.map(n=>Math.round(factor<=1?n*factor:n+(255-n)*(factor-1)).toString(16).padStart(2,'0')).join('')}
let tintSerial=0;
function tintAsset(markup,look,part,{id}){
 const item=look[part==='headwear'?'hair':part],choice=look.tints?.[part]?.[item];
 if(!Number.isInteger(choice)||!garmentPalette[choice]||!markup)return markup||'';
 const color=garmentPalette[choice][1],grad=id+'-tint-'+part+'-'+(++tintSerial);
 const painted=markup.replace(/(fill|stroke)="(#[\da-fA-F]{3,8}|white|url\(#[^"]+\))"/g,(all,attr,value)=>{
  if(value.startsWith('url(')){if(value.includes('-skin)'))return all;return `${attr}="url(#${grad})"`;}
  let raw=value==='white'?'ffffff':value.slice(1);if(raw.length===3)raw=raw.split('').map(x=>x+x).join('');const alpha=raw.length===8?raw.slice(6):'';
  const rgb=raw.slice(0,6).match(/../g).map(x=>parseInt(x,16)),lum=(rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722)/255;
  const factor=attr==='stroke'?(lum<.65?.55:1.25):(lum<.25?.45:lum<.5?.78:lum<.75?1:1+(lum-.75)*2.6);
  return `${attr}="${shadeColor(color,factor)}${alpha}"`;
 });
 return `<g data-tinted-part="${part}"><defs><linearGradient id="${grad}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${shadeColor(color,1.18)}"/><stop offset="1" stop-color="${shadeColor(color,.8)}"/></linearGradient></defs>${painted}</g>`;
}
function drawPiecePalette(){
 const target=document.querySelector('#piece-palette');if(!target)return;
 const part=['top','skirt','shoes','earrings','bag','necklace'].includes(fashionCategory)?fashionCategory:fashionCategory==='hair'?'headwear':null;
 if(!part){target.innerHTML='';return;}
 const item=look[part==='headwear'?'hair':part];
 if((part==='headwear'&&![7,8].includes(item))||(part==='bag'&&item===4)||(part==='necklace'&&item===0)){target.innerHTML='';return;}
 const choice=look.tints?.[part]?.[item],title=part==='headwear'?'Cor do chapéu ou laço':'Cor desta peça';
 target.innerHTML=`<div class="piece-palette"><div class="palette-heading"><strong>${title}</strong><button data-tint="-1" aria-pressed="${choice===undefined}">Cor original</button></div><div class="tint-grid" role="group" aria-label="${title}">${garmentPalette.map(([name,color],i)=>`<button class="tint-swatch" data-tint="${i}" aria-label="${name}" title="${name}" aria-pressed="${choice===i}" style="--swatch:${color}"><span aria-hidden="true">${choice===i?'✓':''}</span><small>${name}</small></button>`).join('')}</div></div>`;
 target.querySelectorAll('[data-tint]').forEach(b=>b.onclick=()=>{const i=+b.dataset.tint;look.tints={...look.tints,[part]:{...look.tints?.[part]}};if(i<0)delete look.tints[part][item];else look.tints[part][item]=i;drawFashion();chime()});
}

const equestriaSkin=['#c8addc','#f2c48c','#98cee9','#f0e9f4','#f5bdd5','#f5e7a3'];
const characterModels=[
 {name:'Moana',bottomName:'Saia da Moana',skin:2,hairColor:6,eyes:0,eyeStyle:4,mouthStyle:3},
 {name:'Elsa',bottomName:'Saia de gelo da Elsa',skin:8,hairColor:8,eyes:1,eyeStyle:5,mouthStyle:2},
 {name:'Anna',bottomName:'Saia bordada da Anna',skin:0,hairColor:3,eyes:1,eyeStyle:4,mouthStyle:2},
 {name:'Cinderela',bottomName:'Saia de baile da Cinderela',skin:0,hairColor:2,eyes:1,eyeStyle:1,mouthStyle:2},
 {name:'Raya',bottomName:'Calça da Raya',skin:5,hairColor:6,eyes:0,eyeStyle:2,mouthStyle:4},
 {name:'Ariel',bottomName:'Saia oceano da Ariel',skin:0,hairColor:13,eyes:9,eyeStyle:1,mouthStyle:3},
 {name:'Twilight Sparkle',bottomName:'Saia da Twilight Sparkle',skin:0,hairColor:4,eyes:12,eyeStyle:1,mouthStyle:7},
 {name:'Applejack',bottomName:'Saia jeans da Applejack',skin:1,hairColor:2,eyes:2,eyeStyle:5,mouthStyle:6},
 {name:'Rainbow Dash',bottomName:'Saia da Rainbow Dash',skin:0,hairColor:10,eyes:15,eyeStyle:7,mouthStyle:1},
 {name:'Rarity',bottomName:'Saia da Rarity',skin:0,hairColor:4,eyes:1,eyeStyle:5,mouthStyle:2},
 {name:'Pinkie Pie',bottomName:'Saia da Pinkie Pie',skin:0,hairColor:5,eyes:1,eyeStyle:4,mouthStyle:7},
 {name:'Fluttershy',bottomName:'Saia da Fluttershy',skin:1,hairColor:5,eyes:10,eyeStyle:2,mouthStyle:7}
];
function characterLook(i,base){const c=characterModels[i];return {...base,...c,top:17+i,skirt:17+i,shoes:17+i,hair:15+i,fantasySkin:i>=6?i-6:-1,eyeExpression:0,mouthExpression:0,earrings:0,necklace:0,bag:4,lip:0,tints:{...base.tints,top:{...base.tints?.top,[17+i]:undefined},skirt:{...base.tints?.skirt,[17+i]:undefined},shoes:{...base.tints?.shoes,[17+i]:undefined}}};}
function characterMenu(){return `<div class="character-collections">${['Disney','Equestria Girls'].map((group,g)=>`<details><summary>${group} <span>6 personagens</span></summary><div class="character-grid">${characterModels.slice(g*6,g*6+6).map((c,j)=>`<button data-character="${g*6+j}">${avatar(characterLook(g*6+j,fashionDefault),false)}<span>${c.name}</span></button>`).join('')}</div></details>`).join('')}</div>`;}
function characterArt(s,{p,l,m,star,flower,hair,url,skin}){
 const out={},ink='#625064',gold='#ddbd73';
 const body='M118 197L136 190Q150 205 164 190L182 197Q179 218 179 237L181 279Q150 285 119 279L121 237Q121 216 118 197Z';
 const short='M118 197Q102 198 97 217L93 232Q103 241 116 239L123 215Z';
 const long='M118 198Q102 198 97 217L87 254 79 284Q86 293 98 290L108 259 123 218Z';
 const puff='M119 195Q100 192 94 212Q90 223 94 235Q105 242 118 238L124 216Z';
 const diamond=(x,y,c='#8cd5e8')=>p(`M${x} ${y-6}L${x+5} ${y} ${x} ${y+7} ${x-5} ${y}Z`,c,'#6a92b4',.7)+l(`M${x} ${y-5}V${y+5}`,'#ffffff88',.7);
 const apple=(x,y)=>p(`M${x} ${y-3}Q${x-10} ${y-10} ${x-9} ${y+1}Q${x-8} ${y+11} ${x} ${y+8}Q${x+8} ${y+11} ${x+9} ${y+1}Q${x+10} ${y-10} ${x} ${y-3}Z`,'#d45b53','#9c564f',.6)+l(`M${x} ${y-3}L${x+2} ${y-9}`,'#719362',2);
 const butterfly=(x,y)=>p(`M${x} ${y}Q${x-13} ${y-14} ${x-12} ${y-2}Q${x-13} ${y+4} ${x-4} ${y+3}Q${x-12} ${y+14} ${x-2} ${y+10}L${x} ${y+2}Q${x+10} ${y+15} ${x+12} ${y+5}Q${x+11} ${y+1} ${x+5} ${y+2}Q${x+17} ${y-12} ${x+7} ${y-10}Z`,'#e69fc5','#bc83ae',.5)+l(`M${x} ${y-4}V${y+9}`,'#799db3',1.5);
 const snow=(x,y,r=5)=>[0,60,120].map(a=>`<g transform="rotate(${a} ${x} ${y})">${l(`M${x-r} ${y}H${x+r}M${x-r+1} ${y-2}L${x-r+3} ${y} ${x-r+1} ${y+2}M${x+r-1} ${y-2}L${x+r-3} ${y} ${x+r-1} ${y+2}`,'#eefcff',.8)}</g>`).join('');
 const n=s.top-17;
 if(n>=0&&n<12){const colors=['#d47b5d','#78d3e6','#303650','#a6d8ef','#d4b875','#b59bd4','#f5eff8','#f7f1cf','#f8f7f0','#e6edf7','#f6e9ef','#f7f4da'];const c=colors[n];let sleeves='',detail='';
  if([1,2,4,8].includes(n))sleeves=m(p(long,n===2?'#a4c2d9':n===4?'#d4b875':n===8?'#4f8fc7':'#c5eaf0',ink,.8));
  else if([3,6,7,9,10,11].includes(n))sleeves=m(p(n===3?puff:short,n===3?'#e7f4fa':c,ink,.8));
  if(n===0)detail=[214,229,245,261].map(y=>l(`M123 ${y}H177`,'#a84640',2)).join('')+[131,143,155,167].map(x=>p(`M${x} 223L${x+5} 230 ${x} 237 ${x-5} 230Z`,'#f3c19b','none')).join('')+l('M136 193Q150 222 164 193','#d7c6a5',1.5)+`<ellipse cx="150" cy="214" rx="5" ry="7" fill="#66c3b4" stroke="#e6e1ba"/>`;
  if(n===1){detail=p('M118 207L135 216 150 207 165 216 182 207 178 278Q150 291 122 278Z','#71cce2','#519fbb',.7)+[130,140,150,160,170].map((x,i)=>l(`M${x} ${218+i%2*6}L${x-3} 269`,'#d1f7ff',1)).join('')+snow(151,243,8);out.cape=p('M119 204Q102 300 73 453Q150 484 227 453Q198 300 181 204Z','#c5ecf088','#a4d4e2',.6)+[[93,410],[201,422],[106,353],[190,349]].map(([x,y])=>snow(x,y,7)).join('');}
  if(n===2){detail=l('M135 193Q150 208 165 193',gold,2)+p('M150 222Q139 208 135 222Q134 232 150 240Q167 232 165 222Q160 209 150 222Z','#749c71',gold,.6)+l('M150 229V266','#8daa72',1.5)+flower(150,253,3)+l('M121 276Q150 285 179 276',gold,2);out.cape=p('M132 190Q104 205 101 238L77 342 112 334 126 209ZM168 190Q196 205 199 238L223 342 188 334 174 209Z','#a65287','#703f70',.8)+p('M130 190Q150 183 170 190L176 207Q150 218 124 207Z','#bc74a1','#824b7b',.7);}
  if(n===3)detail=p('M124 197Q150 225 176 197L176 215Q150 239 124 215Z','#e4f2fa','#96bfd6',.6)+l('M130 223Q136 247 125 277M170 223Q164 247 175 277','#7eaccb',1)+diamond(150,225,'#e6fbff');
  if(n===4){detail=p('M136 191L150 202 165 191 171 206 151 217 130 206Z','#e5d7a5','#a28d60',.7)+p('M137 212L148 216 161 278H146Z','#8b694f',ink,.7)+l('M123 238H139M164 239H176','#ad8b60',1.5);out.cape=p('M117 198Q100 256 79 383L113 373 133 209ZM181 198Q202 263 222 380L188 370 164 209Z','#9b594f','#734a48',.8);}
  if(n===5)detail=m(p('M150 237Q134 213 123 230Q118 247 146 253Z','#c3a5df','#8c73b1',.8)+l('M130 229L145 248M136 225L147 246','#e4c8f3',1))+p('M124 257Q150 268 176 257L180 279H120Z','#91c9c1','#6caba4',.6)+star(150,252,4);
  if(n===6)detail=p('M135 191L150 205 139 219 126 198M165 191L150 205 161 219 174 198','#fff',ink,.6)+p('M150 208Q131 194 137 218L150 214Q169 194 163 218Z','#cc629e',ink,.6)+l('M150 219V278','#b3a0c7',1)+star(169,241,6);
  if(n===7)detail=p('M135 191L150 205 139 217 126 199M165 191L150 205 161 217 174 199','#f5d19c',ink,.6)+[220,238,256].map(y=>`<circle cx="150" cy="${y}" r="2" fill="#af8c5c"/>`).join('')+m(p('M126 224H141V238L134 242 126 238Z','#e8bc87','#ba9167',.7));
  if(n===8)detail=p('M118 197L134 192 139 279H119ZM182 197L166 192 161 279H181Z','#4f8fc7','#386a9b',.7)+p('M145 229Q139 219 145 217Q151 210 157 218Q166 217 166 226H145Z','#ecf8fc','none')+p('M151 227L159 227 153 235 158 235 147 248 150 237 145 237Z','#edcb61','none')+l('M151 230L147 238','#db6683',2);
  if(n===9)detail=p('M135 191Q150 217 165 191L172 197Q150 225 128 197Z','#a2bdd7',ink,.7)+diamond(151,232)+diamond(141,248)+diamond(161,248)+l('M122 276H179','#8063ac',4);
  if(n===10)detail=p('M135 191Q150 211 165 191L172 198Q150 223 128 198Z','#72bdd5',ink,.7)+p('M150 211Q135 200 137 218L150 215Q166 200 163 218Z','#ef91be',ink,.6)+[132,151,170].map((x,i)=>`<ellipse cx="${x}" cy="${239+i%2*7}" rx="5" ry="7" fill="${i%2?'#edcc6c':'#80c4df'}"/>`+l(`M${x} ${246+i%2*7}Q${x-5} 258 ${x} 267`,'#af8ca9',.6)).join('');
  if(n===11)detail=p('M136 191Q150 207 164 191L171 198Q150 218 129 198Z','#f0d8b8',ink,.6)+butterfly(151,238)+l('M121 276H179','#8bbca1',4);
  out.top=sleeves+p(body,c,ink,.8)+detail;
 }
 const b=s.skirt-17;
 if(b>=0&&b<12){const colors=['#e8d0a1','#81d4e5','#385e9a','#b6def3','#8c8d67','#76c3b1','#7354a6','#80a7c3','#bf617e','#8d6bb5','#dd81af','#9dc9a0'];const c=colors[b];const belt=p('M120 275Q150 280 180 275L181 286Q150 290 119 286Z',b===0?'#bd5948':b===7?'#a27c50':c,ink,.7);let base='',detail='';
  if(b===4)base=p('M120 280H180Q191 327 181 397L180 454H154L150 334 146 454H119L121 397Q109 329 120 280Z',c,ink,.9)+l('M150 287V334M126 299L124 436M175 299L177 436','#b5b28a',1.1)+p('M118 316H134V344H117ZM166 316H182V344H167Z','#9d9d76',ink,.6);
  else if(b===0){base=p('M120 281H180L196 391Q150 406 104 391Z',c,ink,.8)+p('M121 285H179L189 370 154 351 108 373Z','#f4e3bb','#bca777',.7);detail=[300,318,336].map(y=>l(`M118 ${y}Q150 ${y+7} 183 ${y}`,'#b58962',1.3)).join('')+[114,126,138,150,162,174,186].map(x=>l(`M${x} 376L${x-2} 394`,'#bfa476',2)).join('')+p('M165 281L183 284 189 345 174 337Z','#c26750','#9b5046',.6);}
  else{const floor=b<6,hem=floor?448:352,left=b===3?75:b===1?104:floor?89:100,right=300-left;base=p(`M120 280H180Q185 342 ${right} ${hem}Q150 ${hem+24} ${left} ${hem}Q115 342 120 280Z`,c,ink,.8)+[126,141,159,174].map((x,i)=>l(`M${x} 290Q${x+(i-1.5)*5} 350 ${x+(i-1.5)*19} ${hem}`,b===2?'#7292bf':'#ffffff55',1)).join('');
   if(b===1)detail=[[126,320],[168,354],[138,397],[181,431],[120,438]].map(([x,y])=>snow(x,y,5)).join('')+p('M177 290L190 440 177 449 167 350Z','#c7f4f8aa','none');
   if(b===2)detail=[110,129,150,171,190].map((x,i)=>l(`M${x} 438V${414-i%2*9}`,'#8caa79',1.2)+flower(x,410-i%2*9,3)).join('')+l('M94 445Q150 465 206 445',gold,2);
   if(b===3)detail=p('M120 284H150Q140 331 101 346L85 368Q102 312 120 284ZM180 284H150Q160 331 199 346L215 368Q198 312 180 284Z','#e9f7fa','#aac9de',.7)+star(150,292,4);
   if(b===5)detail=p('M120 284H180Q173 338 182 375Q157 404 150 426Q143 404 118 375Q127 338 120 284Z','#9ddbd0','#69acaa',.7)+l('M95 441Q150 466 205 441','#c5eee0',3)+[319,337,355].map(y=>l(`M132 ${y}Q141 ${y+8} 150 ${y}Q159 ${y+8} 168 ${y}`,'#65b3ac',1)).join('');
   if(b===6)detail=star(172,325,9)+[158,186,174].map((x,i)=>star(x,312+i*11,2.5)).join('');
   if(b===7)detail=l('M150 287V356M122 297Q124 313 140 305M160 305Q176 313 178 297','#d9e7ef',1)+apple(172,333);
   if(b===8)detail=l('M110 337Q150 352 190 337','#f3dae5',3)+p('M170 314L182 314 175 325 181 325 167 339 170 328 165 328Z','#f4d568','none');
   if(b===9)detail=diamond(173,326)+diamond(163,340)+diamond(183,340);
   if(b===10)detail=[123,150,177].map((x,i)=>`<ellipse cx="${x}" cy="${319+i%2*9}" rx="5" ry="7" fill="${i%2?'#f0d36b':'#9cd6e5'}"/>`+l(`M${x} ${326+i%2*9}Q${x-4} 341 ${x} 347`,'#f4d7e7',.7)).join('')+l('M104 348Q150 365 196 348','#f6c5df',3);
   if(b===11)detail=butterfly(173,327)+butterfly(126,341);
  }out.bottom=base+detail+belt;
 }
 const f=s.shoes-17;if(f>=0&&f<12){let shoe='';const c=['#b78a58','#b6e8f3','#45374c','#d5f0fa','#765a42','#83bdb6','#765497','#bd8d54','#4d8ccc','#916bb5','#8bc4da','#83b19a'][f];
  if(f===0)shoe=p('M121 463Q130 470 139 464L141 481Q123 489 105 482Q102 476 113 471Z',url('skin'),'#a16d60',.7)+l('M109 480Q123 484 139 477','#9e7251',1);
  else if([2,4,6,7,8,9,10,11].includes(f)){shoe=p('M120 405Q131 410 141 405L139 462 143 480Q124 490 104 482Q102 477 113 470L121 460Z',c,ink,.8)+p('M105 480Q125 486 142 478L143 485Q125 492 105 486Z',shadeColor(c,.7),ink,.5)+l('M122 410H140','#f5e7db',3)+l('M125 421V459','#ffffff66',1);if(f===7)shoe+=apple(130,430);if(f===8)shoe+=p('M128 420L136 420 130 432 135 432 125 446 128 435 123 435Z','#f5d56e','none');if(f===9)shoe+=diamond(131,430);if(f===11)shoe+=butterfly(131,430);}
  else shoe=p('M121 464Q130 471 139 464L141 480Q124 488 107 482Q103 477 113 472Z',c,ink,.7)+diamond(126,476,f===5?'#e2caed':'#ecfbff')+l('M110 481Q125 487 139 479','#ffffffaa',1);
  out.shoes=m(shoe);
 }
 const h=s.hair-15;if(h>=0&&h<12){let back='',front='',head='';const cap=p('M99 128Q85 97 98 66Q108 38 150 39Q191 38 202 68Q215 102 201 132L188 145 112 145Z',hair,ink,.8);
 const sweep=p('M98 120Q87 83 103 60Q123 36 154 41Q189 39 203 69Q212 94 201 121L193 109Q194 86 180 72Q154 102 111 106L105 123Z',hair,ink,.7)+l('M112 70Q141 47 169 54','#ffffff33',2);
 const longHair=p('M98 85Q91 44 150 39Q212 39 203 92Q218 126 208 151Q221 184 209 209Q219 240 207 278L190 294 190 276 177 291 170 277 127 281 111 297Q89 275 94 244Q80 218 94 190Q80 163 94 137Q80 111 98 85Z',url('hair'),ink,.8)+m(l('M99 114Q110 144 99 164Q88 188 103 211Q115 236 102 269','#ffffff26',1.8));
 const braid=(x,y,len,size=11)=>Array.from({length:len},(_,i)=>{const yy=y+i*size;return p(`M${x} ${yy}Q${x-size} ${yy+2} ${x-size*.5} ${yy+size}Q${x+4} ${yy+size*1.5} ${x+size*.7} ${yy+size*.5}Q${x+size} ${yy} ${x} ${yy}Z`,hair,ink,.6)+l(`M${x-size*.4} ${yy+4}L${x+size*.5} ${yy+size}`, '#ffffff44',1)}).join('');
 if(h===0){back=longHair+m(p('M96 115Q73 143 89 164Q73 188 87 210Q75 238 95 274L104 283Q88 253 105 234Q88 211 103 193Q88 171 107 152Z',hair,ink,.6));front=sweep+m(p('M102 95Q94 120 103 140Q94 160 111 182Q104 157 113 138L114 99Z',hair,'none'));}
 if(h===1){back=cap+braid(198,128,10,13)+p('M192 258L204 260 207 276 200 270 193 276Z',hair,ink,.6);front=p('M98 123Q88 87 100 63Q118 34 154 41Q187 36 202 65Q214 92 201 123L194 108Q195 84 182 73Q168 91 148 91L157 78Q137 100 114 103L106 122Z',hair,ink,.7)+l('M113 71Q125 47 150 47M128 79Q153 60 172 54','#fff8d977',1.5)+snow(192,105,4);}
 if(h===2){back=cap+m(braid(102,132,9,12)+p('M97 239L108 240 111 255 103 250 97 256Z',hair,ink,.6));front=sweep+m(p('M102 97L109 109 107 141 101 143Z',hair,'none'));head=m(l('M96 238L109 240','#9a588b',4));}
 if(h===3){back=p('M124 48Q104 21 135 17Q153 5 171 22Q199 29 180 55Z',hair,ink,.8)+cap;front=p('M98 122Q87 86 103 61Q127 39 156 42Q189 39 204 70Q212 95 200 123L193 110Q197 83 179 72Q162 92 141 83Q122 99 110 105L106 123Z',hair,ink,.7)+l('M114 68Q133 47 159 51','#fff0bd88',2);head=p('M99 72Q149 32 201 72L199 82Q151 43 101 83Z','#9bcee9','#6f9ebd',.7);}
 if(h===4){back=longHair;front=sweep;head=p('M72 76L149 24 228 76Q150 94 72 76Z','#b8955c','#7d6947',.9)+[93,115,137,159,181,203].map(x=>l(`M149 28L${x} 80`,'#d7bb83',.8)).join('')+l('M81 76Q151 90 220 76','#7d6947',2);}
 if(h===5){back=longHair+p('M183 71Q224 67 220 112Q239 140 222 163Q241 194 217 216Q230 249 201 282L190 268Q207 239 195 218Q217 190 199 167Q216 139 199 116Z',hair,ink,.7);front=p('M98 125Q82 96 97 64Q108 37 149 41Q186 29 204 61Q214 80 201 104L190 93Q185 73 168 75Q154 107 110 110L105 129Z',hair,ink,.7)+p('M104 71Q119 42 159 49Q165 63 141 75Q117 81 112 97Z',shadeColor(hair,1.17),'none')+l('M112 67Q130 48 154 54','#ffffff44',2);}
 if(h===6){back=p('M97 83Q96 39 151 39Q204 39 204 84L207 269 190 279 190 266 179 278 118 276 103 284Z',hair,ink,.8)+p('M178 92H188L191 274 181 275Z','#d25c9f','none')+p('M188 92H196L201 271 193 275Z','#9464b6','none');front=p('M98 122Q87 80 106 57Q128 36 153 40Q187 39 202 67Q211 93 201 124L193 117 190 88 180 99 178 88 164 100 161 90 146 99 143 89 129 99 126 88 111 101 106 123Z',hair,ink,.7)+p('M168 45L178 48 179 96 169 98Z','#d25c9f','none')+p('M178 48L185 53 189 93 181 98Z','#9464b6','none');}
 if(h===7){back=cap+p('M177 70Q218 64 219 106Q232 139 213 165Q227 195 211 220L214 259 201 278 194 260Q181 233 195 210Q181 188 195 164Q181 145 194 119Z',hair,ink,.7)+l('M201 117Q217 142 201 166Q216 192 202 216','#fff2ba66',1.5);front=sweep;head=p('M75 67Q91 60 102 63L109 37Q131 25 150 34Q172 25 192 37L198 63Q215 59 226 68Q213 86 150 84Q88 84 75 67Z','#c59b66','#8b6b4c',.8)+p('M103 60Q151 70 198 60V68Q150 79 102 68Z','#9a7049','#805d43',.6);}
 if(h===8){back=p('M98 84Q95 40 151 40Q203 40 204 86L218 215 202 203 207 231 188 216 181 236 164 220 122 228 107 240 104 215 87 228Z',hair,ink,.8);front=p('M98 127Q82 92 96 66Q110 40 143 41L158 31 160 40Q194 38 208 70L203 90 210 98 197 130 190 106 178 79 154 101 157 88 128 109 134 93 108 113 105 132Z',hair,ink,.8);if(s.hairColor===10){back+=p('M102 113L114 124 126 222 112 232Z','#69b38b','none')+p('M189 100L200 110 208 220 193 218Z','#8b68b5','none');front+=p('M98 72Q104 45 142 43L150 47Q128 62 110 89Z','#df686a','none')+p('M111 87Q127 61 151 47L165 47Q146 76 124 98Z','#e4a45e','none')+p('M126 96Q149 69 165 47L177 52Q163 83 144 101Z','#edce65','none')+p('M176 53Q193 60 199 79L190 95 178 79 163 94Z','#72b689','none');}}
 if(h===9){back=longHair+p('M188 91Q224 90 219 125Q207 142 216 160Q233 185 212 200Q192 214 207 232Q216 255 194 264Q181 261 184 245Q188 235 195 242Q192 220 180 205Q175 180 193 164Q204 151 194 135Z',hair,ink,.8);front=p('M98 126Q83 90 101 61Q122 33 159 40Q188 34 202 58Q213 80 190 95Q175 102 160 91Q181 93 184 80Q185 62 164 68Q139 101 109 110L105 129Z',hair,ink,.7)+l('M113 67Q132 47 160 48Q186 43 196 64','#d3b5ef66',2);}
 if(h===10){back=p('M97 58Q79 34 108 30Q122 10 144 29Q170 10 187 33Q217 25 216 55Q242 66 222 91Q243 112 222 135Q242 159 219 178Q241 202 218 223Q230 250 202 263Q192 284 173 268L125 273Q101 291 94 262Q70 250 86 226Q63 204 85 182Q63 159 85 138Q67 115 86 94Q67 71 97 58Z',hair,ink,.8)+m(l('M91 113Q107 110 103 127Q96 139 88 130M90 180Q110 175 106 194M100 234Q119 230 113 247','#ffffff33',1.5));front=p('M98 126Q81 100 99 80Q82 62 110 52Q114 28 141 42Q160 28 177 45Q203 36 207 64Q219 88 196 99Q175 106 162 90Q143 106 126 95Q108 106 105 127Z',hair,ink,.7)+l('M113 65Q107 49 123 49Q143 49 132 68Q122 78 117 69','#ffffff44',1.6);}
 if(h===11){back=longHair;front=p('M98 124Q86 87 101 62Q121 34 155 41Q189 38 204 67Q213 94 202 127L193 114Q194 87 181 76Q166 110 127 119L137 104 110 116 105 131Z',hair,ink,.7)+p('M99 101Q88 133 104 153Q94 183 112 203Q105 174 117 153L115 110Z',hair,ink,.5)+l('M112 75Q133 50 163 52','#fff1f566',2);}
 out.hairBack=back;out.hairFront=front;out.headwear=head;
 }
 return out;
}

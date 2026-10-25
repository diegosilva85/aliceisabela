// Shared body coordinates keep every sleeve, waistband and shoe on the same figure.
let avatarSerial=0;
function avatar(s=look,interactive=false){
 const selected={...s};s={...s,top:s.top%4,skirt:s.skirt%4,shoes:s.shoes%4,hair:s.hair%4};
 const id='doll'+(++avatarSerial),skin=skinColors[s.skin],hair=hairColors[s.hairColor],eye=eyeColors[s.eyes],lip=lipColors[s.lip];
 const url=n=>`url(#${id}-${n})`;
 const path=(d,fill,stroke='#514050',width=1.1,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
 const line=(d,color='#514050',width=1,extra='')=>path(d,'none',color,width,extra);
 const mirror=markup=>markup+`<g transform="translate(300 0) scale(-1 1)">${markup}</g>`;
 const flower=(x,y,r=3)=>`<g transform="translate(${x} ${y})" fill="#fff4eb">${[0,72,144,216,288].map(a=>`<ellipse cy="-${r}" rx="${r*.65}" ry="${r}" transform="rotate(${a})"/>`).join('')}<circle r="${r*.65}" fill="#d6ad68"/></g>`;
 const star=(x,y,r=5)=>`<path transform="translate(${x} ${y})" d="M0 ${-r}L${r*.3} ${-r*.3} ${r} 0 ${r*.3} ${r*.3} 0 ${r} ${-r*.3} ${r*.3} ${-r} 0 ${-r*.3} ${-r*.3}Z" fill="#f5d58b"/>`;
 const gradient=(name,stops)=>`<linearGradient id="${id}-${name}" x1="0" y1="0" x2="1" y2="1">${stops.map(([offset,color])=>`<stop offset="${offset}" stop-color="${color}"/>`).join('')}</linearGradient>`;
 const defs=`<defs>${gradient('skin',[['0%',skin],['65%',skin],['100%',['#e6b39d','#c98b61','#9c6246','#58342c','#d5a080','#b67951','#86523b','#704330'][s.skin]]])}${gradient('hair',[['0%',hair],['40%',hair],['75%',['#966643','#4a3a50','#f1cc75','#d47648','#b193e0','#ef94b6'][s.hairColor]],['100%',hair]])}${gradient('iris',[['0%','#302a3d'],['40%',eye],['100%',eye]])}${gradient('top',[['0%',['#fffdf6','#f7d8e4','#c1dbe6','#d6bfea'][s.top]],['100%',['#e4d9d3','#d79bb5','#789eb6','#9a75b8'][s.top]]])}${gradient('skirt',[['0%',['#9cb5ce','#f9dfe9','#9ac7ba','#ddc8f1'][s.skirt]],['100%',['#597f9f','#d69cbb','#5d9686','#ad86cd'][s.skirt]]])}<radialGradient id="${id}-blush"><stop stop-color="#ee869c" stop-opacity=".5"/><stop offset="1" stop-color="#ee869c" stop-opacity="0"/></radialGradient></defs>`;
 const hairBack=[
  path('M100 122Q87 77 108 54Q135 28 170 43Q207 51 205 109L211 227Q212 251 195 267L190 244 180 265 170 246 125 252 112 266Q90 245 94 213Z',url('hair'))+mirror(line('M102 135Q108 205 102 240M111 160Q119 216 113 249',hair,1.5)),
  path('M98 91Q79 71 102 55Q101 34 127 39Q146 20 164 37Q197 28 200 52Q223 58 212 85Q234 102 219 125Q236 141 219 162Q235 189 216 202Q229 231 204 239Q204 264 182 255L121 256Q94 265 96 241Q71 229 85 207Q64 188 82 167Q62 144 81 126Q64 100 98 91Z',url('hair'))+mirror(line('M99 63Q85 80 103 89Q84 104 101 120Q84 139 99 155Q83 176 100 190Q84 216 104 227Q99 244 115 244',hair,2)),
  mirror(path('M105 61Q79 71 75 51Q68 29 90 24Q111 19 119 42Z',url('hair'))+line('M82 36Q100 24 107 46M80 45Q98 34 107 51',hair,1.2))+path('M99 139Q85 106 96 73Q102 42 149 41Q197 40 204 76Q218 112 200 144L186 170 113 169Z',url('hair')),
  path('M98 142Q84 120 92 82Q100 39 149 40Q197 38 207 81Q219 125 204 161L188 185 185 163 171 177 126 176 111 185Z',url('hair'))+mirror(line('M97 101Q92 137 109 164M105 125L114 163',hair,1.1))
 ][s.hair];
 // Arms are continuous closed shapes, drawn underneath sleeves (no triangular gaps).
 const arm=path('M117 198Q102 198 97 217L87 254 78 289Q74 296 75 306L78 315Q81 320 84 316L85 307Q86 319 90 316L92 302Q98 306 98 300L96 288 107 258 122 221Z',url('skin'),'#a16d60',.8)+line('M81 298L80 310M87 295L85 307','#a16d60',.65);
 const legs=mirror(path('M119 326Q113 353 118 390L122 452 120 466Q127 472 138 468L139 451 143 391 147 330Z',url('skin'),'#a16d60',.9)+path('M123 355Q121 391 128 444L125 460 121 465 122 452 118 390 118 352Z','#89584733','none')+line('M125 393Q131 396 136 393','#a16d60',.7));
 const neck=path('M137 164L136 190 118 199Q150 222 182 199L164 190 163 164Z',url('skin'),'#a16d60',.9)+path('M137 169Q150 182 163 169L163 183Q150 192 137 184Z','#955c4733','none');
 const face=mirror(path('M103 119Q89 111 94 133Q97 144 106 140Z',url('skin'),'#a16d60',.8)+line('M99 124Q95 127 101 134','#a16d60',1))+path('M103 89Q104 58 150 58Q196 58 197 89L193 137Q190 157 174 166Q162 175 150 176Q128 173 113 154Q105 143 105 129Z',url('skin'),'#815348',1)+path('M106 105L108 139Q114 160 150 179Q121 172 113 154Q105 143 105 129Z','#ad6e5322','none');
 // Eye shapes clip the iris; no lower-lid stroke or under-eye shadow.
 const expression=s.eyeExpression||0,mouth=s.mouthExpression||0;
 const eyeShapes=[
  'M110 120Q121 107 140 119Q136 134 125 134Q114 133 110 120Z',
  'M110 122Q123 107 140 121Q134 133 124 132Q115 132 110 122Z',
  'M110 119Q123 112 140 116Q138 135 126 136Q114 134 110 119Z',
  'M109 118Q123 102 141 117Q139 137 125 138Q111 135 109 118Z',
  'M110 117Q122 103 140 116Q140 138 125 138Q111 137 110 117Z',
  'M110 118Q123 104 140 118Q138 137 125 137Q112 134 110 118Z',
  'M110 120Q121 107 140 119Q136 134 125 134Q114 133 110 120Z',
  'M110 120Q124 125 140 117Q136 135 126 135Q115 133 110 120Z'
 ];
 const brows=[
  'M112 105Q124 100 137 105', 'M112 104Q123 97 137 102',
  'M112 108Q124 107 138 100', 'M111 100Q122 92 137 98',
  'M111 104Q126 105 138 96', 'M112 100Q124 93 137 99',
  'M112 104Q124 98 137 103', 'M111 102Q123 102 138 111'
 ];
 const oneEye=(wink=false,side="left")=>{
  if(wink)return line('M111 123Q125 114 139 124','#49313e',2.4)+line('M112 122L108 119','#49313e',1.5)+line(brows[expression],hair,1.7);
  const shape=eyeShapes[expression],eyeClip=id+'-eye-'+side;
  return `<defs><clipPath id="${eyeClip}"><path d="${shape}"/></clipPath></defs>`+
   path(shape,'#fffaf7','none')+`<g clip-path="url(#${eyeClip})"><ellipse cx="126" cy="122" rx="9.1" ry="12.4" fill="${url('iris')}"/><ellipse cx="126" cy="121" rx="4" ry="8.8" fill="#2d2634"/><path d="M120 129Q126 135 133 128" stroke="${eye}" stroke-width="2.5" fill="none"/><ellipse cx="123" cy="115" rx="3.2" ry="4.1" fill="white"/><circle cx="131" cy="128" r="1.8" fill="#fff9e6"/>${expression===3?star(126,123,4):''}</g>`+
   line(shape.split('Q')[0]+'Q'+shape.split('Q')[1],'#49313e',2.1)+
   line('M111 119L107 115M114 115L111 111','#49313e',1.3)+line(brows[expression],hair,1.8);
 };
 const eyes=expression===1?mirror(oneEye(true)):expression===6?oneEye()+`<g transform="translate(300 0) scale(-1 1)">${oneEye(true)}</g>`:oneEye()+`<g transform="translate(300 0) scale(-1 1)">${oneEye(false,"right")}</g>`;
 const mouthShapes=[
  path('M139 155Q145 151 150 154Q155 151 162 154Q151 166 139 155Z',lip,'none')+line('M141 155Q151 158 160 154','#9c5665',.7)+line('M148 160L154 159','#ffe7df',1),
  path('M138 153Q151 161 164 152Q161 170 150 170Q141 168 138 153Z',lip,'none')+path('M141 156Q151 161 161 155Q158 166 151 166Q145 165 141 156Z','#783e50','none')+path('M141 156Q151 160 161 155L158 160Q150 163 143 159Z','#fffaf5','none'),
  path('M139 159Q150 147 162 159Q150 154 139 159Z',lip,'none')+line('M141 157Q150 150 160 157','#9c5665',.8),
  path('M136 152Q151 160 165 151Q164 174 150 175Q137 172 136 152Z',lip,'none')+path('M139 155Q151 161 162 154Q161 171 150 171Q140 170 139 155Z','#713c50','none')+path('M139 155Q151 159 162 154L159 160Q151 164 142 160Z','#fff9f2','none')+path('M143 168Q150 162 158 167Q151 176 143 168Z','#eb8d9f','none'),
  path('M141 160Q143 151 150 152Q158 151 161 161Q150 157 141 160Z',lip,'none')+line('M144 158Q151 156 158 159','#713c50',1.5),
  `<ellipse cx="151" cy="159" rx="6" ry="8" fill="${lip}"/><ellipse cx="151" cy="158" rx="3.7" ry="5.3" fill="#713c50"/>`,
  path('M146 151Q154 148 157 154L152 156 157 158Q151 165 145 160L149 156Z',lip,'none')+line('M149 155L153 156 149 158','#995165',.7),
  path('M139 157Q149 159 162 154Q155 163 145 161Z',lip,'none')+line('M140 157Q150 159 161 154','#9c5665',.8)
 ];
 const facialDetails=`<ellipse cx="116" cy="145" rx="10" ry="5" fill="${url('blush')}" opacity=".5"/><ellipse cx="184" cy="145" rx="10" ry="5" fill="${url('blush')}" opacity=".5"/>${path('M147 136Q143 143 151 145Q156 143 153 141',skin,'none')}${line('M147 143Q151 146 154 143','#b27c69',.65)}${mouthShapes[mouth]}`;
 // Lateral locks sit behind the crown, with the same solid base at the join.
 // They stop outside the eyes instead of crossing them as detached triangles.
 const sideLocks=mirror(path([
  'M100 85Q90 119 100 151Q102 169 112 180Q102 149 107 125L116 90Z',
  'M100 85Q88 105 96 122Q89 141 102 155Q94 174 111 187Q103 171 111 157Q100 139 109 124L116 91Z',
  'M100 85Q92 108 99 135Q102 148 111 156Q103 137 107 117L116 89Z',
  'M100 85Q90 120 104 153L113 164Q107 146 108 127L117 91Z'
 ][s.hair],hair,'none')+line('M100 112Q98 139 106 155',hair,.6));
 const fringe=path('M97 114Q87 84 100 63Q112 40 143 41Q177 37 195 62Q211 83 203 116L193 110Q194 87 181 72Q169 94 143 103Q154 91 158 78Q136 102 108 112L106 104 105 119Z',hair,hair,.7)+
  path('M105 83Q111 52 143 49Q162 44 178 54Q143 50 131 76L113 101Z','#ffffff','none',0,'opacity=".10"')+
  path('M178 54Q196 69 198 94L193 105Q192 78 178 63Z','#ffffff','none',0,'opacity=".10"')+
  line('M160 54Q152 80 126 98M178 61Q170 85 151 97',hair,1.1)+
  line('M116 70Q127 55 145 53','#fff',1.5,'opacity=".14"');
 const sleeveShort='M118 197Q102 198 97 217L93 232Q103 241 116 239L123 215Z';
 const sleevePuff='M119 195Q100 192 94 212Q90 223 94 235Q105 242 118 238L124 216Z';
 const sleeveLong='M118 198Q102 198 97 217L87 254 79 284Q86 293 98 290L108 259 123 218Z';
 const sleeves=mirror(path(s.top===2?sleeveLong:s.top===1||s.top===3?sleevePuff:sleeveShort,url('top'),'#8a7083',1)+
  (s.top===2?path('M79 283Q89 290 99 286L97 297Q84 298 77 290Z','#ebeff2','#8a7083',.8)+line('M97 214L86 280','#edf7fa',3):line('M95 232Q105 239 117 235','#8a7083',.8))+
  (s.top===1||s.top===3?line('M103 203Q98 216 102 228M115 204Q109 217 114 230','#fff5fa',1.1,'opacity=".65"'):''));
 const bodice=path('M118 197L136 190Q150 205 164 190L182 197Q179 218 179 237L181 279Q150 285 119 279L121 237Q121 216 118 197Z',url('top'),'#8a7083',1.05);
 const topDetail=[
  line('M135 193Q150 211 165 193','#d0b4c6',3)+path('M146 231Q132 215 129 231Q127 240 146 250Q164 238 162 230Q157 218 146 231Z','#bca1cb','#9d82b2',.65)+line('M125 263L127 274M174 260L171 275','#c9b8bf',.85)+line('M121 276Q150 282 179 276','#fdf7f1',2),
  path('M135 190L150 202Q140 219 126 207ZM165 190L150 202Q160 219 174 207Z','#fff6f6','#d4a7bb',.75)+path('M150 205Q132 194 137 213L150 208Q168 194 163 213Z','#b7779a','#a76b90',.6)+[223,237,251,265].map(y=>`<circle cx="150" cy="${y}" r="1.5" fill="#a87594"/>`).join('')+line('M125 218Q130 247 125 271M175 218Q169 247 175 271','#b981a1',.7),
  path('M135 190L149 201 140 213 131 196M165 190L151 201 160 213 169 196','#f8f5f5','#8b9fab',.8)+line('M150 202V279','#f4f4f6',3)+line('M150 205V279','#7790a0',.75)+path('M125 246L140 250 137 265 124 261M175 246L160 250 163 265 176 261','#acc8d7','#7b9aaa',.9)+path('M120 271Q150 275 180 271L181 280Q150 286 119 280Z','#e4e8ee','#8a9aac',.8)+star(165,225,5),
  path('M135 191Q150 207 165 191L170 196Q150 215 130 196Z','#f1e4f5','#af8dc3',.7)+line('M124 219Q130 246 124 269M176 219Q170 246 176 269','#9d7db4',.75)+[127,140,153,166,176].map((x,i)=>star(x,230+(i%2)*15,2.2)).join('')
 ][s.top];
 const hems=['M120 275H180L196 350Q176 356 150 352Q126 358 104 350Z','M120 275H180Q186 309 204 350Q150 375 96 350Q113 308 120 275Z','M120 275H180L199 347Q150 364 101 347Z','M120 275H180Q190 311 214 352Q200 365 187 360Q169 373 151 366Q132 374 113 363Q99 368 86 354Q109 309 120 275Z'];
 const skirtBase=path(hems[s.skirt],url('skirt'),'#8a7083',1);
 const skirtDetail=[
  line('M149 282V349M154 282V349M120 291Q121 310 138 305M180 291Q179 310 163 305','#d6e6ef',1.2)+line('M108 345Q129 352 150 347Q175 352 192 345','#d6e6ef',1.2)+`<circle cx="151" cy="281" r="2" fill="#c6a15f"/>`+path('M169 323L184 321 187 338 171 340Z','#a3bcd0','#6a8aa7',.7)+star(178,331,3),
  line('M128 287Q127 318 113 347M144 286L139 356M158 286L163 356M172 287Q176 317 189 347','#c190ac',.8)+[[126,304],[165,304],[145,325],[182,337],[116,340],[155,353]].map(([x,y])=>flower(x,y,2.8)).join('')+line('M99 348Q150 370 201 348','#fff7f8',3),
  [117,133,150,167,183].map((x,i)=>path(`M${128+i*11} 284L${x} 350L${x+5} 351Z`,'#477d702b','none')).join('')+line('M105 341Q150 356 195 341','#ecf6ef',3)+line('M104 347Q150 362 197 347','#ecf6ef',1.3),
  path('M121 283H179L202 344Q151 365 97 344Z','#e9d6f0aa','#c4a1d8',.6)+[112,127,142,158,174,190].map((x,i)=>line(`M${127+i*9} 286Q${x} 321 ${x} 355`,'#fff3fc',1.3,'opacity=".65"')).join('')+line('M90 352Q112 365 132 360Q151 370 171 360Q191 365 210 352','#fff2fa',1.5)+[[109,339],[132,314],[163,333],[185,345],[151,350]].map(([x,y])=>star(x,y,2.1)).join('')
 ][s.skirt];
 const waistband=path('M120 274Q150 278 180 274L181 284Q150 288 119 284Z',s.skirt===0?'#7296b5':s.skirt===2?'#588e80':'#d7accd','#8a7083',.8)+(s.skirt===1||s.skirt===3?path('M150 280Q130 266 134 288L150 283Q171 267 166 288ZM147 285L139 299 151 295 159 301 154 285','#f8e2ee','#c18eaf',.7):'');
 const shoe= [
  path('M122 442H140L140 464 119 465Z','#fff8f4','#ae9aa4',.7)+line('M123 450H139','#d4b0d1',3)+path('M121 459L138 460 141 477Q124 487 105 482Q100 476 110 471Z','#fbf6f4','#8a7083',1)+path('M105 478Q120 484 140 475L141 482Q124 489 106 485Z','#c2a1d0','#8a7083',.7)+line('M116 468L132 465M113 472L132 469M111 475L132 473','#b79ac7',1.5),
  path('M121 464Q128 474 139 464L141 480Q126 487 107 482Q102 476 112 472Z','#d591b1','#986781',1)+path('M120 469Q105 462 112 478L122 473Q136 459 133 475Z','#f1b9cf','#b8819b',.7)+line('M108 480Q123 486 140 478','#b47d99',1),
  path('M122 439H139V463H120Z','#f7f2ec','#8a9a94',.7)+line('M122 447H139M122 451H139','#75a193',2)+path('M121 459L138 459 142 480Q121 489 102 481Q101 476 112 470Z','#d2e7dd','#66887b',1)+path('M104 478Q123 483 141 474L143 483Q124 491 103 485Z','#f9f6ef','#66887b',.8)+path('M114 469L125 465 136 473 128 477Z','#76a596','#66887b',.65)+line('M117 469L131 468M114 473L132 472','#fff',1.6),
  path('M121 462Q129 467 139 463L141 479Q121 487 105 482Q102 476 113 470Z',url('skin'),'#a16d60',.7)+path('M108 477Q121 483 140 475L141 482Q120 490 106 484Z','#bd9554','#9c7744',.8)+line('M121 456L138 470M138 456L120 473','#d7b06a',4)+line('M111 473Q123 480 136 474','#d7b06a',4)+`<rect x="131" y="458" width="6" height="5" rx="1" fill="#ffe7a7" stroke="#a9884d" stroke-width=".8"/>`
 ][s.shoes];
 const earrings=mirror(`<circle cx="100" cy="141" r="1.7" fill="#d9b569"/>`+[
 `<circle cx="100" cy="145" r="3.5" fill="#fff4df" stroke="#bca682" stroke-width=".7"/><circle cx="99" cy="144" r="1.3" fill="white"/>`,
 line('M100 143V148','#c8a458',1)+path('M100 150Q92 142 92 150Q92 155 100 160Q108 155 108 150Q108 142 100 150Z','#d997b6','#a46b8e',.7),
 line('M100 143V151','#c8a458',1)+star(100,154,6),
 `<ellipse cx="100" cy="150" rx="5" ry="8" fill="none" stroke="#a78242" stroke-width="2.7"/><path d="M98 143Q92 149 98 156" fill="none" stroke="#ffe5a5" stroke-width="1.1"/>`
 ][s.earrings]);
 const necklaces=s.necklace===0?'':line('M136 192Q150 220 164 192','#bf9959',1.1)+(s.necklace===1?path('M150 210Q141 201 141 209Q141 215 150 221Q159 215 159 209Q159 201 150 210Z','#e7a4bd','#bf9959',.7):s.necklace===2?[0,1,2,3,4,5,6].map((n)=>`<circle cx="${137+n*4.3}" cy="${196+Math.sin(n/6*Math.PI)*12}" r="2.6" fill="${['#ecb8c8','#f7d99f','#badbcf'][n%3]}" stroke="#b39892" stroke-width=".4"/>`).join(''):star(150,213,6));
 const extra=wardrobeArt(selected,{path,line,mirror,star,flower,hair,url});
 const bags=extra.bag;
 const hit=(part,label,shape)=>interactive?`<g class="face-hit" role="button" tabindex="0" aria-label="${label}" data-face="${part}"><title>${label}</title>${shape}</g>`:'';
 return `<svg class="girl anime-girl" viewBox="${faceZoom&&interactive?'65 23 175 190':'0 0 300 510'}" xmlns="http://www.w3.org/2000/svg" role="${interactive?'group':'img'}" aria-label="Menina em estilo anime com o visual escolhido">${defs}<ellipse cx="150" cy="490" rx="65" ry="7" fill="#bba0ba" opacity=".15"/>${extra.hairBack??hairBack}${legs}${extra.bagBack}${mirror(arm)}${neck}${extra.top??(sleeves+bodice+topDetail)}${extra.bottom??(skirtBase+skirtDetail+waistband)}${extra.shoes??mirror(shoe)}${face}${eyes}${facialDetails}${extra.hairFront??(sideLocks+fringe)}${extra.headwear||''}${earrings}${necklaces}${bags}${hit('hair','Mudar o cabelo','<path d="M85 97V24H215V97Z"/>')}${hit('eyeExpression','Mudar a expressão dos olhos','<rect x="108" y="103" width="84" height="39" rx="8"/>')}${hit('mouthExpression','Mudar a expressão da boca','<rect x="132" y="147" width="37" height="23" rx="10"/>')}${hit('earrings','Mudar os brincos','<rect x="88" y="135" width="20" height="30"/><rect x="192" y="135" width="20" height="30"/>')}</svg>`;
}

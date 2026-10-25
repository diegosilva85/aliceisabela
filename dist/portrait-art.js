// Face shape and emotion are independent choices. No feature is tied to a skin tone.
function animeEye(s,{id,side,wink,path:p,line:l,hair,eye,url,star,brow}){
 const styles=[null,{x:109,y:120,w:32,up:24,down:29,iris:10,lash:2.3}, {x:109,y:121,w:32,up:12,down:18,iris:8,lash:1.7}, {x:108,y:121,w:34,up:10,down:14,iris:7,lash:2.1}, {x:112,y:118,w:28,up:24,down:31,iris:11,lash:1.6}, {x:108,y:117,w:33,up:16,down:22,iris:8.5,lash:2.6}, {x:112,y:122,w:27,up:13,down:15,iris:7.5,lash:1.1}, {x:109,y:120,w:32,up:18,down:24,iris:9.5,lash:3}];
 const a=styles[s.eyeStyle],e=s.eyeExpression||0,x=a.x,y=a.y,w=a.w,cx=x+w*.54;
 const brows=l(brow,hair,s.eyeStyle===7?2.2:1.6);
 if(wink)return l(`M${x} ${y+2}Q${cx} ${y-10} ${x+w} ${y+2}`,'#49313e',a.lash)+l(`M${x+2} ${y}L${x-3} ${y-3}`,'#49313e',1.1)+brows;
 const up=a.up*(e===7?.35:e===2?.5:e===3||e===4||e===5?1.18:1),down=a.down*(e===3||e===4?1.1:1);
 const endY=y+(s.eyeStyle===5?5:0)-(e===2?4:0);
 const top=`M${x} ${y}Q${cx-3} ${y-up} ${x+w} ${endY}`;
 const shape=top+`Q${cx+4} ${y+down} ${x} ${y}Z`,clip=id+'-styled-'+side;
 const ry=Math.min(15,a.down*.58),iris=a.iris*(e===4?.8:1);
 return `<defs><clipPath id="${clip}"><path d="${shape}"/></clipPath></defs>`+p(shape,'#fffaf6','none')+`<g clip-path="url(#${clip})"><ellipse cx="${cx}" cy="${y+2}" rx="${iris}" ry="${ry}" fill="${url('iris')}"/><ellipse cx="${cx}" cy="${y}" rx="${iris*.43}" ry="${ry*.7}" fill="#292336"/>`+l(`M${cx-iris*.65} ${y+ry*.65}Q${cx} ${y+ry} ${cx+iris*.7} ${y+ry*.6}`,eye,2.5)+`<ellipse cx="${cx-3}" cy="${y-6}" rx="${s.eyeStyle===1?3.8:2.7}" ry="${s.eyeStyle===1?5:3.2}" fill="white"/><circle cx="${cx+4}" cy="${y+8}" r="${s.eyeStyle===6?1:2}" fill="#fff9e3"/>${s.eyeStyle===1?'<circle cx="'+(cx+5)+'" cy="'+(y-3)+'" r="1.5" fill="white"/>':''}${e===3?star(cx,y+2,4):''}</g>`+l(top,'#49313e',a.lash)+l(`M${x+3} ${y-3}L${x-3} ${y-7}`,'#49313e',a.lash*.7)+(s.eyeStyle===1||s.eyeStyle===5||s.eyeStyle===7?l(`M${x+6} ${y-6}L${x+3} ${y-11}M${x+1} ${y}L${x-5} ${y-2}`,'#49313e',1.1):'')+brows;
}
function animeMouth(s,{path:p,line:l,lip}){
 // Width, upper fullness, lower fullness and cupid's bow describe the drawing.
 const shapes=[null,[11,1.5,3,.5],[12,5,5,2.5],[14,6,8,1.2],[13,3,8,1],[13,6,4,1.3],[17,3,5,.8],[8,4,5,.5]],a=shapes[s.mouthStyle],w=a[0],u=a[1],d=a[2],bow=a[3],e=s.mouthExpression||0;
 let top,bottom,inner='',detail='';const x=150,y=156,L=x-w,R=x+w;
 if(e===5){return `<ellipse cx="150" cy="157" rx="${w*.48}" ry="${5+d*.45}" fill="${lip}"/><ellipse cx="150" cy="156" rx="${w*.25}" ry="4.5" fill="#713c50"/>`;}
 if(e===6){return p(`M${x-4} ${y-4}Q${x+4} ${y-u-5} ${x+7} ${y-2}L${x+2} ${y} ${x+7} ${y+3}Q${x+2} ${y+d+3} ${x-5} ${y+4}L${x-1} ${y}Z`,lip,'none')+l('M149 155L153 157 149 159','#84445b',.7);}
 if(e===2||e===4){const lift=e===2?5:2;top=`M${L} ${y+2}Q${x-w*.5} ${y-lift-u} ${x} ${y-lift}Q${x+w*.5} ${y-lift-u} ${R} ${y+2}`;bottom=`Q${x} ${y-lift+d*.5} ${L} ${y+2}Z`;detail=l(`M${L+2} ${y+1}Q${x} ${y-lift-1} ${R-2} ${y+1}`,'#88495c',.7);}
 else if(e===1||e===3){const open=e===3?13:8;top=`M${L} ${y-3}Q${x} ${y+3} ${R} ${y-3}`;bottom=`Q${x+w*.7} ${y+open+d} ${x} ${y+open+d}Q${x-w*.7} ${y+open+d} ${L} ${y-3}Z`;inner=p(`M${L+2} ${y-1}Q${x} ${y+4} ${R-2} ${y-1}Q${x+w*.6} ${y+open} ${x} ${y+open}Q${x-w*.6} ${y+open} ${L+2} ${y-1}Z`,'#713c50','none')+p(`M${L+2} ${y-1}Q${x} ${y+3} ${R-2} ${y-1}L${R-5} ${y+3}Q${x} ${y+6} ${L+5} ${y+3}Z`,'#fff8f1','none');if(e===3)inner+=p(`M${x-6} ${y+10}Q${x} ${y+5} ${x+6} ${y+10}Q${x} ${y+15} ${x-6} ${y+10}Z`,'#ed91a7','none');}
 else {const skew=e===7?3:0;top=`M${L} ${y}Q${x-w*.45} ${y-u-2} ${x} ${y-bow}Q${x+w*.45} ${y-u-2} ${R} ${y-skew}`;bottom=`Q${x+w*.5} ${y+d+1} ${x} ${y+d}Q${x-w*.5} ${y+d+1} ${L} ${y}Z`;detail=l(`M${L+1} ${y}Q${x} ${y+2} ${R-1} ${y-skew}`,'#8f4e61',.65)+l(`M${x-3} ${y+d-1}L${x+3} ${y+d-1}`,'#ffe3df',.8);}
 return p(top+bottom,lip,'none')+inner+detail;
}
function portraitHair(s,{path:p,line:l,mirror:m,hair,url}){
 if(s.hair<9||s.hair>14)return {};
 const n=s.hair-9,ink='#584353',shine='#ffffff30',base=url('hair');let back='',front='';
 const cap=p('M99 128Q85 97 98 66Q108 38 150 39Q191 38 202 68Q215 102 201 132L188 145 112 145Z',base,ink,.8);
 const sweep=p('M98 119Q87 83 102 61Q122 35 153 41Q187 39 202 67Q213 94 201 121L194 111Q194 85 181 73Q153 103 110 105L105 122Z',hair,ink,.7)+l('M114 68Q140 48 166 54',shine,2);
 const braid=(x,y,len)=>Array.from({length:len},(_,i)=>p(`M${x} ${y+i*11}Q${x-8} ${y+i*11+1} ${x-5} ${y+i*11+9}Q${x+2} ${y+i*11+16} ${x+7} ${y+i*11+6}Q${x+8} ${y+i*11} ${x} ${y+i*11}Z`,hair,ink,.6)+l(`M${x-4} ${y+i*11+3}L${x+5} ${y+i*11+9}`,shine,.8)).join('');
 if(n===0){back=p('M80 153Q51 128 64 99Q47 68 78 55Q75 24 109 29Q129 5 151 24Q184 7 200 34Q234 28 233 62Q263 75 244 104Q258 136 232 151Q229 182 199 174L104 180Q76 186 80 153Z',base,ink,.9);front=p('M88 123Q74 99 91 85Q80 64 106 59Q110 38 132 49Q150 32 170 49Q196 39 200 61Q225 67 209 88Q222 107 203 125L194 110Q196 90 182 81Q170 96 153 85Q133 103 116 87Q103 101 107 123Z',hair,ink,.7)+[[90,67],[111,49],[144,42],[180,51],[209,74],[80,110],[219,111]].map(([x,y])=>l(`M${x-4} ${y+6}Q${x-10} ${y-2} ${x} ${y-4}Q${x+9} ${y} ${x+4} ${y+6}`,shine,1)).join('');}
 if(n===1){back=cap+m([95,82,70].map((x,i)=>braid(x,91+i*7,16-i)).join(''));front=p('M98 119Q89 81 105 59Q123 36 151 41Q182 38 198 61Q210 86 202 120L194 110Q194 90 180 72Q153 83 119 75Q104 93 106 121Z',hair,ink,.7)+[111,123,136,151,166,180,192].map((x,i)=>l(`M150 44Q${x} 48 ${x} ${i<3?82:88}`,shine,1.2)).join('')+m(braid(101,108,11)+l('M98 225L107 227','#d7b76f',3));}
 if(n===2){back=p('M98 85Q91 45 150 39Q213 39 202 92Q223 118 210 143Q225 167 210 193Q226 220 210 248Q214 272 192 286L194 263 180 277 170 262 126 272 111 284Q86 270 94 244Q79 219 93 194Q79 168 94 143Q80 115 98 85Z',base,ink,.8)+m(l('M98 110Q113 136 100 157Q89 179 103 199Q116 223 102 250',shine,2));front=sweep+m(p('M101 95Q93 117 103 135Q95 150 108 170Q102 143 111 131L112 99Z',hair,'none'));}
 if(n===3){back=cap;front=p('M98 132Q80 105 91 77L85 69 101 67Q102 43 132 43L141 33 151 40Q180 33 199 53L210 49 206 68Q219 89 203 130L192 139 195 104 181 75Q160 111 123 117L136 101 111 114 115 99 101 132Z',hair,ink,.8)+l('M111 72Q138 48 171 49M119 94Q149 84 171 64',shine,1.5);}
 if(n===4){back=cap+p('M180 46Q221 22 232 63Q244 98 221 123Q204 146 220 174Q242 201 223 230Q207 251 219 278Q190 267 192 241Q180 217 195 187Q208 166 192 141Q175 116 193 87Q204 66 180 66Z',base,ink,.8)+l('M218 63Q230 92 210 120Q194 149 211 177Q229 208 207 238',shine,2);front=p('M98 120Q87 80 106 57Q126 34 156 41Q188 40 203 68Q211 94 201 120L194 111Q195 86 180 72Q151 88 118 76Q105 91 106 121Z',hair,ink,.7)+m(l('M110 76Q112 53 145 47',shine,1.5))+p('M187 44L201 39 208 51 192 58Z','#d8a3ca',ink,.6);}
 if(n===5){back=p('M96 144Q83 94 99 64Q115 37 151 40Q192 38 205 73Q217 116 205 172Q183 184 171 176L128 178Q105 185 94 171Z',base,ink,.8)+m(l('M99 108L103 165',shine,1.8));front=p('M98 126Q87 80 106 57Q128 35 155 41Q188 40 201 67Q211 92 202 127L193 119 190 89 180 98 178 84 166 99 163 86 150 100 146 86 133 99 130 85 115 98 110 88 107 123Z',hair,ink,.7)+l('M111 66Q146 48 185 66',shine,2)+m(p('M101 97L111 98 108 164 101 170Z',hair,'none'));}
 return {hairBack:back,hairFront:front,headwear:''};
}

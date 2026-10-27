const assert=require('node:assert/strict'),fs=require('node:fs');global.window={};require('../dist/pokemon-data');const d=window.PokemonTableData;
assert.equal(d.cards.length,53);assert.equal(new Set(d.cards.map(c=>c.id)).size,53);
for(const c of d.cards){assert.ok(d.types[c.type]);for(const p of [c.art||c.id+'-art-v1.webp',d.types[c.type].iconCrop?.source||c.type+'-official.png',...(c.original?[c.original]:[])])assert.ok(fs.existsSync('dist/assets/pokemon-table/'+p),p);}
assert.equal(d.cards.find(c=>c.id==='pikachu').art,'pikachu-art-v2.webp');assert.equal(d.cards.find(c=>c.id==='glaceon').type,'water');assert.equal(d.cards.find(c=>c.id==='sylveon').type,'psychic');assert.equal(d.rulesConfirmed,true);
console.log('Pokémon: all 53 cards, local art, official icons and original comparisons OK');

for(const id of ['riolu','lucario','lugia','ho-oh','lapras','psyduck','gengar','zeraora','sprigatito','quaxly','fuecoco','piplup','torchic','snivy'])assert.ok(d.cards.some(c=>c.id===id),id);
for(const id of ['charmander','bulbasaur'])assert.equal(d.cards.find(c=>c.id===id).art,id+'-art-v2.webp');
for(const id of ['psyduck','riolu','sprigatito'])assert.equal(d.cards.find(c=>c.id===id).art,id+'-art-v3.webp');

for(const id of ['greninja','jigglypuff','ditto','meowth'])assert.ok(d.cards.some(c=>c.id===id));

for(const id of ['zorua', 'nickit', 'purrloin', 'mew', 'jirachi', 'espurr', 'dedenne', 'emolga', 'pachirisu']){const c=d.cards.find(c=>c.id===id);assert.ok(c);assert.ok(c.artCrop);assert.ok(c.artCrop.x+c.artCrop.width<=c.artCrop.sourceWidth);assert.ok(c.artCrop.y+c.artCrop.height<=c.artCrop.sourceHeight);}

for(const id of ["scizor", "scyther", "onix", "steelix", "togedemaru", "mawile", "tinkaton", "corviknight", "metagross", "solgaleo", "raikou", "entei", "suicune"]){const c=d.cards.find(c=>c.id===id);assert.ok(c,id);assert.ok(c.artCrop.x+c.artCrop.width<=600);assert.ok(c.artCrop.y+c.artCrop.height<=825);}

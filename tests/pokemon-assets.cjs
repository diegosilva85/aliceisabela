const assert=require('node:assert/strict'),fs=require('node:fs');global.window={};require('../dist/pokemon-data');const d=window.PokemonTableData;
assert.equal(d.cards.length,27);assert.equal(new Set(d.cards.map(c=>c.id)).size,27);
for(const c of d.cards){assert.ok(d.types[c.type]);for(const p of [c.art||c.id+'-art-v1.webp',c.type+'-official.png',...(c.original?[c.original]:[])])assert.ok(fs.existsSync('dist/assets/pokemon-table/'+p),p);}
assert.equal(d.cards.find(c=>c.id==='pikachu').art,'pikachu-art-v2.webp');assert.equal(d.cards.find(c=>c.id==='glaceon').type,'water');assert.equal(d.cards.find(c=>c.id==='sylveon').type,'psychic');assert.equal(d.rulesConfirmed,false);
console.log('Pokémon: all 27 cards, local art, official icons and original comparisons OK');

for(const id of ['riolu','lucario','lugia','ho-oh','lapras','psyduck','gengar','zeraora','sprigatito','quaxly','fuecoco','piplup','torchic','snivy'])assert.ok(d.cards.some(c=>c.id===id),id);
for(const id of ['charmander','bulbasaur'])assert.equal(d.cards.find(c=>c.id===id).art,id+'-art-v2.webp');

# Aventura dos Brinquedos

Jogo estático em português, sem instalação de dependências. Abra `dist/index.html` diretamente no navegador ou execute `python3 -m http.server 4173 --directory dist` nesta pasta.

## Primeira etapa
- Tela inicial responsiva e cinco quartos ilustrados: Andy, Buzz, Bonnie, Blaze e Molly.
- Procurar: cinco alvos entre doze fichas, pista, embaralhamento e comemoração.
- Montar e vestir: colocar fichas, arrastar com mouse/toque, mover com setas, escolher chapéu/roupa/cor, remover e salvar por quarto no armazenamento local.
- Catálogo pesquisável com filtro por filme e fontes por registro.

As fichas são provisórias. Não foram geradas imagens de brinquedos nesta etapa. As escolhas de roupas aparecem como texto; a troca visual depende dos futuros recortes e camadas. Os quartos são interpretações artísticas, não reconstruções exatas dos filmes. Buzz possui quarto temático imaginário. Blaze corresponde à menina do rancho do filme 5; Molly é a irmã de Andy.

## Arquivos e próxima etapa
`dist/catalog.js` contém 97 registros, incluindo coletivos e variantes. `dist/sources.json` documenta fontes e limites: não há garantia de todos os figurantes. Cada item tem `asset: null` e `pose: 'inert'`. Ao produzir os brinquedos, salvar PNG/WebP transparente em `dist/assets/toys/` e preencher `asset` com caminho relativo. No modo procurar, usar pose inerte de brinquedo diante de humanos: membros relaxados, sem gestos vivos, sem cenário e sem roupa alternativa embutida. Para vestir, preparar base e camadas alinhadas por personagem; a primeira versão guarda escolhas em `hat` e `clothes`.

`dist/assets/` preserva os cinco PNGs gerados pelo recurso integrado image_gen. `prompts.json` registra os prompts. Não usar as fichas como referência visual dos personagens. Progresso e quartos são locais a cada navegador; limpar dados do navegador os remove.

## Verificação
`node --check dist/app.js` e `node --check dist/catalog.js` validam sintaxe. A publicação usa `.openai/hosting.json`.

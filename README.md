# Jogos de Alice e Isabela

Jogos de navegador para brincar em família: procurar brinquedos, moda e estilo, memória e Pet Shop. O site é estático: o jogo e suas imagens estão em `dist/`, sem banco de dados ou instalação de Node.js para jogar. Preferências e progresso ficam no navegador de cada dispositivo.

## Raspberry Pi 4 com Docker

Use preferencialmente Raspberry Pi OS de **64 bits**. Instale Git, Docker Engine e o plugin Docker Compose conforme a [documentação oficial para Debian/arm64](https://docs.docker.com/engine/install/debian/). Para sistemas de 32 bits, consulte as [instruções específicas do Raspberry Pi OS](https://docs.docker.com/engine/install/raspberry-pi-os/).

Confira a instalação e habilite o Docker na inicialização:

```sh
git --version
sudo docker version
sudo docker compose version
sudo systemctl enable --now docker
```

Clone e inicie (a chave SSH do Pi precisa ter acesso ao repositório no GitHub):

```sh
git clone git@github.com:diegosilva85/aliceisabela.git
cd aliceisabela
sudo docker compose up -d --build
sudo docker compose ps
hostname -I
```

Após configurar DNS e roteador conforme a seção HTTPS abaixo, abra **https://aliceisabela.com.br**. O acesso direto na rede local continua em **http://IP-DO-RASPBERRY:8080**. No próprio Pi, use **http://localhost:8080**. O contêiner continua rodando após fechar o terminal e reinicia quando o Pi liga, desde que o serviço Docker esteja habilitado. Depois de uma parada manual com `down` ou `stop`, inicie novamente com `up -d`.

O Docker escolhe automaticamente a arquitetura do sistema. A [imagem oficial Nginx Alpine](https://hub.docker.com/_/nginx) usada no Dockerfile tem variantes `linux/arm64`, `linux/arm/v7` e `linux/amd64`; não é necessário usar emulação no Pi. A base está fixada pelo digest para builds reproduzíveis. Para atualizá-la, substitua o digest por um índice multi-arquitetura atual e reconstrua.

### Trocar a porta

```sh
cp .env.example .env
nano .env
sudo docker compose up -d
```

Altere `PORTA_JOGO=8080` para a porta desejada. O arquivo `.env` fica apenas no aparelho e não é enviado ao Git.

### Atualizar, acompanhar e parar

```sh
# Baixar mudanças e reconstruir
git pull --ff-only
sudo docker compose up -d --build

# Ver estado e logs
sudo docker compose ps
sudo docker compose logs --tail=100 -f

# Parar
sudo docker compose down
```

Os volumes `caddy_data` e `caddy_config` preservam os certificados e a configuração HTTPS. Não use `docker compose down -v` nas atualizações, pois isso apaga esses volumes. Não envie seu conteúdo ao Git. Os dados salvos no navegador pertencem ao endereço usado para acessar o jogo; o histórico do endereço Sites não é transferido automaticamente para o endereço do Pi.

## HTTPS em aliceisabela.com.br

O serviço `https` usa Caddy para emitir e renovar automaticamente o certificado e redirecionar HTTP para HTTPS. O Nginx continua servindo o jogo internamente em `jogos:8080`. Veja a [documentação do Caddy](https://caddyserver.com/docs/automatic-https).

### DNS no Registro.br

Na administração de **aliceisabela.com.br**, entre em **DNS → Configurar zona DNS**. Se aparecer apenas **Configurar endereçamento**, selecione **Modo avançado** e aguarde a transição indicada no painel. Esses controles estão descritos pelo [Registro.br](https://registro.br/tecnologia/caracteristicas-tecnicas/).

Crie uma entrada **A**, com **Nome vazio** (domínio raiz) e **Endereço IPv4 igual ao IP público da conexão do Raspberry**. Salve. Não use o IP local do Pi (`192.168.x.x` ou `10.x.x.x`). Você pode consultar o IP público no painel do roteador ou, no próprio Pi, com:

```sh
curl -4 https://api.ipify.org
```

Confira se esse IP é o mesmo IP WAN do roteador; se não for, pode haver outro roteador ou CGNAT. Se houver registro AAAA, ele também deve alcançar o Pi por IPv6. Não publique um AAAA sem configurar esse acesso. A configuração atual atende ao domínio **sem www**.

### Roteador e Raspberry

Reserve o IP local do Pi no DHCP e configure:

| Protocolo | Porta externa | Destino |
| --- | --- | --- |
| TCP | 80 | IP local do Pi, porta 80 |
| TCP | 443 | IP local do Pi, porta 443 |
| UDP (opcional, HTTP/3) | 443 | IP local do Pi, porta 443 |

O firewall também precisa permitir essas portas. Não use 8080 como destino dessas regras: ela é a porta direta do Nginx, sem TLS. Se já existe encaminhamento externo para 8080, ele não é necessário para HTTPS e pode ser removido; o acesso a 8080 continua disponível na rede local.

As portas 80 e 443 do Pi devem estar livres. Confira conflitos com `sudo ss -ltnp`. Após configurar DNS e roteador, execute na pasta que contém `compose.yaml`:

```sh
git pull --ff-only
sudo docker compose up -d --build
sudo docker compose ps
sudo docker compose logs --tail=100 -f https
```

Depois da propagação do DNS e com as portas acessíveis, o Caddy obtém o certificado. Abra **https://aliceisabela.com.br** usando os dados móveis do celular. A emissão pública só pode ser confirmada depois de executar a configuração no Raspberry; o teste local do proxy não comprova essa emissão.

O site não exige login; HTTPS protege a conexão. A publicação Sites e suas permissões são independentes desta instalação. Os dados do navegador salvos no IP local não migram automaticamente para o domínio HTTPS.

### Diagnóstico

- **`lookup acme-v02.api.letsencrypt.org ... network is unreachable`:** o contêiner não consegue alcançar o servidor DNS, antes mesmo de validar o domínio. O serviço `https` usa DNS IPv4 explícito para evitar herdar um DNS IPv6 inacessível da operadora. Após atualizar o repositório, aplique com `sudo docker compose up -d --force-recreate https`. A rede precisa permitir consultas DNS externas para 1.1.1.1 ou 8.8.8.8.
- **Domínio não encontrado:** confirme o registro A e a propagação DNS.
- **Timeout na emissão:** confira encaminhamento, firewall, registros A/AAAA e se a operadora usa CGNAT ou bloqueia 80/443. Com CGNAT, esse método exige obter IP público ou usar outra solução de acesso.
- **502:** confira `sudo docker compose ps` e `sudo docker compose logs jogos`.
- **Funciona no 4G, mas não no Wi-Fi:** o roteador pode não suportar NAT loopback. Configure o DNS local para o domínio apontar ao IP do Pi; continue acessando pelo domínio HTTPS.
- **IP público muda:** atualize o registro A; use DNS dinâmico se a conexão não tiver IP fixo.

Mantenha o Pi ligado e acessível para a renovação automática. Para executar apenas o modo HTTP local, use `sudo docker compose up -d --build jogos`; se já estiver iniciado, pare o proxy com `sudo docker compose stop https`.

## Rodar sem Docker

Com Python **3.9 ou superior**, execute:

```sh
./iniciar-jogo.sh
```

O servidor escuta em `0.0.0.0:8080` e entrega apenas `dist/`. Para outra porta: `PORTA_JOGO=8081 ./iniciar-jogo.sh`. Encerre com Ctrl+C.

## Organização

- `dist/`: jogo completo e imagens servidas ao navegador.
- `docker/Caddyfile`: domínio HTTPS e proxy; certificados ficam nos volumes Docker.
- `docker/nginx.conf`: servidor do contêiner, endpoint `/healthz` e compressão.
- `Dockerfile` e `compose.yaml`: construção e execução no Pi ou computador.
- `tests/`: testes da lógica dos jogos, executados com Node.js.
- `source-images/` e arquivos de prompts/fontes: referências de produção das imagens.
- `.openai/hosting.json`: identificação da publicação Sites; não é usada pelo Docker.

O contêiner executa Nginx sem root, com sistema de arquivos somente leitura e temporários em memória. Apenas `dist/` entra na imagem; Git, testes e referências de produção ficam fora. Os logs têm rotação para limitar escrita no cartão SD. As fontes Google Fonts têm alternativas locais quando a internet não está disponível.

## Verificar a lógica

Com Node.js instalado na máquina de desenvolvimento:

```sh
for teste in tests/*.cjs; do node "$teste" || exit 1; done
```

O Pet Shop alterna gato e cachorro e guarda a última escolha no navegador. Dálmata e shih-tzu estão jogáveis e têm chances iguais nas rodadas de cachorro, com banho, biscoito, corte das unhas e acessórios.

## Manter no Alto

Escolha Fácil (novo balão a cada 10 s), Médio (8 s) ou Difícil (6 s), depois Bluey ou Bingo. Um balão começa no topo; cores e posições são sorteadas. Segure ←/→ ou A/D no computador, ou as setas translúcidas na tela. As duas poses se alternam durante a corrida e são espelhadas para a esquerda. O ponto de contato e a velocidade horizontal influenciam a rebatida. Cada balão que toca o chão estoura com uma animação desenhada no canvas, sem imagens adicionais. A rodada termina no terceiro estouro, mostrando no centro o tempo conseguido, com opção de repetir ou trocar de personagem.

A física usa passos fixos de 1/120 s, desaceleração, limites laterais e proteção contra rebatidas duplicadas. O tempo pausa em aba oculta. Em dispositivos de toque, solicita tela cheia e orientação horizontal; se o navegador não permitir, usa a área disponível e gira o cenário em retrato. A sala inteira mantém proporção 16:9. PNGs originais são preservados e o jogo carrega cópias WebP menores. Tema Dance Mode a partir do MIDI fornecido pelo usuário, renderizado no Cadência, com loop de aproximadamente 14,77 s, volume de 25% e botão de música. Detalhes e projeto editável em `music/keepup/`.

Retratos oficiais: https://www.bluey.tv/characters/bluey/ e https://www.bluey.tv/characters/bingo/; URLs dos arquivos em `dist/assets/manter-no-alto/sources.json`. Cenário e sprites de ação são imagens geradas para este projeto.

A irmã não escolhida aparece sentada, sorrindo para a tela, à esquerda da saída da sala. As imagens ficam em `dist/assets/manter-no-alto/{bluey,bingo}-sentada-v2.png`, com cópias WebP usadas pelo jogo e prompts em `seated-v2-prompts.json`.

## Pokémon — primeira etapa

Novo botão na tela inicial e prévia interativa das cinco primeiras cartas sobre uma mesa redonda na grama, à sombra de uma árvore. Pikachu, Eevee, Charmander, Squirtle e Bulbasaur usam artes derivadas de cartas Ilustração Rara obtidas no servidor oficial da Pokémon. Quatro foram editadas com image_gen para retirar textos; Squirtle usa um recorte da arte original após falha da ferramenta de edição. Símbolos oficiais recortados das próprias cartas, bordas coloridas por tipo. Fontes e limitações em `dist/pokemon-sources.html` e `dist/assets/pokemon-table/sources.json`. Prompts em `dist/assets/pokemon-table/prompts.txt`. Originais preservados em `source-images/pokemon-cards/`.

Funciona: abrir a coleção, ampliar cada carta, fechar com botão/Escape, retornar ao início, layout responsivo. A partida completa permanece desativada: só foram solicitados cinco dos dez Pokémon, e a regra exata de vantagens ainda não foi definida. Nenhuma carta foi duplicada para simular dez Pokémon.

Estrutura já implementada em `pokemon-core.js` e `pokemon-table.js`: escolhas alternadas até cinco por lado, compromisso prévio da escolha do computador, cartas usadas uma vez, cinco rodadas, placar, resultado e reinício. Tabela experimental equilibrada entre cinco tipos (dois confrontos favoráveis e dois desfavoráveis), com sorteio em tipo igual, ainda não ativada: `rulesConfirmed:false`. A interface de combate exige dez registros e regras confirmadas. `node tests/pokemon-table.cjs` valida 100 partidas simuladas, alternância, exclusividade das cartas, compromisso da máquina e pontuação.

### Revisão da coleção Pokémon: personagens sozinhos

Coleção ampliada para 13 Pokémon. Pikachu V 170/185 substitui a cena urbana; Eevee V SWSH065 substitui o grupo de Eevees. Acrescentados Jolteon V 177, Leafeon V 166, Glaceon V 174, Flareon V 169, Umbreon V 188, Espeon V 179, Sylveon V 183 e Vaporeon V 172 de Céus em Evolução. Todos os novos escolhidos aparecem sozinhos. São Full Art V (Eevee: promo V), não cartas de raridade Ilustração Especial.

Tentativas de retirar a interface por image_gen foram recusadas; as novas prévias usam recortes da área superior sem textos, com menor resolução e enquadramento mais fechado. Nenhum Pokémon novo foi redesenhado. Cada prévia oferece a carta oficial completa para comparação, e a página de fontes mostra os dez originais novos. Originais locais em `dist/assets/pokemon-table/originals/`.

Tipos seguem os símbolos impressos: Glaceon usa Água, Sylveon e Espeon usam Psíquico, Umbreon usa Escuridão. As regras continuam pendentes e o combate desativado. O protótipo de regras de cinco tipos ainda precisa ser revisto para os sete tipos agora representados.

### Expansão da coleção Pokémon — 27 cartas

Charmander e Bulbasaur receberam novos recortes oficiais. Adicionados Riolu, Lucario, Lugia, Ho-Oh, Lapras, Psyduck, Gengar, Zeraora, Sprigatito, Quaxly, Fuecoco, Piplup, Torchic e Snivy. As imagens incluem Full Art, ilustrações raras e janelas de ilustração de cartas comuns, sem reconstrução por IA. Originais e fontes estão em `dist/pokemon-sources.html`; os recortes exatos estão em `dist/assets/pokemon-table/sources.json`. Tipos seguem as cartas impressas (Lugia e Ho-Oh: Normal; Riolu e Lucario: Lutador). A coleção está disponível; as partidas continuam bloqueadas até definir as vantagens dos tipos.

### Efeitos de ataques

`dist/pokemon-attacks.html` permite testar os efeitos transparentes. Fogo, Água, Elétrico e Lutador: 3 quadros cada; Planta: 6. Arquivos em `dist/assets/pokemon-table/attacks`, fontes e descrição dos prompts em `source-images/pokemon-attacks`. O reprodutor `PokemonAttacks.play(img, tipo)` retorna função de cancelamento e aguarda o carregamento dos quadros. São animações prontas para integração às rodadas; as regras das partidas continuam pendentes. Greninja agora usa a Full Art GX de Luz Proibida 120/131, aparência normal e tipo Água.

## Batalha Pokémon: solo e online

A coleção agora abre partidas. São sorteadas doze cartas únicas: duas de Lutador, duas de Normal, uma de cada um dos outros sete tipos e uma extra sorteada entre esses sete tipos. Os jogadores alternam seis escolhas por pessoa. Há 5 segundos por escolha (também na montagem do time); ao expirar, uma carta válida é escolhida automaticamente. Cada Pokémon começa com 50 HP, mantidos entre rodadas. Os danos são simultâneos na regra, apresentados em sequência na tela: 50 super efetivo, 25 neutro/efetivo e 12 resistido/não efetivo. A tabela simplificada de oito tipos está em “Como jogar”. Normal não tem vantagens especiais. Cartas a zero HP são retiradas; vence quem mantiver Pokémon vivos depois de derrotar todos os adversários. Se os últimos caírem juntos, há empate. O efeito Normal reutiliza o golpe de caratê.

**Atualizar no Raspberry Pi (Caddy do host continua atendendo 80/443):**

```bash
cd ~/aliceisabela/aliceisabela
git pull --ff-only
sudo docker compose up -d --build jogos matchmaking
sudo docker compose ps
```

O novo serviço `matchmaking` usa Node.js 22 sem dependências externas, porta 3000 apenas dentro da rede Docker. O Nginx encaminha `/api/pokemon/`; não é preciso abrir outra porta no roteador nem alterar o Caddy. Duas pessoas acessam o mesmo site e escolhem “2 pessoas · online”. A fila é global e emparelha por ordem de chegada, sem salas privadas. O estado fica em memória: reiniciar o serviço encerra partidas. Após 30 segundos sem comunicação, o oponente vence por desconexão. Atualizar a página ou sair encerra a sessão; não há recuperação após recarregar. Os tokens de sessão não são exibidos nem compartilhados entre abas. Escolhas não são reveladas ao oponente antes da resolução. O servidor valida turnos, prazos, cartas e danos. Limite inicial: 200 sessões, adequado ao uso familiar. CPU e modo solo funcionam no navegador sem o servidor de matchmaking.

**Desenvolvimento local com multiplayer:**

```bash
SERVE_STATIC=1 PORT=8766 node server/server.cjs
# http://localhost:8766 — abra duas abas e selecione o modo online
node tests/pokemon-table.cjs
node tests/pokemon-server.cjs
node tests/pokemon-attacks.cjs
node tests/pokemon-assets.cjs
```

Os efeitos de fogo, água, choque, pancada, folhas, ondas psíquicas e energia noturna acompanham os ataques. Sons são sintetizados localmente com Web Audio e têm botão de silenciar. A versão nova do fogo mantém a chama fixa e altera seu interior. Fontes e prompts estão em `source-images/pokemon-attacks/README.md`.


### Duas pessoas na Bluey e novas rodadas Pokémon

Manter no Alto agora começa pela escolha de 1 ou 2 pessoas. No online, a fila combina jogadores da mesma dificuldade; cada um escolhe Bluey ou Bingo, sem repetir. Os dois cooperam na mesma sala e compartilham os três estouros. O servidor calcula os movimentos e colisões; o navegador desenha e suaviza as posições recebidas. A sessão encerra quando alguém sai ou fica sem conexão por 15 segundos. A fila e as partidas ficam na memória e não sobrevivem a reinícios.

Pokémon: os doze Pokémon são distribuídos por escolhas alternadas, sem cronômetro na montagem dos times. Só após as doze escolhas começa a batalha. Cada rodada permite cinco segundos de escolha (automática no fim do prazo), espera ambos, mostra 3–2–1, revela as cartas e aplica a sequência visual de ataques. Máximo de sete rodadas; termina antes se um time perder todos. Desempate: mais Pokémon vivos, depois soma da vida restante, depois empate.

Atualize ambos os contêineres (o Caddy do host continua atendendo HTTPS):

```bash
cd ~/aliceisabela/aliceisabela
git pull --ff-only
sudo docker compose up -d --build jogos matchmaking
```

Verificações locais: `node tests/keepup.cjs`, `node tests/keepup-server.cjs`, `node tests/pokemon-table.cjs` e `node tests/pokemon-server.cjs`.

### Presença e prontidão nas partidas Pokémon online

Cada nova rodada passa por uma barreira de prontidão: ambos os navegadores devem confirmar a rodada com a página visível antes de iniciar os cinco segundos. O cliente envia sinais de presença a cada consulta. Após 1,5 segundo sem sinal, ou ao ocultar a página, o servidor pausa o fluxo. A escolha automática no fim do prazo exige confirmação desse prazo pelos dois navegadores, impedindo a penalização de um aparelho que tenha perdido a conexão perto do fim do cronômetro. Ao reconectar durante a escolha, as escolhas são reiniciadas e ambos recebem cinco segundos completos. Após 30 segundos sem contato, ou saída explícita, a partida é interrompida sem vencedor; não é considerada vitória nem empate competitivo.

A classificação de uma partida concluída compara primeiro a quantidade de Pokémon vivos e depois a soma da vida restante. Igualdade nos dois critérios resulta em empate. O placar exibe ambos os valores.

Teste de regressão específico: `node tests/pokemon-readiness.cjs`.

### Expansão de nove Pokémon

Catálogo ampliado para 40: Zorua, Nickit e Purrloin (Escuridão); Mew, Jirachi e Espurr (Psíquico); Dedenne, Emolga e Pachirisu (Elétrico). As imagens de cartas oficiais foram obtidas no TCGdex; os originais, metadados e URLs estão preservados em `source-images/pokemon-cards/cute-nine/` e `dist/assets/pokemon-table/sources.json`.

As nove cartas usam enquadramento CSS definido por `artCrop`, sem redesenhar os personagens ou alterar os pixels originais. O recorte oculta os textos e preserva borda e símbolo usados pelo jogo. Nickit usa uma carta comum de Céus em Evolução, pois não foi encontrada uma Full Art dele nas fontes consultadas. A carta selecionada de Jirachi é Metal no TCG; sua categoria no jogo é Psíquico, conforme a seleção aprovada. O catálogo e as regras de sorteio são compartilhados com o servidor, por isso ambos os contêineres precisam ser atualizados.

### Cartas ocultas e derrota

Durante a escolha de cada rodada, a mão adversária mostra apenas versos do Pokémon TCG Pocket, sem nomes, tipos ou vida individual. As cartas escolhidas continuam sendo reveladas após a contagem regressiva. A tela de derrota usa o Psyduck oficial da Pokédex com as mãos na cabeça; empate e partida interrompida não usam essa imagem. As duas imagens são locais e suas fontes estão em `dist/assets/pokemon-table/sources.json`.

### Aço e treze novos Pokémon

A coleção tem 53 cartas. Entraram Scizor, Scyther, Onix, Steelix, Togedemaru, Mawile, Tinkaton, Corviknight, Metagross, Solgaleo, Raikou, Entei e Suicune. As artes originais e metadados ficam em `source-images/pokemon-cards/steel-legends`; os recortes são janelas CSS, com fontes registradas no catálogo. Scyther usa uma Shiny Rare, não Full Art. Mawile e Tinkaton ficam em Aço pelo tipo secundário, apesar das cartas selecionadas serem Psíquico.

Na tabela simplificada do jogo, Aço vence Psíquico (que também agrupa Fada) e perde para Fogo e Lutador. Seus ataques causam 12 contra Fogo, Água, Elétrico e Aço; recebe 12 de Planta, Psíquico e Normal. As demais relações permanecem iguais. O símbolo é a energia Metal da carta oficial de Scizor, exibido por CSS. O ataque usa três cortes metálicos animados em CSS com som sintetizado localmente.

O sorteio do pool garante os nove tipos em partidas locais e online. Além das duas cartas de Lutador e duas de Normal, o tipo da décima segunda carta é sorteado com chances iguais entre os tipos elegíveis com outra carta disponível; depois sorteia-se o Pokémon desse tipo. A ordem das doze cartas é embaralhada.


### Suavização da Bluey/Bingo online

O cliente antecipa apenas o movimento visual da própria personagem, usando a mesma aceleração do servidor, e reconcilia a posição suavemente. Balões e a outra personagem usam extrapolação limitada a 100 ms e suavização independente da taxa de quadros. Colisões, estouros e pontuação continuam exclusivamente no servidor. Após 350 ms sem atualização a previsão local congela; após 700 ms aparece “Reconectando…”.

As requisições são sequenciais, com cadência alvo de 60 ms durante a partida (descontando o tempo da resposta), envio antecipado ao mudar o controle, timeout de 1,5 s e intervalo maior no lobby/segundo plano. Não há fila paralela de comandos. A sala e os familiares são desenhados uma vez em canvas auxiliar; o placar só altera o DOM quando muda.

Ambos precisam terminar de carregar as imagens antes de a física avançar. Se alguém ficar em segundo plano ou sem enviar controles por 1,5 s, a simulação pausa e retoma quando ambos responderem; a desconexão definitiva continua encerrando a sessão após 15 s. Atualize os serviços `jogos` e `matchmaking` juntos.

Validação: `node tests/keepup.cjs`, `node tests/keepup-net.cjs`, `node tests/keepup-server.cjs`, `node tests/keepup-music.cjs`, `node tests/keepup-pop.cjs`. A previsão foi testada em 30/60/120 quadros por segundo, perda de atualizações, correção de posição e pausa. Ganho real de latência depende da rede; os testes locais não equivalem a medições no Wi-Fi/tablet do usuário.


### Salas privadas e anfitrião no aparelho

Nos dois jogos, “2 pessoas” oferece “Procurar partida” (fila pública) e “Convidar um amigo” (sala privada). O criador recebe um link com capacidade aleatória de 192 bits, pode copiá-lo ou usar o compartilhamento nativo quando disponível. A sala não é listada nem misturada à fila. Depois da entrada do convidado, só o dono pode clicar em “Começar jogo”. São exatamente dois participantes; o link não permite ocupar uma sala já completa. O convite expira com a saída de um membro ou após uma hora.

Nas salas por convite, “Hospedar no meu aparelho” tenta WebRTC DataChannel direto, sem STUN/TURN externo. Funciona especialmente em redes locais onde os aparelhos podem se alcançar; isolamento de clientes Wi-Fi, VPNs ou NAT podem impedir isso. A negociação usa o servidor existente por HTTPS. Se ambos não confirmarem o canal em dez segundos, os dois passam ao servidor, com uma decisão central única. O site continua necessário para abrir a sala e sinalizar presença; não é um modo offline. O Pi não precisa expor portas adicionais.

No modo direto, o criador executa a autoridade de jogo e o convidado envia ações pelo canal confiável. `dist/pokemon-session.js` e `dist/keepup-session.js` são os mesmos motores usados pelo Node; não há segunda implementação das regras. Colisões, sorteios, prontidão e pontuação são decididos pelo anfitrião. Ambos veem o modo de conexão. Se o anfitrião fechar a página, a sessão termina; não há migração de autoridade no meio da partida. Não há tráfego de gameplay via HTTP nesse modo, apenas sinalização/presença. Por ser um jogo entre amigos, o anfitrião tem controle sobre seu processo, sem garantia antitrapaça contra um anfitrião modificado.

“Jogar novamente” pede revanche ao outro participante, tanto nas salas quanto no matchmaking. A partida só reinicia quando os dois aceitam; conserva participantes, transporte e convite. Pokémon sorteia doze cartas novas e zera vida/rodadas; Bluey retorna à escolha das personagens. As sete rodadas máximas de Pokémon permanecem.

Atualização no Pi: `git pull --ff-only` e `sudo docker compose up -d --build jogos matchmaking`. Atualize os dois serviços juntos e recarregue os navegadores. Testes adicionais: `node tests/private-rooms.cjs`, `node tests/online-transport.cjs`, `node tests/pokemon-server.cjs`. As regras são testadas também com os mesmos motores que rodam no navegador anfitrião.

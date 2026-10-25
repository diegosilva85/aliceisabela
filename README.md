# Jogos de Alice e Isabela

Jogo estático com busca de brinquedos e ateliê de moda. Layout adaptado para celular, tablet e computador. Looks e progresso são salvos apenas no navegador de cada dispositivo.

## Iniciar no computador e na rede

Requer Python 3.9 ou superior. Na pasta do projeto:

```sh
./iniciar-jogo.sh
```

O servidor escuta em `0.0.0.0:8080`. Abra `http://localhost:8080` no próprio computador ou `http://IP-LOCAL-DO-COMPUTADOR:8080` em outro aparelho da rede. Para encontrar o IP local, execute `hostname -I` e use o endereço da interface conectada ao roteador. Mantenha o processo e o computador ligados. Ctrl+C encerra o servidor.

Para outra porta: `PORTA_JOGO=8081 ./iniciar-jogo.sh`.

## Acesso pela internet com encaminhamento de porta

1. Reserve o IP local do computador no DHCP do roteador.
2. Configure encaminhamento **TCP**, porta externa **8080**, para o **IP local deste computador**, porta interna **8080**.
3. Se o firewall bloquear entrada, permita TCP 8080 nele.
4. Abra `http://SEU-IP-PUBLICO:8080` usando os dados móveis do celular para verificar o acesso de fora da rede.

O encaminhamento do roteador e o firewall não são alterados pelo jogo. A disponibilidade externa depende deles e de um IPv4 público fornecido pela operadora; com CGNAT, encaminhar a porta no roteador pode não ser suficiente. O endereço público pode mudar; um serviço de DNS dinâmico é opcional.

Este servidor entrega somente `dist/`, sem listagem de pastas, upload ou acesso ao código do projeto. O acesso local publicado por essa porta é HTTP e não exige login: quem alcançar o endereço poderá jogar. A configuração de acesso da hospedagem Sites continua independente.

## Arquivos

- `dist/`: arquivos publicados do jogo e imagens.
- `dist/responsive.css`: adaptações de layout e toque.
- `serve.py`: servidor estático para rede.
- `.openai/hosting.json`: configuração da hospedagem Sites.

As fontes web usam Google Fonts; na indisponibilidade da rede são usadas fontes alternativas. Nenhum cadastro é necessário no servidor local.

## Busca de brinquedos — níveis

Fácil: 12 brinquedos e 3 alvos. Médio: 20 brinquedos e 5 alvos. Difícil: 30 brinquedos e 8 alvos. O sorteio usa apenas registros com imagem disponível; há 30 imagens nesta versão. Cada quarto tem pontos de apoio mapeados na mobília. Sobreposições preservam partes visíveis e o toque ignora pixels transparentes. A pista traz temporariamente o alvo para frente.

No celular, vire para horizontal; em retrato o cenário panorâmico permite deslizar. Tela cheia tenta bloquear a orientação quando o navegador permite; se não permitir, a rotação manual continua funcionando.

Verificação da lógica: `node tests/search-layout.cjs`.

A tentativa de gerar 20 novas imagens nesta atualização foi interrompida: a geração de Lotso recebeu bloqueio do sistema de imagens e não produziu arquivo. Nenhuma imagem nova foi adicionada nem marcada como concluída.

Todas as dificuldades têm 60 segundos, contados após carregar os brinquedos e o cenário. A barra verde mostra o tempo restante. Vitória interrompe o cronômetro; ao zerar, a rodada bloqueia os toques e oferece nova tentativa. O tempo continua passando se a aba ficar em segundo plano.
Teste do cronômetro: `node tests/search-timer.cjs`.

Ao escolher o quarto, a rodada solicita tela cheia e orientação horizontal (quando suportadas). A contagem 3, 2, 1, Já! ocorre com o quarto oculto, antes dos 60 segundos. Se a API de tela cheia for recusada, o jogo ocupa a área da página. A faixa lateral apresenta somente imagens, com nomes preservados apenas para leitores de tela. Teste: `node tests/search-intro.cjs`.

Correção do carregamento móvel: tela cheia e rotação são opcionais e não bloqueiam a partida. As imagens têm limite de espera de 25 segundos por arquivo e são preparadas em até três tarefas simultâneas. A análise de transparência usa uma prévia de até 256 px, para reduzir memória e processamento. Teste de regressão: `node tests/search-loading.cjs`.

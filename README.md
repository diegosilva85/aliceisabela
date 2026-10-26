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

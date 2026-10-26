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

Abra **http://IP-DO-RASPBERRY:8080** no celular ou computador da mesma rede. No próprio Pi, use **http://localhost:8080**. O contêiner continua rodando após fechar o terminal e reinicia quando o Pi liga, desde que o serviço Docker esteja habilitado. Depois de uma parada manual com `down` ou `stop`, inicie novamente com `up -d`.

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

Não há volumes de dados do servidor para migrar. Os dados salvos no navegador pertencem ao endereço usado para acessar o jogo; o histórico do endereço Sites não é transferido automaticamente para o endereço do Pi.

## Acesso de fora da rede

Reserve o IP local do Pi no DHCP do roteador e encaminhe uma porta **TCP** externa para a porta **8080** desse IP (ou a porta escolhida no `.env`). Teste usando os dados móveis do celular. Isso depende de IP público; CGNAT pode impedir o encaminhamento.

O serviço local usa HTTP e não exige login. Para um domínio com HTTPS, coloque um proxy reverso com certificado na frente da porta do jogo. A publicação Sites e suas permissões são independentes desta instalação. Tela cheia e bloqueio de orientação dependem do suporte e das permissões do navegador.

## Rodar sem Docker

Com Python **3.9 ou superior**, execute:

```sh
./iniciar-jogo.sh
```

O servidor escuta em `0.0.0.0:8080` e entrega apenas `dist/`. Para outra porta: `PORTA_JOGO=8081 ./iniciar-jogo.sh`. Encerre com Ctrl+C.

## Organização

- `dist/`: jogo completo e imagens servidas ao navegador.
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

O Pet Shop alterna gato e cachorro e guarda a última escolha no navegador. O dálmata está jogável; as imagens do shih-tzu estão preparadas, mas essa raça ainda não participa do sorteio.

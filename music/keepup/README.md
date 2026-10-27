# Balões em Festa

Composição original de dança eletrônica infantil para Manter no Alto. Não é transcrição ou reprodução de Dance Mode. Referência de clima indicada pelo usuário: https://www.bluey.tv/watch/bluey-tunes/dance-mode-music-video/

40 compassos, 4/4, 120 BPM, 80 segundos: introdução (0–8), verso (8–24), refrão (24–40), ponte (40–56), refrão (56–72), outro (72–80). Sintetizador, baixo sintetizado, piano elétrico rítmico, caixa de música e bateria; sem violão, guitarra ou flauta.

Projeto editável: `baloes-em-festa.cadencia`. MIDI: `baloes-em-festa.mid`. Composto e exportado em WAV usando as bibliotecas e exportador do Cadência 0.10 com TimGM6mb instalado (banco não redistribuído). Zero amostras saturadas na renderização.

Para reproduzir a exportação, na raiz deste repositório execute `python3 music/keepup/render.py /caminho/do/Cadencia/build` com o Cadência já compilado via CMake/Make e o banco `/usr/share/cadencia/soundfonts/TimGM6mb.sf2`. O script usa os argumentos de compilação e ligação do alvo compose_rock e gera três ciclos em `/tmp/keepup-three-cycles.wav`.

O MP3 do jogo extrai o ciclo central (80–160 s), ganho de 14 dB, fades de 3 ms, estéreo 48 kHz/192 kbps:

```sh
ffmpeg -y -i /tmp/keepup-three-cycles.wav -af 'atrim=start=80:end=160,asetpts=PTS-STARTPTS,volume=14dB,afade=t=in:d=0.003,afade=t=out:st=79.997:d=0.003' -c:a libmp3lame -b:a 192k dist/assets/audio/keepup-party-loop.mp3
```

No jogo: volume de 25%, botão de ligar/desligar, reprodução desde a seleção de dificuldade, pausa em aba oculta e ao sair do jogo. Arquivo local sem serviços externos. Loop HTMLAudioElement; a transição pode variar ligeiramente entre navegadores.

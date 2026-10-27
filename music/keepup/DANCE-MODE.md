# Dance Mode — MIDI fornecido pelo usuário

Fonte: arquivo local `Downloads/DANCE MODE!!!! (Bluey, season 2 episode 3).mid`, indicado pelo usuário. Cópia preservada em `dance-mode-user.mid`. Não se trata de um MIDI oficial verificado. Esta versão utiliza somente as notas presentes nesse arquivo, sem transcrição da gravação.

O MIDI contém 595 notas, 32 tempos em 4/4 (8 compassos), andamento de aproximadamente 130 BPM e duração de 14,769216 segundos. Grupos importados pelo Cadência resultam em três trilhas: Synth Bass (GM 39), bateria (canal 10, kit GM padrão) e Slap Bass (GM 37). O nome 8-Bit Drum Kit no MIDI não inclui amostras próprias; a bateria usa o SoundFont instalado.

Importado pelas bibliotecas do Cadência 0.10, preservando alturas, velocidades e tempos de execução. `dance-mode.cadencia` é o projeto editável. A notação quantizada usa 9 compassos para acomodar a última nota; o áudio usa os tempos originais, com ciclo de 32 tempos. TimGM6mb instalado no Cadência, sem redistribuição do banco.

Reexportar a partir da raiz do repositório:

```sh
python3 music/keepup/render-dance-mode.py /caminho/do/Cadencia/build
ffmpeg -y -i /tmp/dance-mode-cadencia.wav -af 'atrim=start=14.769216:end=29.538432,asetpts=PTS-STARTPTS,afade=t=in:d=0.003,afade=t=out:st=14.766216:d=0.003' -c:a libmp3lame -b:a 192k dist/assets/audio/keepup-dance-mode-loop.mp3
```

O renderizador produz três ciclos; o jogo usa o central, conservando as caudas do ciclo anterior. Mantido volume de 25%, repetição e controle de música. Substitui Balões em Festa na reprodução; os arquivos da composição anterior foram preservados.

# Jardim das Lembranças

Composição original para o jogo da memória. 24 compassos em 4/4, 64 BPM, loop de 90 segundos. Sem violão, guitarra ou bateria marcada.

- 0–30 s: verso, motivo espaçado de vibrafone, piano elétrico e cordas suaves.
- 30–60 s: refrão, flauta com variação do motivo e pequenas respostas de vibrafone.
- 60–75 s: ponte, contraste harmônico em Lá bemol e Si bemol, notas sustentadas.
- 75–90 s: outro, retorno do motivo, repouso e acorde de Sol preparando o reinício em Dó.

O projeto `.cadencia` é editável no Cadência; o MIDI e o gerador C++ também estão aqui. Renderizado com o exportador WAV do Cadência 0.10 e TimGM6mb (Tim Brechbill / David Bolton, GPL-2.0-only), sem redistribuir o banco.

O gerador exporta três ciclos. O MP3 do jogo usa os segundos 90–180, preservando caudas do ciclo anterior, com fades de 3 ms, ganho total de 22 dB e codificação FFmpeg/libmp3lame a 192 kbps, estéreo 48 kHz. PCM: 4.320.000 frames, sem saturação.

O jogo reproduz com ganho baixo de 15%, loop de 0–90 s, controle pelo botão de som existente, pausa em aba oculta e interrupção ao voltar aos temas ou sair do jogo. O carregamento tardio não inicia música depois de sair.

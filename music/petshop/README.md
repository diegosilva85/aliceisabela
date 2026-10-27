# Banho de Bossa

Composição instrumental original para o Pet Shop: 20 compassos em 4/4, 80 BPM, 60 segundos. Versão 2: violão de nylon sincopado, contrabaixo, piano elétrico, flauta, vibrafone e percussão leve.

- 0–18 s: verso, motivo de piano elétrico com pausas e acompanhamento delicado.
- 18–36 s: refrão, flauta em destaque e respostas do piano, com percussão mais presente.
- 36–48 s: ponte, contraste harmônico e textura mais espaçada.
- 48–60 s: outro, retorno do motivo e dominante preparando a volta ao verso.

As seções variam vozes, ritmo, dinâmica e harmonia; o último compasso funciona como preparação para o primeiro. Sem gravações de músicas de terceiros.

- `banho-de-bossa.cadencia`: projeto editável no Cadência.
- `banho-de-bossa.mid`: versão MIDI.
- `compose.cpp`: composição e renderização usando as bibliotecas do Cadência 0.10 (`cadencia_editor`, `cadencia_audio`).
- `../../dist/assets/audio/petshop-bossa-loop.mp3`: áudio do jogo, estéreo, 48 kHz, 192 kbps.

Renderizado pelo exportador WAV do Cadência com o banco TimGM6mb instalado pelo aplicativo (Tim Brechbill / David Bolton, GPL-2.0-only). O SoundFont não é redistribuído neste repositório. O exportador relatou zero amostras saturadas.

Para reexportar manualmente, abra o projeto no Cadência e use Arquivo → Exportar áudio WAV/MP3. Para o loop de produção, o gerador repete a composição três vezes antes de exportar; aproveitamos o ciclo central para preservar as caudas do ciclo anterior. Corte WAV de 60 a 120 segundos e aplique fades de 3 ms nas pontas antes de converter para MP3 com FFmpeg, com ganho de 14 dB (pico final aproximado de −7 dBFS). O WAV resultante contém exatamente 2.880.000 frames a 48 kHz.

A reprodução usa AudioBufferSourceNode com loop de 0 a 60 s e controle de volume de 0–100% (padrão 50%, ganho efetivo de 15%), respeita o botão de som, pausa em aba oculta e para ao sair do Pet Shop. Não há chamadas a serviços externos para compor ou tocar a música.

#!/usr/bin/env python3
"""Serve only the static game. No dependencies, uploads or directory listing."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = (Path(__file__).resolve().parent / 'dist').resolve()

class GameHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def setup(self):
        super().setup()
        self.connection.settimeout(20)

    def send_head(self):
        parts = Path(unquote(urlsplit(self.path).path)).parts
        target = Path(self.translate_path(self.path)).resolve()
        if any(part.startswith('.') for part in parts if part != '/') or not target.is_relative_to(ROOT):
            self.send_error(404)
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Jogos de Alice e Isabela — servidor de rede')
    parser.add_argument('--host', default='0.0.0.0')
    parser.add_argument('--port', default=8080, type=int)
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('A porta deve estar entre 1 e 65535.')
    server = ThreadingHTTPServer((args.host, args.port), GameHandler)
    print(f'Jogo em http://localhost:{args.port} | Escutando em {args.host}:{args.port}', flush=True)
    print('Na rede: http://IP-DESTE-COMPUTADOR:' + str(args.port) + ' | Ctrl+C para parar.', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

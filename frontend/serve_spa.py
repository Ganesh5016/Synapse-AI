import http.server
import socketserver
import os
import sys

DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dist'))

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Translate requested URL path to file system path
        translated_path = self.translate_path(self.path)
        
        # If the requested path exists as a file, serve it directly
        if os.path.isfile(translated_path):
            return super().do_GET()
            
        # If requested path is a directory containing index.html, serve it
        if os.path.isdir(translated_path) and os.path.isfile(os.path.join(translated_path, 'index.html')):
            return super().do_GET()
            
        # SPA Fallback: for all client-side routes (/signup, /dashboard, etc.), serve /index.html
        self.path = '/index.html'
        return super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run(port=5173, host='0.0.0.0'):
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((host, port), SPARequestHandler) as httpd:
        print(f"Synapse Frontend SPA server running at http://localhost:{port}/ (serving {DIRECTORY})", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    run(port=port)


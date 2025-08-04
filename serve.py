"""
Simple static server that always returns dist/index.html
for non-asset requests so TanStack Router’s client-side
routing keeps working on page refresh / deep links.
"""
import os
import http.server
import socketserver
from urllib.parse import urlparse

PORT = 8000
BUILD_DIR = "dist"
INDEX_FILE = os.path.join(BUILD_DIR, "index.html")

class SpaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BUILD_DIR, **kwargs)

    def do_GET(self):
        # If the file exists (JS, CSS, images, etc.) serve it normally
        path = self.translate_path(self.path)
        if os.path.isfile(path):
            return super().do_GET()

        # Otherwise serve index.html so the SPA router takes over
        try:
            with open(INDEX_FILE, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404, "index.html not found")

if __name__ == "__main__":
    os.chdir(os.path.dirname(__file__) or ".")
    with socketserver.TCPServer(("", PORT), SpaHandler) as httpd:
        print(f"Serving {BUILD_DIR} on http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down.")
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class DocumentProcessor(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"status": "Document processor is running"}
        self.wfile.write(json.dumps(response).encode())

if __name__ == "__main__":
    server = HTTPServer(('0.0.0.0', 5000), DocumentProcessor)
    print("Document processor running on port 5000")
    server.serve_forever()

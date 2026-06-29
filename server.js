const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const DIR = __dirname;

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  const filePath = path.join(DIR, decodeURIComponent(req.url === '/' ? '/customer_info.html' : req.url));
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

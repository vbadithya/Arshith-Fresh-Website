const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5500;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let rawPath = req.url.split('?')[0];
    let decodedPath = decodeURIComponent(rawPath);
    let filePath = path.join(PUBLIC_DIR, decodedPath === '/' ? 'index.html' : decodedPath);

    // Auto append .html if file does not have an extension
    if (!path.extname(filePath) && !fs.existsSync(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
            filePath += '.html';
        }
    }

    let extname = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[extname] || 'text/html; charset=utf-8';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>404 Page Not Found</h1><p><a href="/">Return to Home Page</a></p></body></html>`, 'utf-8');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Arshith Fresh Server running on port ${PORT}`);
});

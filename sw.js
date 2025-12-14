/* sw.js - Service Worker P2P */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Limit kawałka dla stabilności mobile (1MB)
const MAX_CHUNK_SIZE = 1024 * 1024; 

// Nasłuchiwanie żądań sieciowych
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Jeśli przeglądarka prosi o nasz wirtualny plik
    if (url.pathname.includes('virtual-video.mp4')) {
        event.respondWith(handleVideoRequest(event.request));
    }
});

// Komunikacja z index.html
let pendingRequests = {}; 

self.addEventListener('message', event => {
    const msg = event.data;
    if (msg.type === 'DATA_CHUNK') {
        if (pendingRequests[msg.id]) {
            pendingRequests[msg.id](msg.buffer);
            delete pendingRequests[msg.id];
        }
    }
});

async function handleVideoRequest(request) {
    const range = request.headers.get('range');
    
    // 1. Pytamy główny wątek o rozmiar pliku
    const totalSize = await askMainForSize();
    if (!totalSize) return new Response("File not ready", {status: 404});

    let start = 0;
    let end = totalSize - 1;

    // 2. Parsowanie nagłówka Range (np. bytes=0-)
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        start = parseInt(parts[0], 10);
        if (parts[1]) end = parseInt(parts[1], 10);
    }

    // 3. Ograniczenie wielkości żądania (Dla telefonów!)
    if (end - start >= MAX_CHUNK_SIZE) {
        end = start + MAX_CHUNK_SIZE - 1;
    }

    // 4. Pobranie danych przez P2P (via index.html)
    const chunkId = Date.now() + Math.random();
    const dataBuffer = await askMainForData(start, end, chunkId);

    if (!dataBuffer) {
        return new Response("Timeout/P2P Error", { status: 500 });
    }

    // 5. Zwracamy odpowiedź HTTP 206
    return new Response(dataBuffer, {
        status: 206,
        headers: {
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': dataBuffer.byteLength,
            'Content-Type': 'video/mp4'
        }
    });
}

function askMainForSize() {
    return new Promise(resolve => {
        const id = 'size_' + Math.random();
        pendingRequests[id] = resolve;
        sendMessageToMain({ type: 'GET_SIZE', id: id });
        setTimeout(() => resolve(null), 2000); // Timeout
    });
}

function askMainForData(start, end, reqId) {
    return new Promise(resolve => {
        pendingRequests[reqId] = resolve;
        sendMessageToMain({ type: 'GET_DATA', start, end, id: reqId });
        // Timeout 15s na pobranie kawałka
        setTimeout(() => { if(pendingRequests[reqId]) resolve(null); }, 15000); 
    });
}

function sendMessageToMain(msg) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage(msg));
    });
}

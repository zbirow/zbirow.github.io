/* sw.js - Service Worker P2P (FIXED CHUNK SIZE) */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// --- WAŻNA ZMIANA ---
// WebRTC nie lubi dużych paczek. Zmniejszamy ze 1MB na 32KB.
// To sprawi, że przeglądarka wyśle więcej zapytań, ale każde przejdzie gładko.
const MAX_CHUNK_SIZE = 32 * 1024; 

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname.includes('virtual-video.mp4')) {
        event.respondWith(handleVideoRequest(event.request));
    }
});

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
    const totalSize = await askMainForSize();
    if (!totalSize) return new Response("File not ready", {status: 404});

    let start = 0;
    let end = totalSize - 1;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        start = parseInt(parts[0], 10);
        if (parts[1]) end = parseInt(parts[1], 10);
    }

    // Ograniczamy żądanie do bezpiecznego rozmiaru (32KB)
    if (end - start >= MAX_CHUNK_SIZE) {
        end = start + MAX_CHUNK_SIZE - 1;
    }

    const chunkId = Date.now() + Math.random();
    const dataBuffer = await askMainForData(start, end, chunkId);

    if (!dataBuffer) {
        // Jeśli tu jest błąd, to znaczy że P2P zerwało
        return new Response("Timeout/P2P Error", { status: 500 });
    }

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
        setTimeout(() => resolve(null), 3000); 
    });
}

function askMainForData(start, end, reqId) {
    return new Promise(resolve => {
        pendingRequests[reqId] = resolve;
        sendMessageToMain({ type: 'GET_DATA', start, end, id: reqId });
        
        // Zwiększyłem timeout do 30 sekund na wszelki wypadek
        setTimeout(() => { 
            if(pendingRequests[reqId]) {
                console.log("TIMEOUT żądania P2P:", reqId);
                resolve(null); 
            }
        }, 30000); 
    });
}

function sendMessageToMain(msg) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage(msg));
    });
}

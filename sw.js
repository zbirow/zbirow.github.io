/* sw.js - Service Worker (STABLE SPEED) */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// 256KB - Kompromis. Wystarczająco dużo dla płynności,
// wystarczająco mało, by nie dostać timeoutu na starcie.
const MAX_CHUNK_SIZE = 256 * 1024; 

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
    } else if (msg.type === 'DATA_ERROR') {
        if (pendingRequests[msg.id]) {
            // W razie błędu zwracamy null, co wywoła 504, ale szybciej
            pendingRequests[msg.id](null);
            delete pendingRequests[msg.id];
        }
    }
});

async function handleVideoRequest(request) {
    const range = request.headers.get('range');
    const totalSize = await askMainForSize();
    
    if (!totalSize) return new Response("Not Ready", {status: 503});

    let start = 0;
    let end = totalSize - 1;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        start = parseInt(parts[0], 10);
        if (parts[1]) end = parseInt(parts[1], 10);
    }

    // --- LOGIKA STARTOWA ---
    // Jeśli przeglądarka chce początek pliku (metadane), dajemy jej mało (16KB).
    // To sprawi, że wideo pojawi się OD RAZU, bez czekania na bufor.
    if (start === 0 && (end - start) > 32000) {
        end = 32000; 
    } else {
        // Dla reszty filmu lecimy po 256KB
        if (end - start >= MAX_CHUNK_SIZE) {
            end = start + MAX_CHUNK_SIZE - 1;
        }
    }

    const chunkId = Date.now() + Math.random();
    const dataBuffer = await askMainForData(start, end, chunkId);

    if (!dataBuffer) return new Response("P2P Timeout", { status: 504 });

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
        setTimeout(() => resolve(null), 2000);
    });
}

function askMainForData(start, end, reqId) {
    return new Promise(resolve => {
        pendingRequests[reqId] = resolve;
        sendMessageToMain({ type: 'GET_DATA', start, end, id: reqId });
        // Timeout 20s
        setTimeout(() => { if(pendingRequests[reqId]) resolve(null); }, 20000); 
    });
}

function sendMessageToMain(msg) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage(msg));
    });
}

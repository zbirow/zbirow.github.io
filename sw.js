/* sw.js - Metadata Injection Version */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

const MAX_CHUNK_SIZE = 256 * 1024; // 256KB - Bezpieczny balans

// Pamięć podręczna na metadane (żeby nie pytać o nie przez sieć)
let cachedMeta = null;
let pendingRequests = {}; 

self.addEventListener('message', event => {
    const msg = event.data;
    
    // 1. Otrzymujemy rozmiar pliku z góry (od Klienta)
    if (msg.type === 'SET_META') {
        cachedMeta = msg.size;
        console.log("SW: Otrzymano rozmiar pliku offline:", cachedMeta);
    }
    
    // 2. Otrzymujemy kawałek danych
    else if (msg.type === 'DATA_CHUNK') {
        if (pendingRequests[msg.id]) {
            pendingRequests[msg.id](msg.buffer);
            delete pendingRequests[msg.id];
        }
    }
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname.includes('virtual-video.mp4')) {
        event.respondWith(handleVideoRequest(event.request));
    }
});

async function handleVideoRequest(request) {
    // KROK 1: Rozmiar pliku.
    // Jeśli mamy go w cache (z handshake'u), używamy natychmiast.
    // Jeśli nie (awaryjnie), pytamy główny wątek.
    let totalSize = cachedMeta;
    
    if (!totalSize) {
        totalSize = await askMainForSize();
    }
    
    if (!totalSize) return new Response("Not Ready", {status: 503});

    // KROK 2: Analiza Range
    const range = request.headers.get('range');
    let start = 0;
    let end = totalSize - 1;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        start = parseInt(parts[0], 10);
        if (parts[1]) end = parseInt(parts[1], 10);
    }

    // Fast Start: Pierwsze żądanie (metadane wideo) tniemy krótko
    if (start === 0 && (end - start) > 32000) {
        end = 32000;
    } else {
        if (end - start >= MAX_CHUNK_SIZE) {
            end = start + MAX_CHUNK_SIZE - 1;
        }
    }

    // KROK 3: Pobranie danych
    const chunkId = Date.now() + Math.random();
    const dataBuffer = await askMainForData(start, end, chunkId);

    if (!dataBuffer) return new Response("Timeout", { status: 504 });

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

// Fallback (gdyby cache zawiódł)
function askMainForSize() {
    return new Promise(resolve => {
        const id = 'size_' + Math.random();
        pendingRequests[id] = resolve;
        sendMessageToMain({ type: 'GET_SIZE', id: id });
        setTimeout(() => resolve(null), 1000);
    });
}

function askMainForData(start, end, reqId) {
    return new Promise(resolve => {
        pendingRequests[reqId] = resolve;
        sendMessageToMain({ type: 'GET_DATA', start, end, id: reqId });
        // Timeout 30s
        setTimeout(() => { if(pendingRequests[reqId]) resolve(null); }, 30000); 
    });
}

function sendMessageToMain(msg) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage(msg));
    });
}

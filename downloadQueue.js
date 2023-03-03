"use strict";
class DownloadQueue {
    urls;
    currently_downloading = 0;
    constructor(urls) {
        this.urls = urls;
    }
}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.message == "folder-download-next") {
        let url = request.url;
        if (url) {
            // Change download text
            let text = document.querySelector("brdPlayer brndPlayerPd");
            text.innerHTML =
                "<br> Pobieram [" +
                    request.current_download +
                    "/" +
                    request.max_length +
                    "]";
            // Handle Download
            await Video.bestFromUrl(url).then((video) => {
                chrome.runtime.sendMessage({
                    message: "cda-download-video",
                    video: video,
                });
            });
        }
    }
});

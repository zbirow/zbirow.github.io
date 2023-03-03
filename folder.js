"use strict";
class Folder {
    urls;
    constructor(urls) {
        this.urls = urls;
    }
    static async getPageUrls(url) {
        let urls = [];
        let response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const data = await response.text();
        var parser = new DOMParser();
        var folderPageHTML = parser.parseFromString(data, "text/html");
        let videos = folderPageHTML.getElementsByClassName("list-when-small");
        for (var i = 0; i < videos.length; i++) {
            let url = videos[i]
                .querySelector(".wrapper-thumb-link > .thumbnail-link")
                .getAttribute("href");
            url = "https://www.cda.pl" + url;
            urls.push(url);
        }
        return urls;
    }
    static async getAllUrls(url) {
        let urls = [];
        var page = 1;
        while (true) {
            var folderPageUrl = url + "/" + page.toString();
            let page_urls = await Folder.getPageUrls(folderPageUrl);
            if (page_urls === null) {
                break;
            }
            urls.push(...page_urls);
            page++;
        }
        return urls;
    }
    static async from(url) {
        return new Folder(await Folder.getAllUrls(url));
    }
    download() {
        chrome.runtime.sendMessage({
            message: "cda-download-folder",
            urls: this.urls,
        });
    }
}

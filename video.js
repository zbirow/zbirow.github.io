"use strict";
class Video {
    title;
    id;
    file;
    qualities;
    thumbnail;
    filename;
    url;
    source;
    duration;
    constructor(title, id, file, qualities, thumbnail, duration) {
        this.title = unescape(decodeURI(title));
        this.id = id;
        this.file = file;
        this.qualities = qualities;
        this.thumbnail = thumbnail;
        this.filename = Sanitizer.sanitize(this.title) + ".mp4";
        this.url = "https://www.cda.pl/video/" + id;
        this.source = Decoder.getSource(this.file);
        this.duration = duration;
    }
    static async fromUrl(url) {
        const response = await fetch(url);
        const data = await response.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
        let player_data_elem = doc.querySelector("div[player_data]");
        if (player_data_elem === undefined) {
            return undefined;
        }
        let player_data = JSON.parse(player_data_elem.getAttribute("player_data"));
        let title = Sanitizer.htmlDecode(player_data.video.title);
        var qualities = [];
        for (const [key, value] of Object.entries(player_data.video.qualities)) {
            qualities.push(key);
        }
        return new Video(title, player_data.video.id, player_data.video.file, qualities, player_data.video.thumb.slice(2), parseInt(player_data.duration));
    }
    static async bestFromUrl(url) {
        let video = await Video.fromUrl(url);
        if (video) {
            return await video.getBest();
        }
    }
    async getBest() {
        return await Video.fromUrl(this.url + "?wersja=" + this.qualities[this.qualities.length - 1]);
    }
}

"use strict";
(function() {
class Decoder {
    constructor() { }
    static decode(url) {
        let quotes = ["_XDDD", "_CDA", "_ADC", "_CXD", "_QWE", "_Q5", "_IKSDE"];
        quotes.forEach((e) => {
            url = unescape(url.replace(e, ""));
        });
        var b = [];
        for (var i = 0; i < url.length; i++) {
            var f = url.charCodeAt(i);
            if (f >= 33 && f <= 126) {
                b.push(String.fromCharCode(33 + ((f + 14) % 94)));
            }
            else {
                b.push(String.fromCharCode(f));
            }
        }
        var url = b.join("");
        url = url.replace(".cda.mp4", "");
        url = url.replace(".2cda.pl", ".cda.pl");
        url = url.replace(".3cda.pl", ".cda.pl");
        return url;
		
    }
	
    static getSource(url) {
        return "https://" + Decoder.decode(url) + ".mp4";
    }
}
})();

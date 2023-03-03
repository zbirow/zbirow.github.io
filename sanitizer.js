"use strict";
class Sanitizer {
    static htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }
    static sanitize(t) {
        var newString = t;
        newString = Sanitizer.htmlDecode(newString);
        let reservedChars = ["<", ">", ":", '"', "/", "\\", "|", "?", "*", "."];
        for (var i = 0; i < reservedChars.length; i++) {
            newString = newString.replaceAll(reservedChars[i], "");
        }
        return newString;
    }
}

// ==UserScript==
// @name         Linki DC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Zbirow
// @match        https://www.cda.pl/*/folder/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function getAttribute() {
    'use strict'
let links = document.querySelectorAll('a.thumbnail-link');
let ts = ".<<"
let ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ,16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ,28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 42, 44, 45, 46, 47, 48, 49, 50]
let fix = document.querySelector('span.folder-area');
let bui = document.createElement("div");
bui.className="cxfd"
fix.appendChild(bui);
for (var i = 0; i<links.length; i++){
let br = document.querySelector('div.cxfd');
let build = document.createElement("div");
br.appendChild(build);
build.innerHTML = `<span>`+ar[i]+`<span>.<</span>`+links[i]+`></span>`}
})();

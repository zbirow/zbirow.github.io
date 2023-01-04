// ==UserScript==
// @name         Cda linki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Zbirow
// @match        https://www.cda.pl/*/folder/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function getAttribute() {
    'use strict'
let links = document.querySelectorAll('a.thumbnail-link');
for (var i = 0; i<links.length; i++)
{
let player = document.querySelector('span.folder-area');
let build = document.createElement("div");
build.innerHTML = '<p class="zbirow">' + links[i].href + '</p>';
player.appendChild(build);
}
})();

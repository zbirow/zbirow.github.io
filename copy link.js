// ==UserScript==
// @name         Cda linki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Zbirow
// @match        https://www.cda.pl/*/folder/*
// @match        https://zbirow.github.io/cdalinks
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function getAttribute() {
    'use strict'
let links = document.querySelectorAll('a.thumbnail-link');
let ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ,16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ,28, 29, 30];
for (var i = 0; i<links.length; i++)
{
let player = document.querySelector('span.folder-area');
let build = document.createElement("div");
player.appendChild(build);
//build.innerHTML = '<p class="zbirow">' + links[i].href + '</p>';
build.innerHTML = `<p id="`+ ar[i] +`zbirow">` + links[i].href.split('/').slice(4) +
`</p><button type="button" onclick="copyEvent('`+ar[i]+`zbirow')">Copy</button>`
}
let player = document.querySelector('span.folder-area');
var script_tag = document.createElement('script');
script_tag.text = `function copyEvent(id)
    {
        var str = document.getElementById(id);
        window.getSelection().selectAllChildren(str);
        document.execCommand("Copy")
    }`;
player.appendChild(script_tag);
})();

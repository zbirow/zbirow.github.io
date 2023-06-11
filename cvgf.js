(function getAttribute() {
    'use strict';
let ifra = `iframe src="https://ebd.cda.pl/620x395/`
let ifre = `" width="620" height="1080" style="border:none" frameBorder="0" scrolling="no" allowfullscreen name="v2"`
let treu = `/iframe`
let cda = document.querySelector('meta[property="og:url"]').content
let emcl = document.querySelector('div.DescrVID');
let embed = document.createElement("div");
embed.innerHTML = `<sup id="zbirow"><span><</span>`+ifra+cda.split('/').slice(4)+ifre+`<span>><</span>`+treu+`<span>></span></sup>`+
`<button class="btn" style="margin-left:10px; margin-top:-90px;" type="button" onclick="copyEvent('zbirow')">Copy</button>`
})();

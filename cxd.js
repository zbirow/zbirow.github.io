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
let ifra = `iframe src="https://ebd.cda.pl/620x395/`
let ifre = `" width="620" height="1080" style="border:none" frameBorder="0" scrolling="no" allowfullscreen name="v2"`
let treu = `/iframe`
let play = document.querySelector('span.folder-area');
let pla = document.querySelector('span.folder-area');
let cxd = document.createElement("div");
cxd.className="cxd"
play.appendChild(cxd);
let ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ,16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ,28, 29, 30];
for (var i = 0; i<links.length; i++){
let player = document.querySelector('div.cxd');
let build = document.createElement("div");
player.appendChild(build);
build.className = `copylink`
build.innerHTML = `<h5>Odcinek `+ar[i]+`</h5><sup id="`+ar[i]+`zbirow"><span><</span>`+ifra+links[i].href.split('/').slice(4)+ifre+`<span>><</span>`+treu+`<span>></span></sup>`+
`<button class="btn" style="margin-left:10px; margin-top:-90px;" type="button" onclick="copyEvent('`+ar[i]+`zbirow')">Copy</button>`}
let player = document.querySelector('span.folder-area');
var script_tag = document.createElement('script');
script_tag.text = `function copyEvent(id){
var str = document.getElementById(id);
window.getSelection().selectAllChildren(str);
document.execCommand("Copy")
}`;
player.appendChild(script_tag);
let dendo = document.getElementsByClassName('panel-heading smoke')[0];
let elect = document.createElement("div");
elect.innerHTML = `<style>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}
.cxfd {
display: none;
}
.cxfd.open {
display: block;
}
.cxd.open {
display: none;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style><label class="switch">
  <input class="zswit" type="checkbox" checked>
  <span class="slider round"></span>
</label>`
dendo.appendChild(elect);
const jstoggle = document.getElementsByClassName('zswit')[0];
  jstoggle.addEventListener('click', () => {
  document.querySelector("div.cxd").classList.toggle('open');
      document.querySelector("div.cxfd").classList.toggle('open');
  });
})();

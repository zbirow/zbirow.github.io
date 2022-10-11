(function getAttribute() {
    'use strict';
let cda = document.querySelector('meta[property="og:url"]').content
let block = document.getElementsByClassName('brdPlayer brndPlayerPd')[0].style.display='none';
let quality = document.getElementsByClassName('pb pb-quality-txt')[0].textContent;
let url = document.getElementsByClassName('pb-video-player')[0].src;
let player = document.getElementsByClassName('brdPlayerWrapper pb-normal-size pb-nologo')[0];
let build = document.createElement("div");
build.innerHTML = '<video class="zbirow" width="620px" height="500px" controls="" autoplay="" name="media" src="' + url +'" type="video/mp4"></video><div class="wersja"><a class="1080" href="'+ cda +'/?wersja=1080p" title=""><span style="position:static"><span class="color-link-primary" style="position:static">1080</span></span></a><a class="720" href="'+ cda +'/?wersja=720p" title="" style="margin: 10px"><span style="position:static"><span class="color-link-primary" style="position:static">720</span></span></a><a class="480" href="'+ cda +'/?wersja=480p" title=""><span style="position:static"><span class="color-link-primary" style="position:static">480</span></span></a><a class="360" href="'+ cda +'/?wersja=360p" title="" style="margin: 10px"><span style="position:static"><span class="color-link-primary" style="position:static">360</span></span></a></div>';
player.appendChild(build);
let head = document.getElementsByClassName('head')[0];
let qualbuild = document.createElement("div");
qualbuild.innerHTML = '<h2>' + quality + '</h2>';
head.appendChild(qualbuild);
})();

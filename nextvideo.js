function nas() {
 var odc = document.getElementsByClassName('odc')[0].textContent;
        odc += 1;
        document.getElementsByClassName('odc').innerHTML = odc;
  let two = document.getElementsByClassName("odc2")[0].src;
  let three = document.getElementsByClassName("odc3")[0].src;
  document.getElementsByClassName("pop")[0].style.display="contents";
  document.getElementsByClassName("iframe")[0].src = two;
    };

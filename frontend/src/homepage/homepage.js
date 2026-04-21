window.onload = function(){

// tombol laporan
document.getElementById("laporBtn").onclick = function(){
  alert("Form laporan dibuka!");
};

// hotline
document.getElementById("callBtn").onclick = function(){
  alert("Menghubungi hotline kampus...");
};

// tombol darurat
document.getElementById("daruratBtn").onclick = function(){
  alert("Mode darurat diaktifkan!");
};

// jam realtime
function updateJam(){
  let now = new Date();

  let h = String(now.getHours()).padStart(2,"0");
  let m = String(now.getMinutes()).padStart(2,"0");
  let s = String(now.getSeconds()).padStart(2,"0");

  document.getElementById("jam").innerText =
    h + ":" + m + ":" + s + " WIB";
}

setInterval(updateJam,1000);
updateJam();

// simulasi stok turun
let stock = 150;

setInterval(function(){

  if(stock > 0){
    stock -= Math.floor(Math.random()*3);
    document.getElementById("stock").innerText = stock;
  }

},4000);

};
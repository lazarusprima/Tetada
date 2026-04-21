const supabaseUrl = "https://wgtszrntsmckodajlyci.supabase.co";

const supabaseKey =
  "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

window.onload = function () {
  initMenu();
  initButtons();
  updateJam();
  renderStock();

  setInterval(updateJam, 1000);
};

function initMenu() {
  const links = document.querySelectorAll(".menu a");

  links.forEach((link) => {
    link.addEventListener("click", function () {
      links.forEach((item) => {
        item.classList.remove("active");
      });

      this.classList.add("active");
    });
  });
}

function initButtons() {
  const emergencyBtn = document.querySelector(".emergency-btn");

  if (emergencyBtn) {
    emergencyBtn.onclick = function () {
      alert("Emergency mode activated!");
    };
  }

  const laporBtn = document.getElementById("laporBtn");

  if (laporBtn) {
    laporBtn.onclick = function () {
      alert("Form laporan insiden dibuka!");
    };
  }

  const adminLink = document.querySelector(".admin-link");

  if (adminLink) {
    adminLink.onclick = function (e) {
      e.preventDefault();
      window.location.href = "admin-login.html";
    };
  }

  const daruratBtn = document.getElementById("daruratBtn");

  if (daruratBtn) {
    daruratBtn.onclick = function () {
      alert("Mode darurat diaktifkan!");
    };
  }
}

function updateJam() {
  const jam = document.getElementById("jam");

  if (!jam) return;

  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  jam.innerText = `${h}:${m}:${s} WIB`;
}

let stock = 150;
const maxStock = 200;

function renderStock() {
  const stockValue = document.getElementById("stockValue");
  const percentText = document.getElementById("percentText");
  const progressFill = document.getElementById("progressFill");

  if (!stockValue || !percentText || !progressFill) return;

  stockValue.innerText = stock;

  const percent = Math.round((stock / maxStock) * 100);

  percentText.innerText = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

async function loadStockFromDB() {
  const { data, error } = await supabase
    .from("stok_buah_susu")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  stock = data.stock;
  renderStock();
}
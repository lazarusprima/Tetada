window.onload = function () {
  initNavbar();
  updateClock();
  renderStock();
  animateTimeline();
  initIconHover();

  setInterval(updateClock, 1000);
};

let currentStock = 128;
let maxStock = 340;

function initNavbar() {
  const menuLinks = document.querySelectorAll(".menu a");
  const emergencyBtn = document.querySelector(".emergency");
  const adminLink = document.querySelector(".admin-link");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuLinks.forEach((item) => {
        item.classList.remove("active");
      });

      this.classList.add("active");
    });
  });

  if (emergencyBtn) {
    emergencyBtn.addEventListener("click", function () {
      alert("Emergency mode activated!");
    });
  }

  if (adminLink) {
    adminLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../homepage/admin-login.html";
    });
  }
}

function updateClock() {
  const jam = document.getElementById("jam");

  if (!jam) return;

  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  jam.innerText = `${h}:${m}:${s} WIB`;
}

function renderStock() {
  const stockValue = document.getElementById("stockValue");
  const fill = document.getElementById("fill");

  if (!stockValue || !fill) return;

  stockValue.innerText = currentStock;

  const percent = Math.round((currentStock / maxStock) * 100);

  fill.style.width = percent + "%";
}

function animateTimeline() {
  const items = document.querySelectorAll(".item");
  const dots = document.querySelectorAll(".dot");
  const icons = document.querySelectorAll(".icon");

  const elements = [...items, ...dots, ...icons];

  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(25px)";
    el.style.transition = "0.6s ease";
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
}

function initIconHover() {
  const icons = document.querySelectorAll(".icon");

  icons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.18)";
      this.style.color = "#08284d";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.color = "#d8d8d8";
    });
  });
}
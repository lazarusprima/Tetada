window.onload = function () {
  updateClock();
  renderStock();
  initButtons();
  initMenu();
  animateTimeline();
  initIconHover();

  setInterval(updateClock, 1000);
};

let currentStock = 128;
const maxStock = 340;

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

function initButtons() {
  const emergencyBtn = document.querySelector(".emergency");
  const adminBtn = document.querySelector(".admin-link");

  if (emergencyBtn) {
    emergencyBtn.onclick = function () {
      alert("Emergency mode activated!");
    };
  }

  if (adminBtn) {
    adminBtn.onclick = function (e) {
      e.preventDefault();
      window.location.href = "../homepage/admin-login.html";
    };
  }
}

function initMenu() {
  const links = document.querySelectorAll(".menu a");

  links.forEach((link) => {
    link.addEventListener("click", function () {
      links.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

function animateTimeline() {
  const elements = document.querySelectorAll(".item, .dot, .icon");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 70}ms`;
    observer.observe(el);
  });
}

function initIconHover() {
  const icons = document.querySelectorAll(".icon");

  icons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(0) scale(1.18)";
      this.style.color = "#08284d";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.color = "#d8d8d8";
    });
  });
}
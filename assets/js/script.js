/* ==============================================================
   script.js – updated for multi-section modal + arrow slider
   Copy-paste this file over your existing one.
   ============================================================== */

"use strict";

/* ----- Helper: toggle .active class on any element ----- */
const elementToggle = (el) => el.classList.toggle("active");

/* ----- Sidebar (mobile) ----- */
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", () => elementToggle(sidebar));

/* ----- Custom select filter (mobile + desktop) ----- */
const select      = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtns  = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

select.addEventListener("click", () => elementToggle(select));

/* core filter function */
const applyFilter = (val) => {
  filterItems.forEach((item) => {
    if (val === "all" || val === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

/* select items (mobile dropdown) */
selectItems.forEach((item) => {
  item.addEventListener("click", () => {
    const value = item.innerText.toLowerCase();
    selectValue.innerText = item.innerText;
    elementToggle(select);
    applyFilter(value);
  });
});

/* filter buttons (desktop) */
let lastClickedBtn = filterBtns[0];
filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const value = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    applyFilter(value);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

/* ----- Contact form validation ----- */
const form       = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn    = document.querySelector("[data-form-btn]");

formInputs.forEach((inp) => {
  inp.addEventListener("input", () => {
    formBtn.toggleAttribute("disabled", !form.checkValidity());
  });
});

/* ----- Page navigation ----- */
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages    = document.querySelectorAll("[data-page]");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    pages.forEach((page, idx) => {
      if (this.innerHTML.toLowerCase() === page.dataset.page) {
        page.classList.add("active");
        navLinks[idx].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
        navLinks[idx].classList.remove("active");
      }
    });
  });
});

/* ==============================================================
   Project modal with dynamic multi-image slider
   ============================================================== */
const modal        = document.getElementById("project-modal");
const modalTitle   = document.getElementById("modal-title");
const modalDesc    = document.getElementById("modal-description");
const modalGallery = document.getElementById("modal-gallery");
const closeModal   = document.querySelector(".close-modal");
const projectCards = document.querySelectorAll("[data-filter-item]");

/* open modal on card click */
projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    /* gather data-attributes */
    const title         = card.querySelector(".project-title")?.innerText || "Project";
    const description   = card.dataset.description   || "";
    const implementation= card.dataset.implementation || "";
    const images        = JSON.parse(card.dataset.images || "[]");

    /* populate modal text */
    modalTitle.innerText = title;
    modalDesc.innerHTML  = `${description}${implementation ? "<hr><h4>Implementation</h4>" + implementation : ""}`;

    /* build slider */
    modalGallery.innerHTML = "";                // clear previous contents
    if (images.length) {
      let current = 0;

      /* container */
      const slider = document.createElement("div");
      slider.className = "slider relative";

      /* image element */
      const img = document.createElement("img");
      img.className = "slider-img w-full h-auto";
      img.src       = images[current];
      img.alt       = title;
      slider.appendChild(img);

      /* helper to change slide */
      const goTo = (dir) => {
        current = (current + dir + images.length) % images.length;
        img.src = images[current];
      };

      /* arrows if >1 image */
      if (images.length > 1) {
        const btnPrev = document.createElement("button");
        btnPrev.className = "slider-btn prev absolute left-2 top-1/2 -translate-y-1/2 text-3xl";
        btnPrev.innerHTML = "&#10094;";
        btnPrev.addEventListener("click", (e) => { e.stopPropagation(); goTo(-1); });
        slider.appendChild(btnPrev);

        const btnNext = document.createElement("button");
        btnNext.className = "slider-btn next absolute right-2 top-1/2 -translate-y-1/2 text-3xl";
        btnNext.innerHTML = "&#10095;";
        btnNext.addEventListener("click", (e) => { e.stopPropagation(); goTo(1); });
        slider.appendChild(btnNext);
      }

      modalGallery.appendChild(slider);
    }

    modal.classList.remove("hidden");
  });
});

/* close modal */
const hideModal = () => modal.classList.add("hidden");
closeModal.addEventListener("click", hideModal);
window.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

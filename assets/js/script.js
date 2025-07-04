/* ==============================================================
   script.js – multi-section modal + arrow slider
   Copy-paste over your existing file.
   ============================================================== */

"use strict";

/* ----- Helper: toggle .active class on any element ----- */
const elementToggle = (el) => el.classList.toggle("active");

/* ==============================================================
   SIDEBAR (mobile toggle)
============================================================== */
const sidebar     = document.querySelector("[data-sidebar]");
const sidebarBtn  = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", () => elementToggle(sidebar));

/* ==============================================================
   CATEGORY FILTER (desktop buttons & mobile select)
============================================================== */
const select       = document.querySelector("[data-select]");
const selectItems  = document.querySelectorAll("[data-select-item]");
const selectValue  = document.querySelector("[data-selecct-value]");
const filterBtns   = document.querySelectorAll("[data-filter-btn]");
const filterItems  = document.querySelectorAll("[data-filter-item]");

/* open/close the custom select (mobile) */
select.addEventListener("click", () => elementToggle(select));

/* core filtering logic */
const applyFilter = (val) => {
  const value = val.toLowerCase();
  filterItems.forEach((item) => {
    const category = (item.dataset.category || "").toLowerCase();
    if (value === "all" || value === category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

/* mobile dropdown items */
selectItems.forEach((item) => {
  item.addEventListener("click", () => {
    selectValue.innerText = item.innerText;
    elementToggle(select);
    applyFilter(item.innerText);
  });
});

/* desktop filter buttons */
let lastClickedBtn = filterBtns[0];
filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    selectValue.innerText = this.innerText;
    applyFilter(this.innerText);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

/* ==============================================================
   CONTACT FORM VALIDATION
============================================================== */
const form       = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn    = document.querySelector("[data-form-btn]");

formInputs.forEach((inp) => {
  inp.addEventListener("input", () => {
    formBtn.toggleAttribute("disabled", !form.checkValidity());
  });
});

/* ==============================================================
   PAGE NAVIGATION LINKS
============================================================== */
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
   PROJECT MODAL + DYNAMIC IMAGE SLIDER
============================================================== */
const modal         = document.getElementById("project-modal");
const modalTitle    = document.getElementById("modal-title");
const modalDesc     = document.getElementById("modal-description");
const modalGallery  = document.getElementById("modal-gallery");
const closeModalBtn = document.querySelector(".close-modal");
const projectCards  = document.querySelectorAll("[data-filter-item]");

/* helper to hide modal */
const hideModal = () => modal.classList.add("hidden");

/* build slider for each card click */
projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    /* 1. text content */
    const title          = card.querySelector(".project-title")?.innerText || "Project";
    const description    = card.dataset.description   || "";
    const implementation = card.dataset.implementation || "";
    modalTitle.innerText = title;
    modalDesc.innerHTML  = `${description}${implementation ? "<hr><h4>Implementation</h4>" + implementation : ""}`;

    /* 2. images */
    let images = [];
    try { images = JSON.parse(card.dataset.images || "[]"); } catch (e) { }
    modalGallery.innerHTML = "";

    if (images.length) {
      /* slider container */
      let current = 0;
      const slider = document.createElement("div");
      slider.className = "slider relative";

      /* image element */
      const img = document.createElement("img");
      img.className = "slider-img w-full h-auto";
      img.src = images[current];
      img.alt = title;
      slider.appendChild(img);

      /* utility to change image */
      const swap = (dir) => {
        current = (current + dir + images.length) % images.length;
        img.src = images[current];
      };

      /* arrows (only if >1 image) */
      if (images.length > 1) {
        const btnPrev = document.createElement("button");
        btnPrev.className = "slider-btn prev absolute left-2 top-1/2 -translate-y-1/2 text-3xl";
        btnPrev.innerHTML = "&#10094;";
        btnPrev.addEventListener("click", (e) => { e.stopPropagation(); swap(-1); });
        slider.appendChild(btnPrev);

        const btnNext = document.createElement("button");
        btnNext.className = "slider-btn next absolute right-2 top-1/2 -translate-y-1/2 text-3xl";
        btnNext.innerHTML = "&#10095;";
        btnNext.addEventListener("click", (e) => { e.stopPropagation(); swap(1); });
        slider.appendChild(btnNext);
      }

      modalGallery.appendChild(slider);
    }

    /* show modal */
    modal.classList.remove("hidden");
  });
});

/* close modal (X button, backdrop click, or Esc key) */
closeModalBtn.addEventListener("click", hideModal);
window.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

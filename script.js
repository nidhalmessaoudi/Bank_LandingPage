"use strict";

// SELECTIONS
// SECTIONS
const allSections = document.querySelectorAll(".section");
// Modal elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
// Learn more button
const scrollBtn = document.querySelector(".btn--scroll-to");
const scrollToSection = document.querySelector("#section--1");
// Nav links
const navLinks = document.querySelector(".nav__links");
const nav = document.querySelector(".nav");
// Operations
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
// HEADER
const header = document.querySelector(".header");
// IMAGES
const imgTargets = document.querySelectorAll("img[data-src]");
// SLIDES
const sliderEl = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn =>btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});


// SMOOTH SCROLL
scrollBtn.addEventListener("click", e => {
  scrollToSection.scrollIntoView({ behavior: "smooth" });
});

// PAGE NAVIGATION
/*
document.querySelectorAll(".nav__link").forEach(el => {

  el.addEventListener("click", function (e) {

    e.preventDefault();
    const id = this.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });

});*/

navLinks.addEventListener("click", function (e) {

  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }

});


// TABBED COMPONENT
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // GUARD CLAUSE
  if (!clicked) return;

  // DEACTIVATE TAB
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach(tabContent => tabContent.classList.remove("operations__content--active"));

  // ACTIVATE TAB
  clicked.classList.add("operations__tab--active");
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");

});


// NAVBAR FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", handleHover.bind("0.5"));

nav.addEventListener("mouseout", handleHover.bind("1"));


// STICKY NAVIGATION
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const navHeight = nav.getBoundingClientRect().height;

const navOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
};

const headerObserver = new IntersectionObserver(stickyNav, navOptions);
headerObserver.observe(header);


// REVEAL SECTIONS
const revealFunc = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const revealOptions = {
  root: null,
  threshold: 0.15
};

const sectionObserver = new IntersectionObserver(revealFunc, revealOptions);

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});


// LAZY LOADING IMAGES
const loadImgFunc = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const loadImgOptions = {
  root: null,
  threshold: 0,
  rootMargin: "200px"
};

const imgObserver = new IntersectionObserver(loadImgFunc, loadImgOptions);

imgTargets.forEach(img => imgObserver.observe(img));


// SLIDERS
const slider = function () {
  let curSlide = 0;
  const maxSlides = slides.length;

  const goToSlide = function (s) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - s)}%)`;
    });
  };

  const createDots = function () {
    slides.forEach((_, i) => {

      const dot = `<button class="dots__dot" data-slide="${i}"></button>`;
      dotContainer.insertAdjacentHTML("beforeend", dot);

    });
  };

  const activeDot = function (slide) {

    document.querySelectorAll(".dots__dot").forEach(dot => dot.classList.remove("dots__dot--active"));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");

  };

// Slider Init
  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  }
  init();

// Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlides - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activeDot(curSlide);
  };

// Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlides - 1;
    else curSlide--;
    goToSlide(curSlide);
    activeDot(curSlide);
  };

// Events Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

// With Arrows
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

// With Timer
/*  setInterval(nextSlide, 5000);*/

// With Dots
  dotContainer.addEventListener("click", e => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

// Call Slider Func
slider();





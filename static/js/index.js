// Load header.html into the header-placeholder div
fetch("header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
  });
let helpSlideIndex = 0;
let bestSlideIndex = 0;

function showHelpSlides() {
  const slides = document.getElementsByClassName("mySlides-help");
  const dots = document.getElementsByClassName("dot-help");

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  helpSlideIndex++;
  if (helpSlideIndex > slides.length) {
    helpSlideIndex = 1;
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  if (slides[helpSlideIndex - 1]) {
    slides[helpSlideIndex - 1].style.display = "block";
  }
  if (dots[helpSlideIndex - 1]) {
    dots[helpSlideIndex - 1].className += " active";
  }

  setTimeout(showHelpSlides, 5000); // 5초마다 도움말 슬라이드
}

function showBestSlides() {
  const slides = document.getElementsByClassName("mySlides-best");
  const dots = document.getElementsByClassName("dot-best");

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  bestSlideIndex++;
  if (bestSlideIndex > slides.length) {
    bestSlideIndex = 1;
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  if (slides[bestSlideIndex - 1]) {
    slides[bestSlideIndex - 1].style.display = "block";
  }
  if (dots[bestSlideIndex - 1]) {
    dots[bestSlideIndex - 1].className += " active";
  }

  setTimeout(showBestSlides, 5000); // 5초마다 BEST AI 슬라이드
}

function currentHelpSlide(n) {
  helpSlideIndex = n - 1;
  showHelpSlides();
}

function currentBestSlide(n) {
  bestSlideIndex = n - 1;
  showBestSlides();
}

showHelpSlides();
showBestSlides();

// 도움말 슬라이드 도트 제어
const helpDots = document.querySelectorAll('.dot-help');
const helpSlides = document.querySelectorAll('.mySlides-help');
helpDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    helpSlideIndex = index;

    helpSlides.forEach((slide) => {
      slide.style.display = "none";
    });
    helpDots.forEach((d) => d.classList.remove("active"));

    helpSlides[helpSlideIndex].style.display = "block";
    helpDots[helpSlideIndex].classList.add("active");
  });
});

// 인기 AI 슬라이드 도트 제어
const bestDots = document.querySelectorAll('.dot-best');
const bestSlides = document.querySelectorAll('.mySlides-best');
bestDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    bestSlideIndex = index;

    bestSlides.forEach((slide) => {
      slide.style.display = "none";
    });
    bestDots.forEach((d) => d.classList.remove("active"));

    bestSlides[bestSlideIndex].style.display = "block";
    bestDots[bestSlideIndex].classList.add("active");
  });
});
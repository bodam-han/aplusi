// 헤더와 푸터를 외부 HTML 파일에서 불러오는 스크립트
window.addEventListener("DOMContentLoaded", () => {
  const basePath = location.pathname.startsWith("/static/") ? "/static/" : "static/";
  fetch(`${basePath}header.html`)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;

      // Update logo link
      const logoLink = document.querySelector("#header-placeholder a[href='/']");
      if (logoLink) {
        logoLink.setAttribute("href", "/");
      }

      const toggleBtn = document.querySelector('.navbar_toggleBtn');
      const menu = document.querySelector('.navbar_menu');
      
      if (toggleBtn && menu) {
        toggleBtn.addEventListener("click", () => {
          menu.classList.toggle("active");
          document.querySelector('.navbar')?.classList.toggle("expanded");
        });
      }
    });

  fetch(`${basePath}footer.html`)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
});

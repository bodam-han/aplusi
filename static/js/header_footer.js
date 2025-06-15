// 헤더와 푸터를 외부 HTML 파일에서 불러오는 스크립트
window.addEventListener("DOMContentLoaded", () => {
  fetch("/static/header.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;

      // Fix relative links in dynamically loaded header
      const headerLinks = document.querySelectorAll("#header-placeholder .navbar_menu a");
      headerLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === "/project") link.setAttribute("href", "/project.html");
        else if (href === "/search") link.setAttribute("href", "/aisearch.html");
        else if (href === "/tip") link.setAttribute("href", "/tip.html");
        else if (href === "/notice") link.setAttribute("href", "/notice.html");
      });

      // Update logo link
      const logoLink = document.querySelector("#header-placeholder a[href='/search']");
      if (logoLink) {
        logoLink.setAttribute("href", "/aisearch.html");
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

  fetch("/static/footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
});

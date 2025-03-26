window.onload = function () {
  const toggleButton = document.getElementById("menu-toggle");
  const closeButton = document.getElementById("close-btn");
  const nav = document.querySelector("nav");

  toggleButton.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  closeButton.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
};

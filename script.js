const menuItems = document.querySelectorAll(".menu-item");
const contactItems = document.querySelectorAll(".contact-item");
let currentIndex = 0;
let contactIndex = 0;
let currentSlideIndex = 0;
let currentOpenWindow = null;

const soundOpen = new Audio("assets/open.wav");
const soundClose = new Audio("assets/close.wav");
const soundSelect = new Audio("assets/select.wav");
const soundCopy = new Audio("assets/copy.wav");

soundOpen.volume = 0.5;
soundClose.volume = 0.5;
soundSelect.volume = 0.3;

function updateSelection() {
  menuItems.forEach((item, index) => {
    item.classList.toggle("selected", index === currentIndex);
  });
}

function updateGallery() {
  const slides = document.querySelectorAll(".gallery-slide");
  const counter = document.getElementById("gallery-counter");

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlideIndex);
  });

  if (counter) {
    counter.innerText = `${currentSlideIndex + 1} / ${slides.length}`;
  }

  const content = document.querySelector("#gallery .window-content");
  content.scrollTop = 0;
}

function updateContactSelection() {
  contactItems.forEach((item, index) => {
    item.classList.toggle("selected", index === contactIndex);
  });
}

function openWindow(id) {
  const win = document.getElementById(id);
  const selectedItem = menuItems[currentIndex];

  if (win && selectedItem) {
    soundOpen.currentTime = 0;
    soundOpen.play();

    const rect = selectedItem.getBoundingClientRect();
    const containerRect = document
      .getElementById("main-container")
      .getBoundingClientRect();

    const startTop = rect.top - containerRect.top + rect.height / 2;
    const startLeft = rect.left - containerRect.left + rect.width / 2;

    win.style.top = `${startTop}px`;
    win.style.left = `${startLeft}px`;

    void win.offsetWidth;

    win.classList.add("active");
    currentOpenWindow = win;
  }
}

function closeCurrentWindow() {
  if (currentOpenWindow) {
    soundClose.currentTime = 0;
    soundClose.play();
    currentOpenWindow.classList.remove("active");
    currentOpenWindow = null;
  }
}
document.addEventListener("keydown", (e) => {
  // CONTACT
  if (currentOpenWindow && currentOpenWindow.id === "contact") {
    if (e.key === "Escape") {
      closeCurrentWindow();
    } else if (e.key === "ArrowDown") {
      soundSelect.currentTime = 0;
      soundSelect.play();
      contactIndex = (contactIndex + 1) % contactItems.length;
      updateContactSelection();
    } else if (e.key === "ArrowUp") {
      soundSelect.currentTime = 0;
      soundSelect.play();
      contactIndex =
        (contactIndex - 1 + contactItems.length) % contactItems.length;
      updateContactSelection();
    } else if (e.key === "Enter") {
      const textToCopy = contactItems[contactIndex].getAttribute("data-copy");
      navigator.clipboard.writeText(textToCopy);

      const originalText = contactItems[contactIndex].innerText;
      contactItems[contactIndex].innerText = "COPIÉ !";
      setTimeout(() => {
        contactItems[contactIndex].innerText = originalText;
      }, 1000);

      soundCopy.play();
    }
    return;
  }

  if (currentOpenWindow && currentOpenWindow.id === "gallery") {
    const content = currentOpenWindow.querySelector(".window-content");
    const slides = document.querySelectorAll(".gallery-slide");

    if (e.key === "ArrowRight") {
      soundSelect.play();
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateGallery();
    } else if (e.key === "ArrowLeft") {
      soundSelect.play();
      currentSlideIndex =
        (currentSlideIndex - 1 + slides.length) % slides.length;
      updateGallery();
    } else if (e.key === "ArrowDown") {
      content.scrollBy({ top: 40, behavior: "smooth" });
    } else if (e.key === "ArrowUp") {
      content.scrollBy({ top: -40, behavior: "smooth" });
    }
  }

  // Autre fenêtre
  if (currentOpenWindow) {
    if (e.key === "Escape") closeCurrentWindow();
    return;
  }

  //Menu Principal
  if (e.key === "ArrowDown") {
    soundSelect.currentTime = 0;
    soundSelect.play();
    currentIndex = (currentIndex + 1) % menuItems.length;
    updateSelection();
  } else if (e.key === "ArrowUp") {
    soundSelect.currentTime = 0;
    soundSelect.play();
    currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    updateSelection();
  } else if (e.key === "Enter") {
    soundSelect.currentTime = 0;
    const targetId = menuItems[currentIndex].getAttribute("data-target");
    openWindow(targetId);
  }
});

const menuItems = document.querySelectorAll(".menu-item");
let currentIndex = 0;
let currentOpenWindow = null;

const soundOpen = new Audio("assets/open.wav");
const soundClose = new Audio("assets/close.wav");
const soundSelect = new Audio("assets/select.wav");

soundOpen.volume = 0.5;
soundClose.volume = 0.5;
soundSelect.volume = 0.3;

function updateSelection() {
  menuItems.forEach((item, index) => {
    item.classList.toggle("selected", index === currentIndex);
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

document.addEventListener("keydown", (e) => {
  if (currentOpenWindow) {
    if (e.key === "Escape") {
      soundClose.currentTime = 0;
      soundClose.play();

      currentOpenWindow.classList.remove("active");
      currentOpenWindow = null;
    }
    return;
  }

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
    const targetId = menuItems[currentIndex].getAttribute("data-target");
    openWindow(targetId);
  }
});

// Souris
menuItems.forEach((item, index) => {
  item.addEventListener("mouseover", () => {
    if (!currentOpenWindow) {
      currentIndex = index;
      updateSelection();
    }
  });
  item.addEventListener("click", () => {
    openWindow(item.getAttribute("data-target"));
  });
});

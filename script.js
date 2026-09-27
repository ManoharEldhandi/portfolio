const body = document.body;
const root = document.documentElement;
const activeLayer = document.querySelector("[data-theme-layer='active']");

body.classList.add("js-ready");

function clearHashAndReturnHome() {
  if (!window.location.hash) return;

  window.history.replaceState(null, "", window.location.href.split("#")[0]);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

clearHashAndReturnHome();

function splitHeroText() {
  const splitTarget = activeLayer.querySelector("[data-split-text]");
  if (!splitTarget || splitTarget.dataset.splitReady) return;

  const words = splitTarget.textContent.trim().split(/\s+/);
  splitTarget.innerHTML = words
    .map(
      (word, index) =>
        `<span class="split-word" style="--word-index:${index}"><span>${word}</span></span>`,
    )
    .join(" ");
  splitTarget.dataset.splitReady = "true";
}

splitHeroText();

const menuToggle = activeLayer.querySelector("[data-menu-toggle]");
const menuLabel = menuToggle.querySelector(".sr-only");
const internalHashLinks = [...activeLayer.querySelectorAll('a[href^="#"]:not([data-back-top])')];
const allNavLinks = [...activeLayer.querySelectorAll(".nav-link")];
const sections = [...activeLayer.querySelectorAll("[data-section]")];
const revealItems = [...activeLayer.querySelectorAll("[data-reveal]")];
const backTopLinks = [...activeLayer.querySelectorAll("[data-back-top]")];
const magneticItems = [...activeLayer.querySelectorAll(".magnetic")];
const interactiveItems = [...activeLayer.querySelectorAll("a, button")];
const progressLabels = [...activeLayer.querySelectorAll("[data-scroll-percent]")];
const progressPill = activeLayer.querySelector(".progress-pill");
const signalStrip = activeLayer.querySelector(".signal-strip");
const skillsSolar = activeLayer.querySelector(".skills-solar");
const cursorHalo = document.querySelector("[data-cursor-halo]");
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
const supportsHoverMotion =
  supportsFinePointer &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
const supportsIntersectionObserver = "IntersectionObserver" in window;

function syncClass(element, className, force) {
  element.classList.toggle(className, force);
}

function syncStyle(element, name, value) {
  element.style.setProperty(name, value);
}

function setInteractiveCursor(isInteractive) {
  if (cursorHalo) {
    syncClass(cursorHalo, "is-interactive", isInteractive);
  }
}

const savedCursor = (() => {
  try {
    return JSON.parse(window.sessionStorage.getItem("portfolio-cursor") || "null");
  } catch {
    return null;
  }
})();

let lastClientX =
  typeof savedCursor?.x === "number" ? savedCursor.x : window.innerWidth / 2;
let lastClientY =
  typeof savedCursor?.y === "number" ? savedCursor.y : window.innerHeight / 2;
let pendingFrame = 0;
let pendingScrollFrame = 0;

lastClientX = Math.max(0, Math.min(lastClientX, window.innerWidth));
lastClientY = Math.max(0, Math.min(lastClientY, window.innerHeight));

function setMenu(isOpen) {
  body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuLabel.textContent = isOpen ? "Close menu" : "Open menu";
}

function setActiveSection(id) {
  allNavLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
}

function updateScrollProgress() {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.max(0, Math.min(window.scrollY / max, 1));
  progressPill?.style.setProperty("--scroll", String(progress));
  progressLabels.forEach((label) => {
    label.textContent = `${Math.round(progress * 100)}%`;
  });
}

function updateActiveSection() {
  const offset = window.innerHeight * 0.38;
  const active = sections.reduce((current, section) => {
    const top = section.getBoundingClientRect().top;
    return top - offset <= 0 ? section : current;
  }, null);

  setActiveSection(active ? active.id : "");
}

function saveCursorPosition() {
  try {
    window.sessionStorage.setItem(
      "portfolio-cursor",
      JSON.stringify({ x: lastClientX, y: lastClientY }),
    );
  } catch {
    // Storage can be unavailable for local files in strict browser settings.
  }
}

function applyPointerFrame() {
  pendingFrame = 0;
  cursorHalo?.style.setProperty(
    "transform",
    `translate3d(calc(${lastClientX}px - var(--halo-radius)), calc(${lastClientY}px - var(--halo-radius)), 0)`,
  );
}

function applyScrollFrame() {
  pendingScrollFrame = 0;
  updateScrollProgress();
  if (!supportsIntersectionObserver) updateActiveSection();
}

function queuePointerFrame() {
  if (!pendingFrame) {
    pendingFrame = window.requestAnimationFrame(applyPointerFrame);
  }
}

function setHaloPosition(clientX = lastClientX, clientY = lastClientY) {
  lastClientX = Math.max(0, Math.min(clientX, window.innerWidth));
  lastClientY = Math.max(0, Math.min(clientY, window.innerHeight));
  queuePointerFrame();
}

function syncPointerFrame(clientX = lastClientX, clientY = lastClientY) {
  lastClientX = Math.max(0, Math.min(clientX, window.innerWidth));
  lastClientY = Math.max(0, Math.min(clientY, window.innerHeight));
  if (pendingFrame) {
    window.cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
  }
  applyPointerFrame();
}

function queueScrollFrame() {
  if (!pendingScrollFrame) {
    pendingScrollFrame = window.requestAnimationFrame(applyScrollFrame);
  }
}

function handlePointerMove(event) {
  setHaloPosition(event.clientX, event.clientY);
}

let pendingMagneticFrame = 0;
let activeMagneticItem = null;
let magneticClientX = 0;
let magneticClientY = 0;

function applyMagneticFrame() {
  pendingMagneticFrame = 0;
  const item = activeMagneticItem;
  if (!item) return;

  const rect = item.getBoundingClientRect();
  const x = magneticClientX - rect.left;
  const y = magneticClientY - rect.top;
  const mx = `${(x / rect.width) * 100}%`;
  const my = `${(y / rect.height) * 100}%`;

  syncStyle(item, "--mx", mx);
  syncStyle(item, "--my", my);
  syncClass(item, "is-hovered", true);

  if (item.matches(".menu-toggle")) {
    const moveX = ((x / rect.width) - 0.5) * 5;
    const moveY = ((y / rect.height) - 0.5) * 5;
    const translate = `${moveX}px ${moveY}px`;
    item.style.translate = translate;
  }
}

function updateMagneticPosition(event) {
  activeMagneticItem = event.currentTarget;
  magneticClientX = event.clientX;
  magneticClientY = event.clientY;

  if (!pendingMagneticFrame) {
    pendingMagneticFrame = window.requestAnimationFrame(applyMagneticFrame);
  }
}

function resetMagneticPosition(event) {
  const item = event.currentTarget;
  if (activeMagneticItem === item) activeMagneticItem = null;
  syncClass(item, "is-hovered", false);
  item.style.translate = "";
}

menuToggle.addEventListener("click", () => {
  setMenu(!body.classList.contains("menu-open"));
});

internalHashLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = hash === "#top" ? activeLayer.querySelector("#top") : activeLayer.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    setMenu(false);
    target.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    link.blur();
  });
});

backTopLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setMenu(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    link.blur();
  });
});

if (supportsHoverMotion) {
  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", updateMagneticPosition);
    item.addEventListener("pointerenter", () => syncClass(item, "is-hovered", true));
    item.addEventListener("pointerleave", resetMagneticPosition);
  });
}

if (supportsFinePointer) {
  interactiveItems.forEach((item) => {
    item.addEventListener("pointerenter", () => setInteractiveCursor(true));
    item.addEventListener("pointerleave", () => setInteractiveCursor(false));
    item.addEventListener("pointercancel", () => setInteractiveCursor(false));
  });

  const pointerMoveEvent = "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove";
  window.addEventListener(pointerMoveEvent, handlePointerMove, { passive: true });
}

window.addEventListener(
  "scroll",
  () => {
    queueScrollFrame();
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  if (supportsFinePointer) {
    syncPointerFrame(
      Math.min(lastClientX, window.innerWidth),
      Math.min(lastClientY, window.innerHeight),
    );
  }
  updateScrollProgress();
  updateActiveSection();
});

window.addEventListener("pageshow", () => {
  clearHashAndReturnHome();
  if (supportsFinePointer) syncPointerFrame();
  updateScrollProgress();
  updateActiveSection();
});

window.addEventListener("pagehide", saveCursorPosition);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

if (supportsIntersectionObserver) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        syncClass(entry.target, "is-visible", true);
        revealObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveSection(visible.target.id);
      }
    },
    {
      rootMargin: "-34% 0px -54% 0px",
      threshold: [0.12, 0.25, 0.5, 0.75],
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        syncClass(entry.target, "is-in-view", entry.isIntersecting);
      });
    },
    { threshold: 0.01 },
  );

  [signalStrip, skillsSolar].filter(Boolean).forEach((item) => motionObserver.observe(item));
} else {
  revealItems.forEach((item) => syncClass(item, "is-visible", true));
  [signalStrip, skillsSolar].filter(Boolean).forEach((item) => syncClass(item, "is-in-view", true));
}

if (supportsFinePointer) syncPointerFrame();
updateScrollProgress();
updateActiveSection();

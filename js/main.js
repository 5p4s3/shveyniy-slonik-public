/* ============================================================
   Швейный Слоник — ателье в Твери
   Вся логика и интерактив сайта (Vanilla JS, без библиотек)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initBurgerMenu();
  initScrollAnimations();
  initActiveNavLink();
});

/* Динамическое затемнение шапки при скролле */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 10);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* Бургер-меню на мобильных устройствах */
function initBurgerMenu() {
  const burger = document.getElementById("burger");
  const nav = document.querySelector(".nav");
  if (!burger || !nav) return;

  const closeMenu = () => {
    burger.classList.remove("is-active");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  };

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    burger.classList.toggle("is-active", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });

  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target) && !burger.contains(event.target)) {
      closeMenu();
    }
  });
}

/* Плавное появление элементов при скролле (IntersectionObserver) */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate");
  if (elements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* Подсветка активного пункта меню для текущей секции */
function initActiveNavLink() {
  const links = document.querySelectorAll(".nav__link");
  if (links.length === 0) return;

  const sections = [];
  links.forEach((link) => {
    const id = link.getAttribute("href");
    if (id && id.startsWith("#")) {
      const section = document.querySelector(id);
      if (section) sections.push({ link, section });
    }
  });

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sections.forEach(({ link, section }) => {
          link.classList.toggle(
            "nav__link--active",
            section === entry.target
          );
        });
      });
    },
    { threshold: 0.3, rootMargin: "-20% 0px -50% 0px" }
  );

  sections.forEach(({ section }) => observer.observe(section));
}

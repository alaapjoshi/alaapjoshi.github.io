// Lets the CSS know JS is running, so content stays visible if this file fails to load.
document.documentElement.classList.add("js");

// ---------------------------------------------------------------------------
// Navigation: solid background after scrolling, mobile menu toggle
// ---------------------------------------------------------------------------
const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

const updateNavBackground = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
updateNavBackground();
window.addEventListener("scroll", updateNavBackground, { passive: true });

const setMenuOpen = (open) => {
  navLinks.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
};

navToggle.addEventListener("click", () => setMenuOpen(!navLinks.classList.contains("is-open")));
navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenuOpen(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenuOpen(false);
});

// Highlight the nav link for the section currently on screen.
const sectionLinks = new Map(
  [...navLinks.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute("href").slice(1), a])
);
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((a) => a.classList.remove("is-current"));
      sectionLinks.get(entry.target.id)?.classList.add("is-current");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sectionLinks.forEach((_, id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

// ---------------------------------------------------------------------------
// Scroll reveal
// ---------------------------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------------------------------------------------------------------------
// Project filters
// ---------------------------------------------------------------------------
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll("#project-grid .card");
const emptyMessage = document.getElementById("project-empty");

/**
 * Decide whether a project card should be shown for the selected filter.
 *
 * @param {string[]} tags   The card's tags, from its data-tags attribute,
 *                          e.g. ["winner", "ml", "mobile", "hardware"].
 * @param {string} filter   The selected button's data-filter value:
 *                          "all", "winner", "ml", "mobile", or "hardware".
 * @returns {boolean}       true to show the card, false to hide it.
 */
function matchesFilter(tags, filter) {
  // A card can carry several tags, so it shows under every filter it matches.
  return filter === "all" || tags.includes(filter);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((b) => {
      const active = b === button;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    let visibleCount = 0;
    projectCards.forEach((card) => {
      const show = matchesFilter(card.dataset.tags.split(" "), filter);
      card.hidden = !show;
      if (show) {
        card.classList.add("is-visible"); // skip the reveal animation for re-shown cards
        visibleCount++;
      }
    });
    emptyMessage.hidden = visibleCount > 0;
  });
});

// ---------------------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

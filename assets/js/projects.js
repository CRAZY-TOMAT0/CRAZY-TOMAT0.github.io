/* =============================================================
   projects.js — 作品展示页：分类筛选
   通过 data-category 匹配卡片，无依赖
   ============================================================= */
(function () {
  "use strict";

  const filterBar = document.querySelector("[data-filter-bar]");
  if (!filterBar) return;

  const buttons = Array.from(filterBar.querySelectorAll("[data-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-category]"));
  const counter = document.querySelector("[data-filter-count]");
  const emptyNote = document.querySelector("[data-filter-empty]");

  function applyFilter(key) {
    let visible = 0;

    cards.forEach((card) => {
      const cats = card.getAttribute("data-category").split(/\s+/);
      const show = key === "all" || cats.includes(key);
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    buttons.forEach((btn) => {
      const active = btn.getAttribute("data-filter") === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    if (counter) counter.textContent = String(visible);
    if (emptyNote) emptyNote.classList.toggle("is-shown", visible === 0);
  }

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (btn) applyFilter(btn.getAttribute("data-filter"));
  });

  applyFilter("all");
})();

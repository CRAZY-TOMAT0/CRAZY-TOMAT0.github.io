/* =============================================================
   main.js — 全站通用交互
   1. 深色 / 浅色主题切换（记忆到 localStorage）
   2. 移动端汉堡菜单
   3. 顶部导航滚动阴影
   4. 滚动入场动效 + 技能条填充
   5. 一键复制联系方式
   6. 联系表单校验（演示模式）
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. 主题切换 ---------- */
  const THEME_KEY = "portfolio-theme";
  const root = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-label", theme === "dark" ? "切换为浅色模式" : "切换为深色模式");
      btn.setAttribute("aria-pressed", String(theme === "dark"));
    });
  }

  applyTheme(getPreferredTheme());

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* ---------- 2. 移动端菜单 ---------- */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  function closeNav() {
    if (!navToggle || !nav) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // 点击菜单项后自动收起
    nav.addEventListener("click", (e) => {
      if (e.target.closest(".nav__link")) closeNav();
    });

    // Esc 关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // 视口变宽时复位
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---------- 3. 导航滚动状态 ---------- */
  const header = document.querySelector("[data-header]");

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 4. 滚动入场动效 ---------- */
  const revealTargets = document.querySelectorAll(".reveal, .skill-bar, .honor-card, .project-card, .tool");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el, i) => {
      // 同组元素按顺序错开入场
      if (el.classList.contains("reveal")) {
        el.style.setProperty("--reveal-delay", `${Math.min(i % 3, 2) * 70}ms`);
      }
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 5. 一键复制 ---------- */
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;

    const value = btn.getAttribute("data-copy");
    const original = btn.textContent;

    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = "已复制";
    } catch {
      // 剪贴板不可用时（如 file:// 协议）退回手动提示
      window.prompt("请手动复制以下内容：", value);
      return;
    }

    btn.classList.add("is-copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("is-copied");
    }, 1800);
  });

  /* ---------- 6. 联系表单（演示模式） ---------- */
  const form = document.querySelector("[data-contact-form]");

  if (form) {
    const status = form.querySelector("[data-form-status]");

    const setError = (field, message) => {
      const wrap = field.closest(".field");
      const slot = wrap ? wrap.querySelector(".field__error") : null;
      if (wrap) wrap.classList.toggle("has-error", Boolean(message));
      if (slot) slot.textContent = message || "";
    };

    const validate = () => {
      let ok = true;
      const name = form.elements.name;
      const email = form.elements.email;
      const message = form.elements.message;

      if (!name.value.trim()) { setError(name, "请填写称呼"); ok = false; }
      else setError(name, "");

      if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(email.value.trim())) {
        setError(email, "请填写有效的邮箱地址");
        ok = false;
      } else setError(email, "");

      if (message.value.trim().length < 10) {
        setError(message, "留言内容至少 10 个字");
        ok = false;
      } else setError(message, "");

      return ok;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validate()) {
        if (status) status.classList.remove("is-shown");
        return;
      }

      // 演示站点：不真正发送。
      // 接入真实收发时，把下面一行替换为 fetch("/api/contact", { method: "POST", ... })
      const name = form.elements.name.value.trim();
      form.reset();
      form.querySelectorAll(".field__error").forEach((el) => (el.textContent = ""));
      form.querySelectorAll(".field").forEach((el) => el.classList.remove("has-error"));

      if (status) {
        status.textContent = `已校验通过，${name}！页面表单暂未接入后台发送，请直接通过邮箱与我联系。`;
        status.classList.add("is-shown");
      }
    });

    form.addEventListener("input", (e) => {
      if (e.target.closest(".field.has-error")) validate();
    });
  }

  /* ---------- 7. 页脚年份 ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

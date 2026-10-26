document.documentElement.classList.add("js");

// Header border on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu
const burger = document.querySelector(".burger");
const mobileNav = document.getElementById("mobilnav");
const setMenu = (open) => {
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Luk menu" : "Åbn menu");
  mobileNav.hidden = !open;
};
burger.addEventListener("click", () => setMenu(mobileNav.hidden));
mobileNav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// Menu tabs
const tabs = [...document.querySelectorAll('[role="tab"]')];
const select = (tab) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
};
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => select(tab));
  tab.addEventListener("keydown", (e) => {
    const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!dir) return;
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    select(next);
    next.focus();
  });
});

// Reveal on scroll
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" })
  : null;
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io ? io.observe(el) : el.classList.add("in");
});

// Booking form → prefilled e-mail (no backend yet)
const form = document.getElementById("book");
const msg = form.querySelector(".form-msg");
const dateInput = form.elements.dato;
dateInput.min = new Date().toISOString().slice(0, 10);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  [...form.elements].forEach((el) => {
    if (!el.willValidate) return;
    const bad = !el.checkValidity();
    el.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = "Udfyld venligst de markerede felter."; return; }

  const f = Object.fromEntries(new FormData(form));
  const date = new Date(f.dato + "T12:00").toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" });
  const subject = `Bordbestilling: ${f.gaester} pers. ${date} kl. ${f.tid}`;
  const body = [
    `Navn: ${f.navn}`, `E-mail: ${f.email}`, `Dato: ${date}`, `Tid: ${f.tid}`, `Gæster: ${f.gaester}`,
    f.besked ? `\nBemærkninger:\n${f.besked}` : "",
  ].join("\n");
  window.location.href = `mailto:info@graadig.dk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  msg.textContent = "Tak! Din mail er klar — send den, så vender vi tilbage med en bekræftelse.";
});

document.getElementById("yr").textContent = new Date().getFullYear();

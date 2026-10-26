document.documentElement.classList.add("js");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Header collapses to logo + "Find os" after leaving the top
const hdr = document.querySelector(".hdr");
const onScroll = () => hdr.classList.toggle("is-compact", window.scrollY > 60);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

// Menu drawer
const menuBtn = document.querySelector("[data-menu]");
const drawer = document.getElementById("drawer");
const setDrawer = (open) => {
  drawer.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.firstElementChild.textContent = open ? "Luk" : "Menu";
  document.body.style.overflow = open ? "hidden" : "";
};
menuBtn.addEventListener("click", () => setDrawer(drawer.hidden));
drawer.addEventListener("click", (e) => { if (e.target.closest("a")) setDrawer(false); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) { setDrawer(false); menuBtn.focus(); } });

// One rounded box wanders through each boxed headline
if (!reduce) {
  document.querySelectorAll(".boxed").forEach((h, k) => {
    const words = [...h.querySelectorAll("span")];
    if (words.length < 2) return;
    let i = 0;
    const tick = () => {
      words.forEach((w, n) => w.classList.toggle("is-round", n === i));
      i = (i + 1 + Math.floor(Math.random() * (words.length - 1))) % words.length;
    };
    tick();
    setTimeout(() => setInterval(tick, 1600), k * 400);
  });
}

// Reveal on scroll
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -10% 0px" })
  : null;
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io ? io.observe(el) : el.classList.add("in");
});

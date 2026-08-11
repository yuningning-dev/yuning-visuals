/* ---------- Language toggle ---------- */
const langBtn = document.getElementById('lang-toggle');
let currentLang = 'en';

function applyLang(lang){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute(`data-${lang}`);
    if (val) el.innerHTML = val;
  });
  langBtn.textContent = lang === 'en' ? 'FR' : 'EN';
  localStorage.setItem('yv-lang', lang);
}

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  applyLang(currentLang);
});

/* ---------- Scroll reveal animations ---------- */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting){
      setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

/* ---------- Cursor glow follow (desktop only) ---------- */
const glow = document.getElementById('cursor-glow');
if (window.matchMedia('(pointer: fine)').matches){
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

/* ---------- Calendly popup ----------
   1. Create your free account at https://calendly.com
   2. Create an event type (e.g. "15 Min Discovery Call")
   3. Copy your scheduling link (e.g. https://calendly.com/yuning-visuals/discovery-call)
   4. Paste it below, replacing the placeholder URL
--------------------------------------- */
const CALENDLY_URL = 'https://calendly.com/yuning-visuals/discovery-call';

document.querySelectorAll('[data-calendly-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.Calendly){
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('yv-lang');
  if (saved && saved !== 'en'){
    currentLang = saved;
    applyLang(currentLang);
  }
});

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

/* ---------- Timeline progress fill ---------- */
const timelineProgress = document.querySelector('.timeline-progress');
if (timelineProgress){
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        timelineProgress.style.width = '100%';
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  timelineObserver.observe(document.querySelector('.timeline'));
}

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

/* ---------- Tilt effect on cards (desktop only) ---------- */
if (window.matchMedia('(pointer: fine)').matches){
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
    });
  });
}

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.accordion-item').forEach(item => {
  const head = item.querySelector('.accordion-head');
  const body = item.querySelector('.accordion-body');
  head.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      if (openItem !== item){
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-body').style.maxHeight = null;
      }
    });
    if (isOpen){
      item.classList.remove('open');
      body.style.maxHeight = null;
    } else {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

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

/* ---------- Scroll reveal (fade/blur) + video curtain reveal ---------- */
const revealEls = document.querySelectorAll('.reveal, .cat-video-slot');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting){
      const delay = prefersReducedMotion ? 0 : i * 50;
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

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

/* ---------- Smooth section transitions: fade sections as they leave viewport ---------- */
if (!prefersReducedMotion){
  document.querySelectorAll('.section, .hero').forEach(section => {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;
        section.style.opacity = Math.max(0.55, ratio);
        section.style.transform = `translateY(${(1 - ratio) * 12}px)`;
      });
    }, { threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1] });
    section.classList.add('section-fade');
    fadeObserver.observe(section);
  });
}

/* ---------- Custom cursor: lerped dot + glow (fine pointer, motion allowed) ---------- */
if (isFinePointer && !prefersReducedMotion){
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);
  const glow = document.getElementById('cursor-glow');

  let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, glowX = 0, glowY = 0;
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  function animateCursor(){
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%,-50%)`;
    if (glow) glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .tilt, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
  });
}

/* ---------- Magnetic buttons ---------- */
if (isFinePointer && !prefersReducedMotion){
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}

/* ---------- Tilt effect on cards ---------- */
if (isFinePointer && !prefersReducedMotion){
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

/* ---------- Hide nav on scroll down, show on scroll up ---------- */
let lastScroll = 0;
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 120){
    nav.classList.add('nav-hidden');
  } else {
    nav.classList.remove('nav-hidden');
  }
  lastScroll = current;
}, { passive: true });

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

/* ---------- Pricing card -> pre-fill quote form ---------- */
document.querySelectorAll('.pick-package').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.price-card');
    const pkg = card.getAttribute('data-package');
    const select = document.getElementById('package');
    if (select) select.value = pkg;
    document.getElementById('contact').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setTimeout(() => document.getElementById('name')?.focus(), prefersReducedMotion ? 0 : 600);
  });
});

/* ---------- Quote form submission (Formspree) ----------
   1. Create a free account at https://formspree.io
   2. Create a new form, copy its endpoint (e.g. https://formspree.io/f/abcd1234)
   3. Replace the placeholder in index.html action attribute.
--------------------------------------------------------- */
const quoteForm = document.getElementById('quote-form');
if (quoteForm){
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(quoteForm);
    const successMsg = document.getElementById('form-success');
    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
      });
      if (response.ok){
        quoteForm.reset();
        successMsg.classList.add('visible');
      } else {
        alert('Something went wrong — please email hello@yuningvisuals.com directly.');
      }
    } catch (err){
      alert('Something went wrong — please email hello@yuningvisuals.com directly.');
    }
  });
}

/* ---------- Calendly popup (optional, secondary CTA) ---------- */
const CALENDLY_URL = 'https://calendly.com/yuning-visuals/discovery-call';
document.querySelectorAll('[data-calendly-open]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
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

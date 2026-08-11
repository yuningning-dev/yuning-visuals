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

/* ---------- Pricing card -> pre-fill quote form ---------- */
document.querySelectorAll('.pick-package').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.price-card');
    const pkg = card.getAttribute('data-package');
    const select = document.getElementById('package');
    if (select) select.value = pkg;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('name')?.focus(), 600);
  });
});

/* ---------- Quote form submission (Formspree) ----------
   1. Create a free account at https://formspree.io
   2. Create a new form, copy its endpoint (e.g. https://formspree.io/f/abcd1234)
   3. Replace the placeholder in index.html:
      <form id="quote-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   4. Submissions land directly in your email inbox — no backend needed.
--------------------------------------------------------- */
const quoteForm = document.getElementById('quote-form');
if (quoteForm){
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(quoteForm);
    const successMsg = document.getElementById('form-success');
    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
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

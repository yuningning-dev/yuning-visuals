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

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('yv-lang');
  if (saved && saved !== 'en'){
    currentLang = saved;
    applyLang(currentLang);
  }
});

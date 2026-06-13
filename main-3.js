/* ============================================================
   CLAUD SPRING — Main JavaScript
   ============================================================ */

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Hamburger menu ────────────────────────────────────────────
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ── Active nav link ───────────────────────────────────────────
(function setActiveLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      (path.endsWith('index.html') || path === '/' || path.endsWith('/')) && href.includes('index') ||
      path.includes('service') && href.includes('service') ||
      path.includes('contact') && href.includes('contact')
    ) {
      link.classList.add('active');
    }
  });
})();

// ── Scroll reveal ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Counter animation ─────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.stat-num[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.count));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

// ── Contact form — real email via FormSubmit.co ───────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('.form-submit');
    const originalHTML = btn.innerHTML;

    // Show loading state
    btn.innerHTML = `Sending&hellip;
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" style="animation:spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>`;
    btn.disabled = true;

    // Add a CSS spin keyframe once
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // Collect form data
    const formData = new FormData(this);

    // Build subject line
    const service   = formData.get('service') || 'General Inquiry';
    const firstName = formData.get('first-name') || '';
    const lastName  = formData.get('last-name')  || '';
    formData.set('_subject', `New Enquiry: ${service} — ${firstName} ${lastName}`);
    formData.set('_captcha', 'false');
    formData.set('_template', 'table');

    try {
      const res = await fetch('https://formsubmit.co/ajax/Claudspringgr47@yahoo.com', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      const json = await res.json();

      if (json.success === 'true' || json.success === true) {
        // ✅ Success
        contactForm.reset();
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 6000);
        }
      } else {
        throw new Error('Submission failed');
      }

    } catch (err) {
      // Graceful fallback — open mail client pre-filled
      const name     = `${firstName} ${lastName}`.trim();
      const emailVal = formData.get('email')   || '';
      const phone    = formData.get('phone')   || '';
      const msg      = formData.get('message') || '';
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${emailVal}\nPhone: ${phone}\nService: ${service}\n\n${msg}`
      );
      window.location.href =
        `mailto:Claudspringgr47@yahoo.com?subject=${encodeURIComponent('Enquiry: ' + service)}&body=${body}`;

    } finally {
      btn.innerHTML = originalHTML;
      btn.disabled  = false;
    }
  });
}

// ── Smooth anchor links ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Hero image lazy-load placeholder fallback ─────────────────
document.querySelectorAll('img[data-src]').forEach(img => {
  img.setAttribute('src', img.dataset.src);
  img.removeAttribute('data-src');
});

// ── Cursor glow effect (desktop only) ────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 350px; height: 350px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.6s ease, top 0.6s ease;
    left: -999px; top: -999px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

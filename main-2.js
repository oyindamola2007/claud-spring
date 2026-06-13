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

  // Close on link click
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

// ── Contact form — sends real email via FormSubmit.co ─────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('.form-submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Sending… <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
    btn.disabled = true;

    // Collect form data
    const data = new FormData(this);

    // Build a subject line from the service field
    const service = data.get('service') || 'General Inquiry';
    const firstName = data.get('first-name') || '';
    const lastName = data.get('last-name') || '';

    // Append FormSubmit config fields
    data.append('_subject', `New Enquiry: ${service} — ${firstName} ${lastName}`);
    data.append('_captcha', 'false');
    data.append('_template', 'table');

    try {
      const response = await fetch('https://formsubmit.co/ajax/Claudspringgr47@yahoo.com', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      const result = await response.json();

      if (result.success === 'true' || result.success === true) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 6000);
        }
      } else {
        throw new Error('FormSubmit returned failure');
      }
    } catch (err) {
      // Fallback: open user's mail client pre-filled
      const name = `${data.get('first-name') || ''} ${data.get('last-name') || ''}`.trim();
      const emailVal = data.get('email') || '';
      const phone = data.get('phone') || '';
      const serviceVal = data.get('service') || '';
      const msg = data.get('message') || '';
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${emailVal}\nPhone: ${phone}\nService: ${serviceVal}\n\n${msg}`
      );
      window.location.href = `mailto:Claudspringgr47@yahoo.com?subject=Enquiry: ${encodeURIComponent(serviceVal || 'General')}&body=${body}`;
    } finally {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
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
    glow.style.top = e.clientY + 'px';
  });
}

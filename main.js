/* ==========================================================================
   CHURCH WEBSITE — MAIN JAVASCRIPT
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. NAVIGATION — Scroll behavior & mobile menu
     -------------------------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.nav__menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  // Sticky nav on scroll
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav--scrolled');
        nav.classList.remove('nav--transparent');
      } else {
        nav.classList.remove('nav--scrolled');
        if (nav.dataset.transparent === 'true') {
          nav.classList.add('nav--transparent');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile menu toggle
  function openMobileNav() {
    if (mobileNav) {
      mobileNav.classList.add('mobile-nav--open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileNav) {
      mobileNav.classList.remove('mobile-nav--open');
      document.body.style.overflow = '';
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* --------------------------------------------------------------------------
     2. REVEAL ON SCROLL — Intersection Observer
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  /* --------------------------------------------------------------------------
     3. GIVING AMOUNT SELECTOR
     -------------------------------------------------------------------------- */
  const givingAmounts = document.querySelectorAll('.giving-amount');
  const customAmountInput = document.querySelector('#custom-amount');

  givingAmounts.forEach(btn => {
    btn.addEventListener('click', () => {
      givingAmounts.forEach(b => b.classList.remove('giving-amount--active'));
      btn.classList.add('giving-amount--active');

      const value = btn.dataset.amount;
      if (customAmountInput && value !== 'custom') {
        customAmountInput.value = value;
      }
      if (value === 'custom' && customAmountInput) {
        customAmountInput.focus();
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. PRAYER REQUEST FORM — Character counter
     -------------------------------------------------------------------------- */
  const prayerTextarea = document.querySelector('#prayer-message');
  const prayerCounter = document.querySelector('#prayer-counter');

  if (prayerTextarea && prayerCounter) {
    prayerTextarea.addEventListener('input', () => {
      const len = prayerTextarea.value.length;
      prayerCounter.textContent = `${len} / 500`;
    });
  }

  /* --------------------------------------------------------------------------
     5. FORM SUBMISSIONS — Simulated (replace with real backend)
     -------------------------------------------------------------------------- */
  function handleFormSubmit(formId, successMsg) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const original = btn ? btn.textContent : '';

      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }

      // Simulate async submission
      setTimeout(() => {
        showToast(successMsg || 'Submitted successfully!', 'success');
        form.reset();
        if (btn) {
          btn.textContent = original;
          btn.disabled = false;
        }
      }, 1200);
    });
  }

  handleFormSubmit('contact-form', 'Your message has been sent. We\'ll be in touch soon!');
  handleFormSubmit('prayer-form', 'Your prayer request has been received. We\'re praying for you.');
  handleFormSubmit('visit-form', 'Thank you! We\'ll send your visit guide shortly.');
  handleFormSubmit('newsletter-form', 'You\'re subscribed! Welcome to the family.');

  /* --------------------------------------------------------------------------
     6. TOAST NOTIFICATIONS
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${type === 'success' ? '✓' : '!'}</span>
      <span class="toast__msg">${message}</span>
    `;

    // Inline styles for self-contained toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      background: type === 'success' ? '#1B3A5C' : '#C9913D',
      color: 'white',
      padding: '14px 24px',
      borderRadius: '40px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      zIndex: '9999',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      opacity: '0',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100vw - 48px)',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     7. ACCORDION (for FAQs, Beliefs)
     -------------------------------------------------------------------------- */
  const accordionBtns = document.querySelectorAll('.accordion__btn');

  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion__item');
      const panel = item.querySelector('.accordion__panel');
      const isOpen = item.classList.contains('accordion--open');

      // Close all
      document.querySelectorAll('.accordion__item').forEach(i => {
        i.classList.remove('accordion--open');
        const p = i.querySelector('.accordion__panel');
        if (p) p.style.maxHeight = '0';
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('accordion--open');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. SERMON VIDEO MODAL
     -------------------------------------------------------------------------- */
  const videoTriggers = document.querySelectorAll('[data-video]');
  let activeModal = null;

  function openVideoModal(videoId, platform = 'youtube') {
    closeVideoModal();

    const modal = document.createElement('div');
    modal.className = 'video-modal';

    const src = platform === 'youtube'
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${videoId}?autoplay=1`;

    modal.innerHTML = `
      <div class="video-modal__backdrop"></div>
      <div class="video-modal__content">
        <button class="video-modal__close" aria-label="Close video">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="video-modal__frame">
          <iframe src="${src}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
      </div>
    `;

    // Inline styles
    Object.assign(modal.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    });

    const backdrop = modal.querySelector('.video-modal__backdrop');
    Object.assign(backdrop.style, {
      position: 'absolute',
      inset: '0',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
    });

    const content = modal.querySelector('.video-modal__content');
    Object.assign(content.style, {
      position: 'relative',
      width: '100%',
      maxWidth: '900px',
      zIndex: '1',
    });

    const closeBtn = modal.querySelector('.video-modal__close');
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '-48px',
      right: '0',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
    });

    const frame = modal.querySelector('.video-modal__frame');
    Object.assign(frame.style, {
      position: 'relative',
      paddingBottom: '56.25%',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
    });

    const iframe = modal.querySelector('iframe');
    Object.assign(iframe.style, {
      position: 'absolute',
      top: '0', left: '0',
      width: '100%', height: '100%',
    });

    backdrop.addEventListener('click', closeVideoModal);
    closeBtn.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeVideoModal();
    });

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    activeModal = modal;
  }

  function closeVideoModal() {
    if (activeModal) {
      activeModal.remove();
      activeModal = null;
      document.body.style.overflow = '';
    }
  }

  videoTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = trigger.dataset.video;
      const platform = trigger.dataset.platform || 'youtube';
      openVideoModal(videoId, platform);
    });
  });

  /* --------------------------------------------------------------------------
     9. SMOOTH SCROLL for anchor links
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 96; // nav height + buffer
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     10. ACTIVE NAV LINK detection
     -------------------------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* --------------------------------------------------------------------------
     11. HELP CATEGORY SUBOPTION selection (find-help pages)
     -------------------------------------------------------------------------- */
  const suboptions = document.querySelectorAll('.help-suboption');
  suboptions.forEach(opt => {
    opt.addEventListener('click', () => {
      suboptions.forEach(o => o.style.borderColor = '');
      opt.style.borderColor = 'var(--color-accent)';
      opt.style.background = 'var(--color-accent-subtle)';
    });
  });

  /* --------------------------------------------------------------------------
     12. GIVING FREQUENCY toggle
     -------------------------------------------------------------------------- */
  const freqBtns = document.querySelectorAll('.freq-btn');
  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('freq-btn--active'));
      btn.classList.add('freq-btn--active');
    });
  });

  /* --------------------------------------------------------------------------
     13. EVENTS — Simple tab filter
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('filter-active'));
      btn.classList.add('filter-active');

      const eventCards = document.querySelectorAll('[data-category]');
      eventCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     14. SERMON search
     -------------------------------------------------------------------------- */
  const sermonSearch = document.querySelector('#sermon-search');
  const sermonCards = document.querySelectorAll('.sermon-card');

  if (sermonSearch) {
    sermonSearch.addEventListener('input', () => {
      const query = sermonSearch.value.toLowerCase().trim();
      sermonCards.forEach(card => {
        const title = card.querySelector('.sermon-card__title')?.textContent.toLowerCase() || '';
        const speaker = card.querySelector('.sermon-card__speaker')?.textContent.toLowerCase() || '';
        const series = card.querySelector('.sermon-card__series')?.textContent.toLowerCase() || '';
        const match = title.includes(query) || speaker.includes(query) || series.includes(query);
        card.style.display = match || !query ? '' : 'none';
      });
    });
  }

  /* --------------------------------------------------------------------------
     15. COUNTER ANIMATION for statistics
     -------------------------------------------------------------------------- */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const startValue = 0;

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(startValue + (target - startValue) * eased);
      el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-card__number[data-count]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCounter(el, target);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));
  }

})();

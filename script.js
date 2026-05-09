// ============================
//  Navbar scroll effect
// ============================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.background = 'rgba(5, 8, 16, 0.97)';
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.background = 'rgba(12, 16, 30, 0.92)';
    navbar.style.boxShadow = 'none';
  }
});

// ============================
//  Stat counters (hero) — only Coding Hours & Projects Completed animate
// ============================
function animateStatCounter(el, target, suffix) {
  let current = 0;
  const steps = 55;
  const stepMs = 55;
  const increment = Math.max(1, Math.ceil(target / steps));

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      el.textContent = current + suffix;
      clearInterval(timer);
      return;
    }
    el.textContent = current + suffix;
  }, stepMs);
}

const statCounterEls = document.querySelectorAll('.js-stat-counter');
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix != null ? el.dataset.suffix : '+';
      if (!Number.isNaN(target)) {
        el.textContent = '0' + suffix;
        animateStatCounter(el, target, suffix);
      }
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

statCounterEls.forEach((el) => statObserver.observe(el));

// ============================
//  Smooth scroll for nav links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================
//  Typewriter Effect
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const greeting = document.querySelector('.hero-greeting');
  const titleEm = document.querySelector('.hero-title em');
  const subtitle = document.querySelector('.hero-subtitle');

  if (!greeting || !titleEm || !subtitle) return;

  const text1 = "Hi! I'm Youssef, building";
  const text2 = "Digital Experiences.";
  const text3 = "I build modern, accessible, high-performance interfaces";
  const text4 = "with smooth motion, refined visuals, and real user needs.";

  // Utility to type text
  function typeText(element, text, speed, callback) {
    let i = 0;
    element.classList.add('typing-cursor');
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        element.classList.remove('typing-cursor');
        if (callback) setTimeout(callback, 200); // short pause before next
      }
    }, speed);
  }

  // Sequence the typing animations
  setTimeout(() => {
    typeText(greeting, text1, 40, () => {
      
      // Type Title
      typeText(titleEm, text2, 50, () => {
        
        // Type Subtitle First Line
        subtitle.classList.add('typing-cursor');
        let i = 0;
        const int1 = setInterval(() => {
          subtitle.innerHTML = text3.substring(0, i + 1);
          i++;
          if (i >= text3.length) {
            clearInterval(int1);
            subtitle.innerHTML += '<br/>';
            
            // Short pause at line break
            setTimeout(() => {
              let j = 0;
              const int2 = setInterval(() => {
                subtitle.innerHTML = text3 + '<br/>' + text4.substring(0, j + 1);
                j++;
                if (j >= text4.length) {
                  clearInterval(int2);
                  // Keep the cursor blinking at the end of the subtitle for longer
                  setTimeout(() => {
                    subtitle.classList.remove('typing-cursor');
                  }, 3000); 
                }
              }, 25);
            }, 300);
          }
        }, 25);
      });
    });
  }, 400); // Initial delay before typing starts
});

// ============================
//  FAQ Accordion
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-faqs]');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.faq-item'));

  const setOpen = (item, nextOpen) => {
    const btn = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!btn || !panel) return;

    item.classList.toggle('is-open', nextOpen);
    btn.setAttribute('aria-expanded', String(nextOpen));
    panel.setAttribute('aria-hidden', String(!nextOpen));

    if (nextOpen) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  };

  // Initial state: all closed (as requested)
  items.forEach((item) => setOpen(item, false));

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-trigger');
    if (!btn || !root.contains(btn)) return;

    const item = btn.closest('.faq-item');
    if (!item) return;

    const isOpen = item.classList.contains('is-open');

    // Accordion behavior: close all, then open clicked if it was closed
    items.forEach((it) => setOpen(it, false));
    if (!isOpen) setOpen(item, true);
  });

  // Keep animation height correct on resize
  window.addEventListener('resize', () => {
    const openItem = root.querySelector('.faq-item.is-open');
    if (!openItem) return;
    const panel = openItem.querySelector('.faq-panel');
    if (!panel) return;
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
});

// ============================
//  Contact Form Handling
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  if (!form || !submitBtn) return;

  const btnTextEl = submitBtn.querySelector('.btn-text') || submitBtn;

  // --- Fonctions utilitaires pour la lisibilité ---
  const updateUIState = (state, message = '') => {
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = 'form-status';
    }

    if (state === 'sending') {
      submitBtn.disabled = true;
      btnTextEl.textContent = 'Sending...';
    } else if (state === 'success') {
      if (statusEl) statusEl.classList.add('success');
      btnTextEl.textContent = 'Message Sent!';
      setTimeout(resetBtnState, 5000);
    } else if (state === 'error') {
      if (statusEl) statusEl.classList.add('error');
      submitBtn.disabled = false;
      btnTextEl.textContent = 'Try Again';
    } else if (state === 'spam') {
      // Échec silencieux : donne l'impression au bot que ça a marché
      submitBtn.disabled = false;
      btnTextEl.textContent = 'Message Sent!';
      setTimeout(resetBtnState, 5000);
    }
  };

  const resetBtnState = () => {
    btnTextEl.textContent = 'Send Message';
    submitBtn.disabled = false;
  };

  const sanitizeInput = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;")
      .replace(/;/g, "&#59;")
      .trim();
  };

  // --- Gestionnaire Principal (Main Handler) ---
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    updateUIState('sending');

    const formData = new FormData(form);
    
    // 1. Protection Anti-Spam : Vérification du "Honeypot" (Pot de miel)
    if (formData.get('_gotcha')) {
      console.warn("Spam détecté. Soumission ignorée.");
      updateUIState('spam');
      return; 
    }

    // 2. Nettoyage des données (Sanitization basique)
    const sanitizedData = new FormData();
    for (const [key, value] of formData.entries()) {
      sanitizedData.append(key, sanitizeInput(value));
    }

    // 3. Envoi des données via l'API (ex: Formspree, Formkeep, etc.)
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: sanitizedData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        updateUIState('success', 'Thanks! Your message has been sent successfully.');
        form.reset();
      } else {
        throw new Error(`Server Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting the form :", error);
      updateUIState('error', 'Oops! There was a problem sending your message.');
    }
  });
});



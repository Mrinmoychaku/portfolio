/**
 * Mrinmoy Chaku - Portfolio Script
 * Interactive features, YSS Scoring Simulator, Typing animation, & Canvas Particles
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initCanvasBackground();
  initCodeTerminalTilt();
  initNavigation();
  initSkillsFilter();
  initYssSimulator();
  initModals();
  initContactFeatures();
});

/* ============================================================
   0. Interactive 3D Tilt for Code Terminal Card
   ============================================================ */
function initCodeTerminalTilt() {
  const terminal = document.getElementById('code-terminal');
  if (!terminal) return;

  terminal.addEventListener('mousemove', (e) => {
    const rect = terminal.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    terminal.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  });

  terminal.addEventListener('mouseleave', () => {
    terminal.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
}

/* ============================================================
   1. Theme Toggle (Dark / Light)
   ============================================================ */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('mc_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mc_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fa-solid fa-moon';
    icon.setAttribute('title', 'Switch to Dark Mode');
  } else {
    icon.className = 'fa-solid fa-sun';
    icon.setAttribute('title', 'Switch to Light Mode');
  }
}

/* ============================================================
   2. Typing Animation Effect
   ============================================================ */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    "B.Tech Computer Science Student",
    "Full-Stack Web Developer",
    "Python & JavaScript Developer",
    "Database & API Specialist",
    "Problem Solver & Fast Learner"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ============================================================
   3. Interactive Canvas Particle Background
   ============================================================ */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#38bdf8' : '#6366f1'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ============================================================
   4. Navigation & Active Section Tracker
   ============================================================ */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Sticky Navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
      if (backToTopBtn) backToTopBtn.style.display = 'flex';
    } else {
      navbar.classList.remove('scrolled');
      if (backToTopBtn) backToTopBtn.style.display = 'none';
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close mobile menu on link click
    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Active link highlighting via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  // Back to top scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ============================================================
   5. Skills Filter
   ============================================================ */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ============================================================
   6. Yoga Scoring System (YSS) Simulator
   ============================================================ */
function initYssSimulator() {
  const calcBtn = document.getElementById('sim-calc-btn');
  const randomBtn = document.getElementById('sim-random-btn');
  const inputs = [
    document.getElementById('judge1'),
    document.getElementById('judge2'),
    document.getElementById('judge3'),
    document.getElementById('judge4'),
    document.getElementById('judge5')
  ];

  if (!calcBtn || !inputs[0]) return;

  function calculateScore() {
    const rawScores = inputs.map((inp, idx) => ({
      judge: `Judge ${idx + 1}`,
      score: parseFloat(inp.value) || 0
    }));

    // Find indices of minimum and maximum score
    let minVal = Infinity;
    let maxVal = -Infinity;
    let minIdx = -1;
    let maxIdx = -1;

    rawScores.forEach((item, idx) => {
      if (item.score < minVal) {
        minVal = item.score;
        minIdx = idx;
      }
      if (item.score > maxVal) {
        maxVal = item.score;
        maxIdx = idx;
      }
    });

    // In case all scores are identical or edge case
    if (minIdx === maxIdx && rawScores.length > 1) {
      maxIdx = 1;
    }

    let validSum = 0;
    const chipsContainer = document.getElementById('sim-chips');
    chipsContainer.innerHTML = '';

    rawScores.forEach((item, idx) => {
      const chip = document.createElement('div');
      const isDropped = idx === minIdx || idx === maxIdx;

      if (isDropped) {
        chip.className = 'score-chip dropped';
        chip.innerHTML = `<i class="fa-solid fa-xmark"></i> ${item.judge}: ${item.score.toFixed(1)} (Dropped)`;
      } else {
        validSum += item.score;
        chip.className = 'score-chip valid';
        chip.innerHTML = `<i class="fa-solid fa-check"></i> ${item.judge}: ${item.score.toFixed(1)} (Counted)`;
      }

      chipsContainer.appendChild(chip);
    });

    const finalAvg = validSum / 3;
    const finalScoreEl = document.getElementById('sim-final-score-val');
    const finalAvgEl = document.getElementById('sim-final-avg-val');

    if (finalScoreEl) finalScoreEl.textContent = validSum.toFixed(2);
    if (finalAvgEl) finalAvgEl.textContent = finalAvg.toFixed(2);

    // Update simulation result visual
    showToast(`Calculated: High (${maxVal}) & Low (${minVal}) excluded! Total: ${validSum.toFixed(2)}`);
  }

  calcBtn.addEventListener('click', calculateScore);

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      inputs.forEach((inp) => {
        const rand = (Math.random() * 3 + 7).toFixed(1); // Scores between 7.0 and 10.0
        inp.value = rand;
      });
      calculateScore();
    });
  }

  // Trigger calculation on input change
  inputs.forEach((inp) => {
    inp.addEventListener('input', calculateScore);
  });

  // Calculate once on initial load
  calculateScore();
}

/* ============================================================
   7. Modals (YSS Simulator Modal & Resume Modal)
   ============================================================ */
function initModals() {
  // YSS Modal
  const openYssModalBtn = document.getElementById('open-yss-modal');
  const yssModal = document.getElementById('yss-modal');
  const closeYssModalBtn = document.getElementById('close-yss-modal');

  // Resume Modal
  const openResumeModalBtn = document.getElementById('open-resume-modal');
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeModalBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openYssModalBtn && yssModal) {
    openYssModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(yssModal);
    });
  }

  if (closeYssModalBtn && yssModal) {
    closeYssModalBtn.addEventListener('click', () => closeModal(yssModal));
  }

  if (openResumeModalBtn && resumeModal) {
    openResumeModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  }

  if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', () => closeModal(resumeModal));
  }

  // Print CV
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals on clicking overlay background
  [yssModal, resumeModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Close modals on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(yssModal);
      closeModal(resumeModal);
    }
  });
}

/* ============================================================
   8. Contact Features, Clipboard Copy, & Form Handling
   ============================================================ */
function initContactFeatures() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 2000);
        });
      }
    });
  });

  // Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim() || 'Inquiry from Portfolio';
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please fill out all required fields.';
        }
        return;
      }

      // Simulate sending and trigger mailto link
      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.textContent = `Thank you, ${name}! Opening your email client to send message...`;
      }

      showToast('Preparing your message...');

      const mailtoUrl = `mailto:mrinmoychaku@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`Hi Mrinmoy,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 900);
    });
  }
}

/* ============================================================
   Global Toast Notification
   ============================================================ */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}


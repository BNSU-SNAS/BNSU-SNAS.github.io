/* =============================================
   BSNU Orientation Day - JavaScript
   Stars, Particles, Countdown, Timeline
   ============================================= */

// ===== STARS CANVAS =====
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.6 + 0.3,
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(drawStars);
})();

// ===== PARTICLES =====
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `animation-duration:${Math.random() * 15 + 10}s`,
      `animation-delay:${Math.random() * 10}s`,
      `opacity:0`
    ].join(';');
    container.appendChild(p);
  }
})();

// ===== SCROLL REVEAL =====
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.timeline-item, .guest-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();

// ===== SINGLE COUNTDOWN + TIMELINE HIGHLIGHT =====
(function initCountdown() {
  // Event: Tuesday 22 Sep 2026, starts 11:00 AM, Egypt time (UTC+3)
  const EVENT_START_MS = new Date('2026-09-22T11:00:00+03:00').getTime();
  const EVENT_END_MS   = new Date('2026-09-22T22:00:00+03:00').getTime();

  const elH      = document.getElementById('cd-hours');
  const elM      = document.getElementById('cd-minutes');
  const elS      = document.getElementById('cd-seconds');
  const elStatus = document.getElementById('event-status');
  const items    = document.querySelectorAll('.timeline-item');

  function pad(n) { return String(Math.max(0, Math.floor(n))).padStart(2, '0'); }

  function tick() {
    const now = Date.now();

    // ---- Timeline active row highlight ----
    const d      = new Date(now);
    const hh     = pad(d.getHours());
    const mm     = pad(d.getMinutes());
    const nowStr = hh + ':' + mm;   // "HH:MM"

    items.forEach(item => {
      const s = item.dataset.start;
      const e = item.dataset.end;
      if (s && e) {
        item.classList.toggle('active', nowStr >= s && nowStr < e);
      }
    });

    // ---- Countdown display ----
    let diffMs;

    if (now >= EVENT_END_MS) {
      // Done
      if (elH) elH.textContent = '00';
      if (elM) elM.textContent = '00';
      if (elS) elS.textContent = '00';
      if (elStatus) elStatus.textContent = 'انتهت فعاليات اليوم التعريفي — شكراً لكم! 🎓';
      items.forEach(i => i.classList.remove('active'));
      if (items.length) items[items.length - 1].classList.add('active');
      return;
    }

    if (now >= EVENT_START_MS) {
      // In progress: count down to END
      diffMs = EVENT_END_MS - now;
      if (elStatus) elStatus.textContent = '🎉 الفعاليات جارية الآن! — أهلاً بطلابنا الجدد';
    } else {
      // Before event: count down to START
      diffMs = EVENT_START_MS - now;
      if (elStatus) elStatus.textContent = '⏳ الفعاليات تبدأ غداً الساعة 11 صباحاً — نراكم قريباً!';
    }

    const totalSec = Math.floor(diffMs / 1000);
    const h  = Math.floor(totalSec / 3600);
    const mn = Math.floor((totalSec % 3600) / 60);
    const sc = totalSec % 60;

    if (elH) elH.textContent = pad(h);
    if (elM) elM.textContent = pad(mn);
    if (elS) elS.textContent = pad(sc);
  }

  // Run immediately, then every 1 second exactly
  tick();
  setInterval(tick, 1000);
})();
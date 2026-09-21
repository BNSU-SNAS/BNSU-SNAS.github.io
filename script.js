/* =============================================
   BSNU Orientation Day - JavaScript
   Stars, Particles, Clock, Countdown, Timeline
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
        a:     Math.random(),
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
  const count = 18;
  for (let i = 0; i < count; i++) {
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

// ===== LIVE CLOCK =====
function updateClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ===== COUNTDOWN & TIMELINE HIGHLIGHT =====
(function initCountdown() {
  // Event date: 22 Sep 2026, starting 11:00 AM (Egypt time = UTC+3)
  const EVENT_DATE   = '2026-09-22';
  const EVENT_START  = `${EVENT_DATE}T11:00:00+03:00`;
  const EVENT_END    = `${EVENT_DATE}T22:00:00+03:00`;
  const startMs      = new Date(EVENT_START).getTime();
  const endMs        = new Date(EVENT_END).getTime();

  const cdH  = document.getElementById('cd-hours');
  const cdM  = document.getElementById('cd-minutes');
  const cdS  = document.getElementById('cd-seconds');
  const stat = document.getElementById('event-status');

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now   = Date.now();
    const items = document.querySelectorAll('.timeline-item');

    if (now >= endMs) {
      if (cdH) cdH.textContent = '00';
      if (cdM) cdM.textContent = '00';
      if (cdS) cdS.textContent = '00';
      if (stat) stat.textContent = 'انتهت فعاليات اليوم التعريفي - شكراً لكم!';
      items.forEach(i => i.classList.remove('active'));
      items[items.length - 1]?.classList.add('active');
      return;
    }

    if (now >= startMs && now < endMs) {
      // Event in progress - highlight current item
      const todayStr = EVENT_DATE;
      const nowTime  = new Date().toTimeString().slice(0,5); // HH:MM

      items.forEach(item => {
        const s = item.dataset.start;
        const e = item.dataset.end;
        if (s && e) {
          const active = nowTime >= s && nowTime < e;
          item.classList.toggle('active', active);
        }
      });

      const diff = endMs - now;
      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const mn = Math.floor((totalSec % 3600) / 60);
      const sc = totalSec % 60;
      if (cdH) cdH.textContent = pad(h);
      if (cdM) cdM.textContent = pad(mn);
      if (cdS) cdS.textContent = pad(sc);
      if (stat) stat.textContent = '🎉 الفعاليات جارية الآن! — حضور وترحيب';
      return;
    }

    // Before event
    const diff = startMs - now;
    const totalSec = Math.floor(diff / 1000);
    const h  = Math.floor(totalSec / 3600);
    const mn = Math.floor((totalSec % 3600) / 60);
    const sc = totalSec % 60;
    if (cdH) cdH.textContent = pad(h);
    if (cdM) cdM.textContent = pad(mn);
    if (cdS) cdS.textContent = pad(sc);
    if (stat) stat.textContent = `⏳ الفعاليات تبدأ ${h}:${pad(mn)}:${pad(sc)} — نراكم قريباً!`;
  }

  setInterval(update, 1000);
  update();
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

'use strict';

/* ════════════════════════════════
   INIT — no theme toggle, always dark
════════════════════════════════ */
document.documentElement.setAttribute('data-theme', 'dark');
document.getElementById('year').textContent = new Date().getFullYear();


/* ════════════════════════════════
   STARFIELD CANVAS
════════════════════════════════ */
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], mouse = { x: -9999, y: -9999 };
  const COUNT = 260, PAR = 0.016;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function mkStar() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      a: Math.random() * 0.65 + 0.2,
      speed: Math.random() * 0.1 + 0.02,
      depth: Math.random() * 2 + 0.5,
      tw: Math.random() * Math.PI * 2,
    };
  }
  function init() { stars = Array.from({ length: COUNT }, mkStar); }

  let shooters = [];
  function spawnShooter() {
    shooters.push({
      x: Math.random() * W * 0.7, y: Math.random() * H * 0.35,
      vx: Math.random() * 6 + 3, vy: Math.random() * 3 + 1.5, life: 1
    });
  }
  setInterval(spawnShooter, 3000);

  function loop(t) {
    ctx.clearRect(0, 0, W, H);
    const mx = mouse.x / W - 0.5, my = mouse.y / H - 0.5;

    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(t * 0.001 + s.tw);
      const a = s.a * (0.5 + 0.5 * tw);
      const px = s.x + mx * s.depth * PAR * W;
      const py = s.y + my * s.depth * PAR * H;
      ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,195,255,${a})`; ctx.fill();
      if (s.r > 1.1) {
        ctx.beginPath(); ctx.arc(px, py, s.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${a * 0.16})`; ctx.fill();
      }
      s.y += s.speed;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
    }

    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
      g.addColorStop(0, `rgba(230,210,255,${s.life})`);
      g.addColorStop(1, 'rgba(168,85,247,0)');
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= 0.027;
      if (s.life <= 0) shooters.splice(i, 1);
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  resize(); init(); requestAnimationFrame(loop);
})();


/* ════════════════════════════════
   FLOATING NAV BUBBLE
════════════════════════════════ */
(function () {
  const links  = document.querySelectorAll('.nav-link');
  const bubble = document.getElementById('navBubble');
  const track  = document.getElementById('navLinks');
  if (!bubble || !track) return;

  function snap(el) {
    const tr = track.getBoundingClientRect();
    const lr = el.getBoundingClientRect();
    bubble.style.left  = (lr.left - tr.left - 8) + 'px';
    bubble.style.width = (lr.width + 16) + 'px';
  }

  setTimeout(() => {
    const a = document.querySelector('.nav-link.active'); if (a) snap(a);
  }, 60);

  links.forEach(l => {
    l.addEventListener('mouseenter', () => snap(l));
    l.addEventListener('click', () => {
      links.forEach(x => x.classList.remove('active'));
      l.classList.add('active'); snap(l);
    });
  });
  track.addEventListener('mouseleave', () => {
    const a = document.querySelector('.nav-link.active'); if (a) snap(a);
  });

  const sections = ['hero','about','experience','projects','contact'];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
        const a = document.querySelector('.nav-link.active'); if (a) snap(a);
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
})();


/* ════════════════════════════════
   PROJECTS — STICKY NUMBER FLIP
════════════════════════════════ */
(function () {
  const panels = document.querySelectorAll('.proj-panel');
  const numEl  = document.getElementById('projNum');
  if (!panels.length || !numEl) return;

  const NUMS = ['01.', '02.', '03.', '04.', '05.'];
  let current = 0;

  numEl.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease';
  numEl.textContent = NUMS[0];

  function setNum(idx) {
    if (idx === current) return;
    current = idx;
    numEl.style.transform = 'translateY(-14px)';
    numEl.style.opacity   = '0';
    setTimeout(() => {
      numEl.textContent     = NUMS[idx] || (String(idx + 1).padStart(2, '0') + '.');
      numEl.style.transform = 'translateY(0)';
      numEl.style.opacity   = '1';
      numEl.style.webkitTextStroke = '2px rgba(168,85,247,0.7)';
    }, 220);
    setTimeout(() => {
      numEl.style.webkitTextStroke = '2px rgba(168,85,247,0.35)';
    }, 750);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) setNum(parseInt(e.target.dataset.index, 10));
    });
  }, { threshold: 0.4 });
  panels.forEach(p => obs.observe(p));
})();


/* ════════════════════════════════
   SCROLL REVEAL
════════════════════════════════ */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('reveal-item')
          ? Array.from(entry.target.parentNode.children).indexOf(entry.target) * 90 : 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-item').forEach(t => obs.observe(t));
})();


/* ════════════════════════════════
   PROJECT MODAL DATA
════════════════════════════════ */
const projectData = {
  'TripMate': {
    meta: '2026 · Full-Stack Web Application',
    title: 'TripMate — Travel Planning App',
    description: 'A full-stack collaborative travel planning platform where users can organize trips, manage itineraries, and collaborate in real time. Built with React and MongoDB with a custom Figma-designed UI focused on intuitive UX and managed via GitHub.',
    highlights: [
      'Full-stack architecture: React frontend, Node.js backend, MongoDB database',
      'Custom Figma UI/UX design prioritizing clarity and collaborative workflows',
      'Real-time data management for trip itineraries and shared planning',
      'Version control and team collaboration managed through GitHub',
    ],
    tags: ['React', 'HTML', 'CSS', 'JavaScript', 'MongoDB', 'Figma', 'GitHub'],
  },
  'Horse Racing DB': {
    meta: '2025 · Full-Stack Database Application',
    title: 'Horse Racing Database System',
    description: 'A full-stack racing administration system built with Streamlit and MySQL. Features role-based access control for Admin and Guest users, custom CSS/HTML styling within Streamlit, and a relational database for managing real-time race data, trainers, and stables.',
    highlights: [
      'Designed a normalized relational MySQL database schema for race data management',
      'Built a Streamlit interface with custom CSS/HTML for a polished visual experience',
      'Implemented role-based access: Admins manage all data; Guests browse records',
      'Supported real-time queries for races, trainers, horses, and results',
    ],
    tags: ['Python', 'Streamlit', 'MySQL', 'SQL', 'HTML', 'CSS'],
  },
  'Habitly': {
    meta: '2025 · Frontend Web Application',
    title: 'Habitly — Habit Tracker Web App',
    description: 'A gamified productivity app with a sarcastic feedback system designed to keep users accountable in a fun way. Features a multi-page layout, Chart.js data visualizations for progress tracking, and a custom dark-theme UI designed from scratch in Figma.',
    highlights: [
      'Gamified habit-tracking system with a unique sarcastic AI feedback personality',
      'Multi-page layout with smooth navigation and persistent state handling',
      'Chart.js visualizations showing habit streaks, completion rates, and progress over time',
      'Custom dark-theme UI fully designed in Figma before implementation',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'Figma'],
  },
};

function showProject(name) {
  const d = projectData[name]; if (!d) return;
  document.getElementById('modalMeta').textContent        = d.meta;
  document.getElementById('modalTitle').textContent       = d.title;
  document.getElementById('modalDescription').textContent = d.description;
  const ul = document.getElementById('modalHighlights'); ul.innerHTML = '';
  d.highlights.forEach(h => { const li = document.createElement('li'); li.textContent = h; ul.appendChild(li); });
  const tagsEl = document.getElementById('modalTags'); tagsEl.innerHTML = '';
  d.tags.forEach(t => { const s = document.createElement('span'); s.textContent = t; tagsEl.appendChild(s); });
  document.getElementById('projectModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('projectModal').style.display = 'none';
  document.body.style.overflow = '';
}
window.showProject = showProject;
window.closeModal  = closeModal;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ════════════════════════════════
   CONTACT FORM — EmailJS
   ─────────────────────────────────
   SETUP (one-time, 5 minutes):
   1. Go to https://www.emailjs.com and create a free account
   2. Add a service: Gmail → connect your Nabaalali99@gmail.com
      → copy the "Service ID" → paste below as EMAILJS_SERVICE_ID
   3. Create an email template:
      Subject:  New message from {{from_name}}
      Body:     Name: {{from_name}}
                Email: {{from_email}}
                Message: {{message}}
      → copy the "Template ID" → paste below as EMAILJS_TEMPLATE_ID
   4. Go to Account → copy your "Public Key" → paste below as EMAILJS_PUBLIC_KEY
════════════════════════════════ */

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace

const form     = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

function setErr(id, msg) { document.getElementById(id).textContent = msg; }
function clearErrs() { ['nameErr','emailErr','msgErr'].forEach(id => setErr(id,'')); }

form?.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrs();
  statusEl.textContent = '';

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let ok = true;

  if (name.length < 2)
    { setErr('nameErr', 'Name must be at least 2 characters.'); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    { setErr('emailErr', 'Please enter a valid email.'); ok = false; }
  if (message.length < 5)
    { setErr('msgErr', 'Message must be at least 5 characters.'); ok = false; }

  if (!ok) { statusEl.textContent = '⚠ Please fix the errors above.'; return; }

  // disable button while sending
  const btn = form.querySelector('.submit-btn');
  btn.disabled = true;
  statusEl.textContent = 'Sending…';

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { from_name: name, from_email: email, message },
      EMAILJS_PUBLIC_KEY
    );
    statusEl.textContent = '✦ Message sent! I\'ll get back to you soon.';
    statusEl.style.color = '#a855f7';
    form.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    statusEl.textContent = '✕ Something went wrong. Try emailing me directly at Nabaalali99@gmail.com';
    statusEl.style.color = '#f87171';
  } finally {
    btn.disabled = false;
  }
});


/* ════════════════════════════════
   BACK TO TOP
════════════════════════════════ */
const toTopBtn = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTopBtn.classList.toggle('visible', window.scrollY > 340);
}, { passive: true });
toTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
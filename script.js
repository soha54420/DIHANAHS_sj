/* ─── HONEY HOUR · script.js ─────────────────────────────────
   To add real audio:
   1. Download a royalty-free lo-fi track from youtube.com/audiolibrary
   2. Place it in the same folder as this file (e.g. lofi.mp3)
   3. Uncomment the audio lines below and set the src
──────────────────────────────────────────────────────────── */

// ── AUDIO SETUP (uncomment to enable) ──────────────────────
// const audio = new Audio('lofi.mp3');
// audio.loop = true;
// audio.volume = 0.5;

// ── PLAYER STATE ────────────────────────────────────────────
let isPlaying = false;
let progress = 0;
let progressInterval = null;
const TRACK_DURATION = 207; // 3:27 in seconds
let elapsed = 0;

const playBtn      = document.getElementById('playBtn');
const vinyl        = document.getElementById('vinyl');
const progressFill = document.getElementById('progressFill');
const progressThumb= document.getElementById('progressThumb');
const currentTime  = document.getElementById('currentTime');

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function updateProgress() {
  elapsed++;
  if (elapsed >= TRACK_DURATION) { elapsed = 0; }
  const pct = (elapsed / TRACK_DURATION) * 100;
  progressFill.style.width  = pct + '%';
  progressThumb.style.left  = pct + '%';
  currentTime.textContent   = formatTime(elapsed);
}

playBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;

  if (isPlaying) {
    playBtn.textContent = '⏸';
    vinyl.classList.add('spinning');
    progressInterval = setInterval(updateProgress, 1000);
    // audio.play();  // uncomment when audio is set up
  } else {
    playBtn.textContent = '▶';
    vinyl.classList.remove('spinning');
    clearInterval(progressInterval);
    // audio.pause(); // uncomment when audio is set up
  }
});

// prev/next just reset for demo
document.getElementById('prevBtn').addEventListener('click', () => {
  elapsed = 0;
  updateProgress();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  elapsed = 0;
  updateProgress();
});

// ── RAIN GENERATOR ──────────────────────────────────────────
const rainContainer = document.getElementById('rainContainer');
const RAIN_COUNT = 38;

for (let i = 0; i < RAIN_COUNT; i++) {
  const drop = document.createElement('div');
  drop.className = 'raindrop';

  const left     = Math.random() * 100;
  const height   = 18 + Math.random() * 28;
  const duration = 0.7 + Math.random() * 1.0;
  const delay    = Math.random() * 2.5;

  drop.style.cssText = `
    left: ${left}%;
    height: ${height}px;
    animation-duration: ${duration}s;
    animation-delay: -${delay}s;
  `;
  rainContainer.appendChild(drop);
}

// ── FLOATING PARTICLES ──────────────────────────────────────
const canvas  = document.getElementById('particles');
const ctx     = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x    = Math.random() * canvas.width;
    this.y    = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size = 0.8 + Math.random() * 1.5;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = -(0.15 + Math.random() * 0.35);
    this.alpha= 0.1 + Math.random() * 0.45;
    this.fade = 0.001 + Math.random() * 0.002;
  }

  update() {
    this.x    += this.vx;
    this.y    += this.vy;
    this.alpha -= this.fade;
    if (this.alpha <= 0 || this.y < -10) { this.reset(); }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 223, 160, ${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 55; i++) { particles.push(new Particle()); }

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

animateParticles();

// ── SMOOTH NAV ACTIVE STATE ──────────────────────────────────
const sections  = document.querySelectorAll('section[id], footer[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => observer.observe(s));

// ── FADE IN ON SCROLL ────────────────────────────────────────
const fadeEls = document.querySelectorAll('.scene-card, .player-card');

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => fadeObserver.observe(el));
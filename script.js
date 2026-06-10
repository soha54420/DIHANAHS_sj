/* ─── HONEY HOUR · script.js ─────────────────────────────── */

// ── PLAYLIST ────────────────────────────────────────────────
const tracks = [
  { name: "Car Drive By",                    file: "Car Drive By.mp3" },
  { name: "Daytime Forrest Bonfire",         file: "Daytime Forrest Bonfire.mp3" },
  { name: "Woodpecker Eating Distant",       file: "Woodpecker Eating Distant.mp3" },
  { name: "Nebula",                          file: "Nebula - The Grey Room _ Density & Time.mp3" },
  { name: "Obon Fog",                        file: "Obon Fog - The Mini Vandals.mp3" },
  { name: "Red Shift",                       file: "Red Shift - The Grey Room _ Density & Time.mp3" },
  { name: "Burned Out",                      file: "Burned out - Patrick Jordan Patrikios.mp3" },
  { name: "Highway Whispers",                file: "Highway whispers - Patrick Jordan Patrikios.mp3" },
];

let currentIndex = 0;
let isPlaying    = false;
let progressInterval = null;

const audio = new Audio();
audio.volume = 0.5;
audio.loop   = false;

// ── DOM REFS ─────────────────────────────────────────────────
const playBtn       = document.getElementById('playBtn');
const vinyl         = document.getElementById('vinyl');
const progressFill  = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const currentTime   = document.getElementById('currentTime');
const trackName     = document.querySelector('.track-name');
const trackSub      = document.querySelector('.track-sub');

// ── LOAD TRACK ───────────────────────────────────────────────
function loadTrack(index) {
  const track = tracks[index];
  audio.src   = track.file;
  trackName.textContent = track.name;
  trackSub.textContent  = "lofi beats · loading...";
  updateProgressUI(0, 0);
  currentTime.textContent = "0:00";

  audio.addEventListener('loadedmetadata', () => {
    const dur = Math.floor(audio.duration);
    trackSub.textContent = `lofi beats · ${formatTime(dur)}`;
  }, { once: true });
}

// ── PLAY / PAUSE ─────────────────────────────────────────────
function play() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = '⏸';
  vinyl.classList.add('spinning');
  clearInterval(progressInterval);
  progressInterval = setInterval(syncProgress, 500);
}

function pause() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '▶';
  vinyl.classList.remove('spinning');
  clearInterval(progressInterval);
}

playBtn.addEventListener('click', () => {
  if (isPlaying) { pause(); } else { play(); }
});

// ── PREV / NEXT ──────────────────────────────────────────────
document.getElementById('prevBtn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentIndex);
  if (isPlaying) play();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  if (isPlaying) play();
});

// auto next when track ends
audio.addEventListener('ended', () => {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  play();
});

// ── PROGRESS SYNC ────────────────────────────────────────────
function syncProgress() {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  updateProgressUI(pct, audio.currentTime);
}

function updateProgressUI(pct, time) {
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  currentTime.textContent  = formatTime(Math.floor(time));
}

// click on progress bar to seek
document.querySelector('.progress-bar').addEventListener('click', (e) => {
  const bar = e.currentTarget;
  const pct = e.offsetX / bar.offsetWidth;
  audio.currentTime = pct * audio.duration;
  syncProgress();
});

// ── HELPERS ──────────────────────────────────────────────────
function formatTime(s) {
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ── INIT ─────────────────────────────────────────────────────
loadTrack(currentIndex);

// ── RAIN GENERATOR ───────────────────────────────────────────
const rainContainer = document.getElementById('rainContainer');
const RAIN_COUNT = 38;

for (let i = 0; i < RAIN_COUNT; i++) {
  const drop     = document.createElement('div');
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

// ── FLOATING PARTICLES ───────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x     = Math.random() * canvas.width;
    this.y     = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size  = 0.8 + Math.random() * 1.5;
    this.vx    = (Math.random() - 0.5) * 0.3;
    this.vy    = -(0.15 + Math.random() * 0.35);
    this.alpha = 0.1 + Math.random() * 0.45;
    this.fade  = 0.001 + Math.random() * 0.002;
  }
  update() {
    this.x     += this.vx;
    this.y     += this.vy;
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

const particles = [];
for (let i = 0; i < 55; i++) { particles.push(new Particle()); }

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── SMOOTH NAV ACTIVE STATE ──────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
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
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => fadeObserver.observe(el));
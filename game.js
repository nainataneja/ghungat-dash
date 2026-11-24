// ===== TUNE THE GAME HERE =====
const CONFIG = {
  timeLimit: 40,        // seconds on the clock
  speed: 500,           // px/s run speed
  courseSec: 25,        // course length in seconds of clean running (door position)
  jumpV: 800,           // jump power
  gravity: 2500,         // higher = shorter hops, so you can't just spam jump
  heroX: 200,           // hero's screen x
  pickupHeight: 170,    // how high power-ups float (needs a jump)
  stumbleSlow: 0.4,     // speed multiplier while stumbling
  stumbleSecs: 0.6,
  stumbleCost: 1,       // seconds lost for hitting a jump-over obstacle
  maxScale: 3,          // max canvas render scale on desktop
  maxScaleTouch: 2,     // lower cap on touch devices (saves battery/GPU)
  vignetteStart: 0.5,   // ghungat covers screen from this fraction to the right edge
};
const W = 960, H = 540, G = 440; // canvas size, ground y

// kind: obs = jump-over, pen = penalty, up = power-up. delta = seconds. w/h = hitbox.
const ITEMS = {
  table:   { k: 'obs', w: 90,  h: 50, draw: drawTable,   say: ['Khaana kab banega?'] },
  jhadu:   { k: 'obs', w: 70,  h: 70, draw: drawJhadu,   say: ['Pocha baaki hai!'] },
  bed:     { k: 'obs', w: 90,  h: 50, draw: drawBed,     say: ['Bistar kaun lagayega?'] },
  uncle:   { k: 'obs', w: 110, h: 65, draw: drawUncle,   say: ['Ek glass paani dena?'] },
  brother: { k: 'pen', w: 44,  h: 80, draw: drawBrother, delta: 2, say: ['Bhaiya ko Maggi chahiye!'] },
  guests:  { k: 'pen', w: 70,  h: 95, draw: drawGuests,  delta: 5, say: ['Beta, shaadi kab?', 'Chai banao!'] },
  laundry: { k: 'pen', w: 64,  h: 80, draw: drawLaundry, delta: 3, say: ['Sirf 4 loads aur...'] },
  salary:  { k: 'up',  w: 56,  h: 56, draw: drawSalary,  delta: 2, say: ['Apni kamaai!'] },
  food:    { k: 'up',  w: 80,  h: 70, draw: drawFood,    delta: 5, say: ['Aaj khana nahi banega!'] },
  daylight:{ k: 'up',  w: 56,  h: 56, draw: drawDaylight,delta: 3, say: ['Din thoda lamba ho gaya'] },
};
// [seconds into the course, item]. Edit freely.
const COURSE = [
  [5, 'table'], [7.6, 'jhadu'], [10.2, 'bed'], [11.2, 'salary'], [13.4, 'laundry'],
  [15.6, 'uncle'], [17.4, 'brother'], [19.4, 'bed'], [16.5, 'daylight'], [21.4, 'guests'],
  [23.6, 'table'], [25.6, 'food'], [27.2, 'uncle'], [30, 'brother'], [33.6, 'guests'],
  [35.6, 'bed'], [37.2, 'salary'], [38.8, 'jhadu'], [41, 'laundry'], [43, 'food'],
  [24.6, 'laundry'], [28.2, 'daylight'], [36.8, 'brother'],
];
const COURSE_BASE = 45; // COURSE times are written for a 45s course; they auto-scale to CONFIG.courseSec

const cv = document.getElementById('cv'), c = cv.getContext('2d');
// render at the screen's real resolution so text stays sharp (game logic still uses 960x540)
let SC = 1;
const TOUCH = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
function fit() {
  const vv = window.visualViewport, vw = vv ? vv.width : innerWidth, vh = vv ? vv.height : innerHeight;
  const cssW = Math.min(vw, vh * 16 / 9);
  cv.style.width = cssW + 'px'; cv.style.height = cssW * 9 / 16 + 'px';
  SC = Math.max(1, Math.min(TOUCH ? CONFIG.maxScaleTouch : CONFIG.maxScale, cssW / W * (devicePixelRatio || 1)));
  cv.width = Math.round(W * SC); cv.height = Math.round(H * SC);
}
fit(); addEventListener('resize', fit); addEventListener('orientationchange', () => setTimeout(fit, 200)); if (window.visualViewport) visualViewport.addEventListener('resize', fit);
let state = 'start', stateAt = 0, clock = 0;
let react, loseLine, camX, timeLeft, h, vy, stumble, shake, pulse, items, popups, confetti, spare;

function reset() {
  camX = 0; timeLeft = CONFIG.timeLimit; h = 0; vy = 0; stumble = 0; shake = 0; pulse = 0;
  popups = []; confetti = []; react = null;
  items = COURSE.map(([t, type]) => ({ type, x: t / COURSE_BASE * CONFIG.courseSec * CONFIG.speed, hit: false }));
}
reset();
function setState(s) { state = s; stateAt = clock; if (s === 'play') reset(); }

// tiny beeps, no audio files
let ac;
function beep(f, d, type) {
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'square'; o.frequency.value = f;
    g.gain.value = 0.06; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.stop(ac.currentTime + d);
  } catch (e) {}
}

function jump() {
  if (state === 'play') { if (h === 0) { vy = CONFIG.jumpV; h = 1; beep(520, 0.1); } }
  else if (clock - stateAt > 0.5) setState('play');
}
addEventListener('keydown', e => { if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) { e.preventDefault(); if (!e.repeat) jump(); } });
document.addEventListener('pointerdown', e => { e.preventDefault(); jump(); });

function pop(text, col, x, y) { popups.push({ text, col, x, y, life: 1.6 }); }
function hitItem(it) {
  const d = ITEMS[it.type], say = d.say[Math.floor(Math.random() * d.say.length)];
  it.hit = true; pulse = 1; react = { e: d.k === 'up' ? '😍' : d.k === 'pen' ? '😮‍💨' : '😵', life: 1.2 };
  if (d.k === 'up') { timeLeft += d.delta; pop('+' + d.delta + 's  ' + say, '#1E9E3A', CONFIG.heroX, G - 150); beep(880, 0.15, 'triangle'); beep(1170, 0.2, 'triangle'); }
  else if (d.k === 'pen') { timeLeft -= d.delta; shake = 12; pop('-' + d.delta + 's  ' + say, '#D01818', CONFIG.heroX, G - 150); beep(140, 0.3, 'sawtooth'); }
  else { timeLeft -= CONFIG.stumbleCost; stumble = CONFIG.stumbleSecs; shake = 7; pop('Oof! -' + CONFIG.stumbleCost + 's  ' + say, '#E07000', CONFIG.heroX, G - 150); beep(200, 0.2, 'square'); }
}

function update(dt) {
  clock += dt;
  popups.forEach(p => { p.life -= dt; p.y -= 40 * dt; }); popups = popups.filter(p => p.life > 0);
  confetti.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt; }); confetti = confetti.filter(p => p.y < H + 20);
  if (react) react.life -= dt; shake = Math.max(0, shake - 40 * dt); pulse = Math.max(0, pulse - 3 * dt);
  if (state !== 'play') return;
  timeLeft -= dt; stumble = Math.max(0, stumble - dt);
  camX += CONFIG.speed * (stumble > 0 ? CONFIG.stumbleSlow : 1) * dt;
  if (h > 0) { vy -= CONFIG.gravity * dt; h += vy * dt; if (h <= 0) { h = 0; vy = 0; } }
  // collisions: hero box vs item boxes
  const hx = CONFIG.heroX, hTop = G - h - 95, hBot = G - h;
  for (const it of items) {
    if (it.hit) continue;
    const d = ITEMS[it.type], sx = it.x - camX + hx;
    if (sx < -100 || sx > W + 100) continue;
    const top = d.k === 'up' ? G - CONFIG.pickupHeight - d.h / 2 : G - d.h, bot = d.k === 'up' ? top + d.h : G;
    if (Math.abs(sx - hx) < d.w / 2 + 12 && hTop < bot && hBot > top) hitItem(it);
  }
  if (timeLeft <= 0) { timeLeft = 0; loseLine = ['Mehmaan abhi bhi baithe hain.', 'Bhaiya ka Maggi abhi bhi pending hai.', 'Kapde sukhne ka time ho gaya. Tumhara nahi.', 'Dinner kya banega? (Aapko pata hai.)'][Math.floor(Math.random() * 4)]; setState('lose'); beep(110, 0.6, 'sawtooth'); }
  else if (camX >= CONFIG.courseSec * CONFIG.speed - 30) {
    spare = Math.ceil(timeLeft); setState('win'); beep(660, 0.2); beep(880, 0.2); beep(1320, 0.4);
    for (let i = 0; i < 120; i++) confetti.push({ x: Math.random() * W, y: -Math.random() * 200, vx: (Math.random() - 0.5) * 120, vy: 60 + Math.random() * 200, col: ['#F4A300', '#E0218A', '#00657F', '#FFD23F'][i % 4] });
  }
}

// big readable name tags above every item
const TAGS = { table: ['TABLE', 70], jhadu: ['JHADU', 90], bed: ['BED', 80], uncle: ['UNCLE', 110], brother: ['BHAIYA', 105], guests: ['MEHMAAN', 140], laundry: ['LAUNDRY', 105], salary: ['SALARY'], food: ['FOOD'], daylight: ['DAYLIGHT'] };
function label(it) { const d = ITEMS[it.type]; return TAGS[it.type][0] + (d.delta ? (d.k === 'up' ? ' +' : ' -') + d.delta + 's' : ''); }
function tag(it, sx) { // moving text can't be read at speed, so items only get a colour-coded arrow; names show in the fixed banner
  sx = Math.round(sx); const d = ITEMS[it.type], y = d.k === 'up' ? G - CONFIG.pickupHeight - 46 : G - TAGS[it.type][1] - 8;
  c.fillStyle = d.k === 'up' ? '#1E9E3A' : d.k === 'pen' ? '#D01818' : '#444';
  c.beginPath(); c.moveTo(sx - 12, y - 22); c.lineTo(sx + 12, y - 22); c.lineTo(sx, y); c.fill();
}
function drawWorld() {
  const PW = 812, S = 440 / 260, off = camX * 0.5;
  for (let i = Math.floor(off / PW); i <= Math.floor(off / PW) + 1; i++) {
    c.save(); c.translate(i * PW - off, 0); c.scale(S, S);
    (i % 2 ? drawBgUtility : drawBgKitchen)(c, 0, 0); c.restore();
  }
  drawFloor(c, 0, G, W, H - G, camX);
  const doorX = CONFIG.courseSec * CONFIG.speed + 80 - camX + CONFIG.heroX;
  drawDoor(c, doorX, G, clock);
  for (const it of items) {
    const d = ITEMS[it.type], sx = it.x - camX + CONFIG.heroX;
    if (sx < -150 || sx > W + 150 || (it.hit && d.k === 'up')) continue;
    c.globalAlpha = it.hit ? 0.4 : 1;
    if (d.k === 'up') d.draw(c, sx, G - CONFIG.pickupHeight + Math.sin(clock * 4 + it.x) * 6, clock);
    else d.draw(c, sx, G, clock);
    tag(it, sx);
    c.globalAlpha = 1;
  }
  const wob = stumble > 0 ? Math.sin(clock * 40) * 3 : 0;
  E(c, 'rgba(0,0,0,0.2)', CONFIG.heroX, G, 22 - h / 10, 5);
  drawHeroine(c, CONFIG.heroX + wob, G - h, clock, h > 0);
  if (react && react.life > 0) { const bx = CONFIG.heroX + 36, by = G - h - 124; C(c, '#fff', bx - 22, by + 30, 3); C(c, '#fff', bx - 14, by + 20, 5); E(c, '#fff', bx, by, 22, 17); c.strokeStyle = '#999'; c.lineWidth = 1; c.beginPath(); c.ellipse(bx, by, 22, 17, 0, 0, 7); c.stroke(); T(c, react.e, bx, by + 9, 26); }
}
function drawVignette() { // the ghungat: she can't see what's ahead
  const g = c.createLinearGradient(W * CONFIG.vignetteStart, 0, W, 0);
  g.addColorStop(0, 'rgba(120,20,80,0)'); g.addColorStop(0.3, 'rgba(120,20,80,0.8)'); g.addColorStop(0.55, 'rgba(60,8,50,1)'); g.addColorStop(1, 'rgba(40,4,35,1)');
  c.fillStyle = g; c.fillRect(W * CONFIG.vignetteStart, 0, W * (1 - CONFIG.vignetteStart), H);
  T(c, 'ghungat: ON. what lies ahead? who knows.', W - 160, 70, 11, 'rgba(255,255,255,0.7)');
}
function outline(s, x, y, size, fill, stroke, align) {
  c.font = 'bold ' + size + 'px sans-serif'; c.textAlign = align || 'center'; x = Math.round(x); y = Math.round(y); c.lineWidth = 5; c.strokeStyle = stroke || '#fff'; c.lineJoin = 'round'; c.strokeText(s, x, y); c.fillStyle = fill; c.fillText(s, x, y);
}
function drawHud() {
  const low = timeLeft < 10 && Math.floor(clock * 4) % 2 === 0;
  const s = 1 + pulse * 0.3;
  c.save(); c.translate(W / 2, 62); c.scale(s, s);
  outline(String(Math.ceil(timeLeft)).padStart(2, '0') + 's', 0, 0, 54, low ? '#D01818' : P.blue, '#fff'); c.restore();
  const frac = Math.min(1, camX / (CONFIG.courseSec * CONFIG.speed));
  R(c, 'rgba(0,0,0,0.25)', W / 2 - 150, 80, 300, 8); R(c, P.pink, W / 2 - 150, 80, 300 * frac, 8);
  outline('GHAR', W / 2 - 170, 89, 11, P.dark, '#fff', 'right'); outline('SOCIETY', W / 2 + 170, 89, 11, P.dark, '#fff', 'left');
  outline('LEVEL 1: Ghar ka Kaam', 16, 28, 16, P.red, '#fff', 'left');
  // fixed banner: names the next item that has come out of the ghungat shadow (static text is readable)
  let near = null;
  for (const it of items) { const sx = it.x - camX + CONFIG.heroX; if (!it.hit && sx > CONFIG.heroX + 30 && sx < W * 0.68 && (!near || sx < near.sx)) near = { sx, it }; }
  if (near && state === 'play') {
    const names = items.filter(i => !i.hit && Math.abs(i.x - near.it.x) < 60).map(label).join('  &  ');
    c.font = 'bold 28px sans-serif'; const w = c.measureText(names).width + 36;
    const kind = ITEMS[near.it.type].k; c.fillStyle = kind === 'up' ? '#1E9E3A' : kind === 'pen' ? '#D01818' : '#444';
    c.fillRect(Math.round(W / 2 - w / 2), 108, Math.round(w), 40); c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(names, W / 2, 138);
  }
  for (const p of popups) { c.globalAlpha = Math.min(1, p.life); outline(p.text, Math.min(Math.max(p.x + 20, 160), W - 200), p.y, 22, p.col, '#fff'); c.globalAlpha = 1; }
}
function overlay(title, lines, color) {
  c.fillStyle = 'rgba(20,8,30,0.82)'; c.fillRect(0, 0, W, H);
  outline(title, W / 2, 160, 56, color, '#000');
  lines.forEach((l, i) => outline(l, W / 2, 230 + i * 34, i === lines.length - 1 ? 20 : 22, i === lines.length - 1 ? P.haldi : '#fff', '#000'));
}
function draw() {
  c.setTransform(SC, 0, 0, SC, 0, 0);
  c.save(); c.clearRect(0, 0, W, H);
  if (shake > 0) c.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  drawWorld(); drawVignette(); c.restore();
  if (state === 'start') {
    overlay('GHUNGAT DASH', ['60 seconds. 4 rooms. 0 help.', 'Jump over chores. Dodge relatives. Grab salary.', 'Reach the Society Level Up door.', (TOUCH ? 'Tap' : 'Press SPACE') + ' to escape the ghar'], P.marigold);
    drawHeroine(c, W / 2, 470, clock, false);
  } else { drawHud(); }
  if (state === 'win') {
    overlay('SOCIETY LEVEL UP!', ['Unlocked: Opinions | Sunday Mornings | Own Bank Account', 'Time left: ' + spare + 's. Chai can wait.', 'Level 2: the ghungat comes off. See what lies ahead.', (TOUCH ? 'Tap' : 'Press SPACE') + ' to run again'], P.haldi);
    confetti.forEach(p => R(c, p.col, p.x, p.y, 8, 5));
  }
  if (state === 'lose') overlay('TIME\'S UP!', ['Chai is ready though.', loseLine, (TOUCH ? 'Tap' : 'Press SPACE') + ' to try again'], '#FF5555');
}
let last = 0;
function loop(ms) { const dt = Math.min(0.05, (ms - last) / 1000 || 0); last = ms; update(dt); draw(); requestAnimationFrame(loop); }
requestAnimationFrame(loop);

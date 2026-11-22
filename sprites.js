// Ghungat Dash sprites. Every drawX(c, x, y, ...) draws at center-x, ground-y (feet) unless noted "centered".
const P = {
  marigold: '#F4A300', pink: '#E0218A', blue: '#00657F', haldi: '#FFD23F', cream: '#F6E7C8',
  red: '#C1121F', skin: '#C68642', skin2: '#E0AC69', dark: '#2B2B2B', white: '#FFFFFF',
  wall: '#EAD7B0', floor: '#B5835A', wood: '#7A4A21', steel: '#B8C0C8',
};
const R = (c, col, x, y, w, h) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
const C = (c, col, x, y, r) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
const E = (c, col, x, y, rx, ry) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); };
const T = (c, s, x, y, size, col, align) => { c.font = 'bold ' + size + 'px sans-serif'; c.fillStyle = col || P.dark; c.textAlign = align || 'center'; c.fillText(s, x, y); };
const POLY = (c, col, pts) => { c.fillStyle = col; c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath(); c.fill(); };


// ---------- PENALTIES ----------
function drawBrother(c, x, y, t) { // babysit older brother: -2s
  const w = Math.sin(t * 6) * 2;
  R(c, P.dark, x - 16, y - 12, 12, 12); R(c, P.dark, x + 4, y - 12, 12, 12);
  R(c, '#5B8DEF', x - 18, y - 58, 36, 48);
  R(c, P.white, x - 11, y - 55, 22, 18); T(c, 'BHAIYA', x, y - 42, 8, P.pink);
  C(c, P.skin, x, y - 72, 16);
  c.fillStyle = '#FFB6D9'; c.beginPath(); c.arc(x, y - 76, 19, Math.PI, 0); c.fill(); R(c, '#FFB6D9', x - 19, y - 77, 38, 6);
  for (let i = -2; i <= 2; i++) C(c, P.white, x + i * 8, y - 70, 3);
  C(c, P.pink, x - 5, y - 57, 4); C(c, P.pink, x + 5, y - 57, 4);
  C(c, P.dark, x - 6, y - 74, 2); C(c, P.dark, x + 6, y - 74, 2);
  E(c, P.dark, x - 7, y - 65, 8, 3); E(c, P.dark, x + 7, y - 65, 8, 3);
  R(c, P.white, x + 20, y - 52 + w, 8, 20); R(c, P.haldi, x + 20, y - 57 + w, 8, 6);
  R(c, P.dark, x - 34, y - 42, 16, 9); C(c, P.red, x - 28, y - 38, 2); C(c, P.haldi, x - 23, y - 38, 2);
  T(c, 'MAGGI!', x, y - 100, 12, P.red);
}
function drawGuests(c, x, y, t) { // guests at home: -5s
  R(c, P.wood, x - 38, y - 96, 76, 96); R(c, '#F9EFD9', x - 32, y - 90, 64, 90);
  const b = Math.sin(t * 5) * 2;
  // aunty with bindi and bun
  C(c, P.dark, x - 20, y - 78 + b, 9); C(c, P.skin2, x - 20, y - 66 + b, 11); C(c, P.red, x - 20, y - 70 + b, 2);
  R(c, P.pink, x - 31, y - 55 + b, 22, 14);
  // uncle with glasses
  C(c, P.skin, x + 2, y - 70 - b, 11); R(c, P.dark, x - 8, y - 72 - b, 20, 2); C(c, P.dark, x - 3, y - 72 - b, 4); C(c, P.dark, x + 7, y - 72 - b, 4);
  R(c, P.white, x - 10, y - 59 - b, 24, 16);
  // kid
  C(c, P.skin2, x + 24, y - 54, 8); R(c, P.marigold, x + 17, y - 46, 14, 12);
  // suitcase
  R(c, '#8B2E2E', x + 6, y - 22, 28, 22); R(c, P.haldi, x + 17, y - 26, 6, 4); R(c, P.haldi, x + 6, y - 12, 28, 2);
  // bubble
  E(c, P.white, x, y - 112, 36, 12); T(c, 'DING DONG!', x, y - 108, 11, P.red);
}

// ---------- POWER-UPS (centered on x, y; they float) ----------
function drawSalary(c, x, y, t) { // +2s
  const f = Math.sin(t * 16) * 5;
  E(c, P.white, x - 22, y - 6 - f, 14, 6); E(c, P.white, x + 22, y - 6 - f, 14, 6);
  R(c, P.cream, x - 18, y - 12, 36, 24); POLY(c, '#E8D3A2', [x - 18, y - 12, x + 18, y - 12, x, y + 2]);
  T(c, '₹', x, y + 11, 16, P.blue);
}
function drawFood(c, x, y, t) { // +5s
  const b = Math.sin(t * 12);
  C(c, P.dark, x - 20, y + 16, 8); C(c, P.dark, x + 20, y + 16, 8); C(c, P.steel, x - 20, y + 16, 3); C(c, P.steel, x + 20, y + 16, 3);
  R(c, P.pink, x - 24, y + 4, 48, 8); R(c, P.dark, x + 14, y - 14, 3, 20);
  R(c, P.marigold, x - 26, y - 22 + b, 26, 24); T(c, '🍛', x - 13, y - 3 + b, 15);
  c.strokeStyle = P.dark; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 12, y - 14); c.lineTo(x + 24, y - 14); c.stroke();
  T(c, '~', x - 36, y - 2, 14, '#999'); T(c, '~', x - 40, y + 8, 14, '#999');
}
function drawDaylight(c, x, y, t) { // +3s
  const r = t * 2; c.strokeStyle = P.marigold; c.lineWidth = 4;
  for (let i = 0; i < 10; i++) { const a = r + i * Math.PI / 5; c.beginPath(); c.moveTo(x + Math.cos(a) * 20, y + Math.sin(a) * 20); c.lineTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30); c.stroke(); }
  C(c, P.haldi, x, y, 18);
  R(c, P.dark, x - 14, y - 7, 12, 8); R(c, P.dark, x + 2, y - 7, 12, 8); R(c, P.dark, x - 3, y - 6, 6, 2);
  c.strokeStyle = P.dark; c.lineWidth = 2; c.beginPath(); c.arc(x, y + 3, 8, 0.2, Math.PI - 0.2); c.stroke();
}

function drawJhadu(c, x, y) { // jhadu + bucket
  POLY(c, P.blue, [x + 4, y - 30, x + 34, y - 30, x + 28, y, x + 10, y]); R(c, P.steel, x + 2, y - 32, 34, 4);
  c.strokeStyle = P.wood; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 6, y - 84); c.lineTo(x - 26, y - 14); c.stroke();
  POLY(c, '#C9A24D', [x - 34, y - 16, x - 18, y - 16, x - 12, y, x - 40, y]);
  c.strokeStyle = '#8B6B2A'; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(x - 32 + i * 4, y - 15); c.lineTo(x - 36 + i * 5, y); c.stroke(); }
  E(c, '#9CC8E8', x + 19, y - 28, 12, 3);
}

// ---------- THE DOOR ----------
function drawDoor(c, x, y, t) {
  const g = 0.3 + Math.sin(t * 4) * 0.1;
  c.fillStyle = 'rgba(255,210,63,' + g + ')'; c.beginPath(); c.arc(x, y - 80, 100, 0, 7); c.fill();
  R(c, P.blue, x - 48, y - 150, 96, 150); R(c, P.haldi, x - 48, y - 150, 96, 6);
  c.fillStyle = '#FFF6D8'; c.beginPath(); c.moveTo(x - 36, y); c.lineTo(x - 36, y - 100); c.arc(x, y - 100, 36, Math.PI, 0); c.lineTo(x + 36, y); c.fill();
  for (let i = 0; i < 9; i++) { C(c, i % 2 ? P.marigold : P.pink, x - 36 + i * 9, y - 112 + Math.abs(i - 4) * -2 + 12, 5); }
  T(c, 'KHULI', x, y - 124, 13, P.haldi); T(c, 'HAWA', x, y - 138, 13, P.haldi);
  T(c, '✨', x, y - 60, 30);
}

// ---------- BACKGROUND PANELS (480 x 260, drawn from top-left) ----------
function drawBgKitchen(c, x, y) {
  R(c, P.wall, x, y, 480, 260);
  for (let i = 0; i < 12; i++) R(c, i % 2 ? '#F2E2BE' : '#E6D3A6', x + i * 40, y + 120, 40, 140); // tiles
  R(c, P.wood, x + 20, y + 40, 130, 6); // shelf with steel pots
  for (let i = 0; i < 4; i++) { R(c, P.steel, x + 30 + i * 30, y + 22, 22, 18); R(c, '#8892A0', x + 28 + i * 30, y + 20, 26, 4); }
  R(c, P.dark, x + 200, y + 150, 120, 10); R(c, '#555', x + 190, y + 160, 140, 100); // stove
  C(c, P.red, x + 225, y + 146, 5); C(c, P.red, x + 295, y + 146, 5);
  R(c, P.steel, x + 205, y + 118, 44, 28); R(c, P.dark, x + 222, y + 110, 10, 8); // pressure cooker
  for (let i = 0; i < 3; i++) E(c, 'rgba(255,255,255,0.6)', x + 227 + i * 6, y + 98 - i * 14, 8 - i, 5);
  R(c, '#D0D6DC', x + 360, y + 160, 100, 12); R(c, '#9AA3AD', x + 365, y + 172, 90, 90); // wash basin
  for (let i = 0; i < 5; i++) E(c, i % 2 ? P.cream : P.pink, x + 380 + i * 4, y + 150 - i * 6, 22, 5); // dirty dish stack
  R(c, P.steel, x + 398, y + 110, 5, 22); R(c, P.steel, x + 398, y + 110, 14, 4);
}
function drawBgUtility(c, x, y) {
  R(c, '#DCE6DF', x, y, 480, 260);
  c.strokeStyle = '#555'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 10, y + 60); c.quadraticCurveTo(x + 240, y + 90, x + 470, y + 60); c.stroke();
  const cols = [P.pink, P.marigold, P.blue, P.red, '#7A9E4B'];
  for (let i = 0; i < 5; i++) { const cx = x + 60 + i * 80, cy = y + 76 + Math.sin(i * 0.9) * 4; POLY(c, cols[i], [cx - 18, cy, cx + 18, cy, cx + 14, cy + 50, cx - 14, cy + 50]); } // kurtas drying
  R(c, P.white, x + 300, y + 130, 100, 130); R(c, '#CCC', x + 300, y + 130, 100, 16); // washing machine
  C(c, '#AEC6D8', x + 350, y + 195, 34); C(c, '#6F8FA8', x + 350, y + 195, 24);
  E(c, P.pink, x + 345, y + 195, 10, 6); T(c, 'SPIN', x + 322, y + 143, 9, '#555');
  R(c, '#B07A3A', x + 40, y + 190, 70, 70); R(c, '#8B5E27', x + 40, y + 190, 70, 8); // laundry basket overflowing
  E(c, P.marigold, x + 60, y + 186, 22, 10); E(c, P.blue, x + 90, y + 184, 20, 10);
}
function drawFloor(c, x, y, w, h, scroll) {
  R(c, P.floor, x, y, w, h); R(c, '#9A6B45', x, y, w, 6);
  for (let i = -1; i < w / 60 + 1; i++) R(c, '#A8764D', x + i * 60 - (scroll % 60), y + 6, 2, h - 6);
}

// ---------- REDRAWN (v2) ----------
function drawHeroine(c, x, y, t, jumping) {
  const k = Math.sin(t * 14), leg = jumping ? 0 : k * 10, fl = Math.sin(t * 10);
  c.fillStyle = P.pink; c.beginPath(); c.moveTo(x - 8, y - 70);
  c.quadraticCurveTo(x - 40, y - 62 + fl * 8, x - 54, y - 30 + fl * 10); c.lineTo(x - 14, y - 36); c.fill();
  R(c, P.haldi, x - 54, y - 32 + fl * 10, 16, 3);
  if (jumping) { // knees tucked
    R(c, P.skin, x - 14, y - 14, 14, 6); R(c, P.haldi, x - 18, y - 16, 6, 10);
    R(c, P.skin, x + 2, y - 18, 14, 6); R(c, P.haldi, x + 14, y - 20, 6, 10);
  } else {
    R(c, P.skin, x - 9 + leg, y - 16, 6, 14); R(c, P.skin, x + 3 - leg, y - 16, 6, 14);
    R(c, P.haldi, x - 11 + leg, y - 3, 10, 3); R(c, P.haldi, x + 1 - leg, y - 3, 10, 3);
  }
  POLY(c, P.red, [x - 14, y - 72, x + 14, y - 72, x + 22, y - 14, x - 22, y - 14]);
  R(c, P.haldi, x - 22, y - 24, 44, 6);
  for (let i = 0; i < 3; i++) C(c, P.haldi, x - 8 + i * 8, y - 45, 2);
  if (!jumping) { const ax = x + 12 + k * 6; R(c, P.skin, ax, y - 66, 6, 26); R(c, P.pink, ax - 1, y - 52, 8, 3); R(c, P.haldi, ax - 1, y - 48, 8, 3); }
  c.fillStyle = P.pink; c.beginPath(); c.moveTo(x - 18, y - 56);
  c.quadraticCurveTo(x - 22, y - 100, x, y - 102); c.quadraticCurveTo(x + 22, y - 100, x + 18, y - 56);
  c.quadraticCurveTo(x, y - 50, x - 18, y - 56); c.fill();
  c.strokeStyle = P.haldi; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 18, y - 56); c.quadraticCurveTo(x, y - 50, x + 18, y - 56); c.stroke();
  C(c, P.white, x - 5, y - 80, 3); C(c, P.white, x + 5, y - 80, 3); C(c, P.dark, x - 4, y - 80, 1.5); C(c, P.dark, x + 6, y - 80, 1.5);
  if (jumping) { R(c, P.skin, x + 20, y - 104, 6, 30); R(c, P.pink, x + 19, y - 100, 8, 3); R(c, P.haldi, x + 19, y - 96, 8, 3); }
}
function drawLaundry(c, x, y, t) { // laundry basket, labelled
  // clothes spilling out
  E(c, P.marigold, x - 16, y - 50, 16, 10); E(c, '#4B6FA5', x + 12, y - 54, 18, 11); E(c, P.pink, x - 2, y - 62, 14, 9);
  R(c, P.white, x + 14, y - 80, 7, 16); R(c, P.red, x + 14, y - 74, 7, 3); R(c, P.red, x + 14, y - 79, 7, 3); // sock
  R(c, P.red, x - 30, y - 44, 6, 22); // sleeve dangling
  // wicker basket
  POLY(c, '#C98F4A', [x - 34, y - 48, x + 34, y - 48, x + 28, y, x - 28, y]);
  c.strokeStyle = '#8B5E27'; c.lineWidth = 2;
  for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(x - 33 + i * 1.5, y - 48 + i * 9.5); c.lineTo(x + 33 - i * 1.5, y - 48 + i * 9.5); c.stroke(); }
  R(c, '#8B5E27', x - 36, y - 52, 72, 6);
  R(c, P.white, x - 24, y - 36, 48, 18); c.strokeStyle = P.dark; c.lineWidth = 1; c.strokeRect(x - 24, y - 36, 48, 18);
  T(c, 'LAUNDRY', x, y - 23, 11, P.red);
  c.strokeStyle = '#6AA84F'; c.lineWidth = 2;
  for (let i = -1; i <= 1; i++) { c.beginPath(); const s = y - 90 - Math.sin(t * 4 + i) * 3; c.moveTo(x + i * 20, s + 8); c.bezierCurveTo(x + i * 20 - 6, s, x + i * 20 + 6, s - 6, x + i * 20, s - 14); c.stroke(); }
}
function drawUncle(c, x, y, t) { // beer-belly uncle in vest, on couch
  R(c, '#7B1E2B', x - 58, y - 78, 116, 52); // couch back
  R(c, '#7B1E2B', x - 66, y - 52, 20, 52); R(c, '#7B1E2B', x + 46, y - 52, 20, 52); // arms
  R(c, '#5E1520', x - 46, y - 26, 92, 26); // seat front
  R(c, '#A02B3C', x - 46, y - 30, 92, 8); // cushion
  R(c, P.dark, x - 54, y - 8, 6, 8); R(c, P.dark, x + 48, y - 8, 6, 8);
  // legs in checked shorts, bare feet
  R(c, P.skin, x - 22, y - 22, 14, 20); R(c, P.skin, x + 8, y - 22, 14, 20);
  R(c, '#3A6EA5', x - 26, y - 38, 52, 18); R(c, '#9CC0E8', x - 26, y - 32, 52, 3);
  // belly
  E(c, P.white, x, y - 56, 32, 26); c.strokeStyle = '#DDD'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y - 56, 32, 26, 0, 0.3, 2.8); c.stroke();
  R(c, P.white, x - 18, y - 84, 8, 20); R(c, P.white, x + 10, y - 84, 8, 20); // vest straps
  E(c, '#9A5F3A', x, y - 50, 4, 2.5); // belly button
  C(c, P.skin, x - 32, y - 56, 7); C(c, P.skin, x + 32, y - 56, 7); // arms on belly
  R(c, P.dark, x + 28, y - 62, 5, 12); // remote
  // head: bald + side hair, big moustache, sleepy eyes
  C(c, P.skin, x, y - 92, 15); R(c, P.dark, x - 16, y - 96, 4, 8); R(c, P.dark, x + 12, y - 96, 4, 8);
  R(c, P.dark, x - 8, y - 94, 6, 2); R(c, P.dark, x + 2, y - 94, 6, 2);
  E(c, P.dark, x - 7, y - 85, 9, 3.5); E(c, P.dark, x + 7, y - 85, 9, 3.5);
  T(c, 'Zzz', x + 26, y - 104 + Math.sin(t * 3) * 2, 12, '#666');
}
function drawBed(c, x, y) { // small unmade bed
  R(c, P.wood, x - 50, y - 62, 12, 62); C(c, P.wood, x - 44, y - 62, 6); // headboard
  R(c, P.wood, x + 40, y - 30, 8, 30); // footboard
  R(c, P.wood, x - 46, y - 18, 94, 6); R(c, P.cream, x - 38, y - 30, 78, 14); // frame + mattress
  E(c, P.white, x - 24, y - 36, 17, 9); E(c, '#E5E5E5', x - 24, y - 35, 7, 3); // pillow with dent
  c.fillStyle = P.pink; c.beginPath(); c.moveTo(x - 4, y - 32); // crumpled blanket
  c.quadraticCurveTo(x + 10, y - 50, x + 22, y - 36); c.quadraticCurveTo(x + 34, y - 46, x + 42, y - 32);
  c.lineTo(x + 46, y - 6); c.lineTo(x + 24, y - 12); c.lineTo(x + 8, y - 14); c.lineTo(x - 6, y - 22); c.fill();
  for (let i = 0; i < 4; i++) C(c, P.haldi, x + 8 + i * 9, y - 28 + (i % 2) * 6, 2.5);
  R(c, P.wood, x - 46, y - 12, 6, 12); R(c, P.wood, x + 40, y - 12, 6, 12);
  R(c, P.white, x - 16, y - 4, 8, 4); R(c, P.red, x - 16, y - 4, 3, 4); // dropped sock
  T(c, 'z z z', x - 20, y - 72, 11, '#888');
}
function drawTable(c, x, y) { // empty dining table: plates, no food
  R(c, P.wood, x - 40, y - 32, 6, 32); R(c, P.wood, x + 34, y - 32, 6, 32);
  R(c, '#7A4A21', x - 52, y - 54, 8, 54); R(c, '#7A4A21', x - 52, y - 54, 20, 6); // chair
  R(c, '#7A4A21', x + 44, y - 54, 8, 54); R(c, '#7A4A21', x + 32, y - 54, 20, 6);
  R(c, P.cream, x - 48, y - 40, 96, 8); // table top
  for (let i = 0; i < 12; i++) R(c, i % 2 ? P.red : P.white, x - 48 + i * 8, y - 32, 8, 6); // cloth edge
  for (const px of [-28, 6]) { E(c, P.white, x + px + 14, y - 43, 15, 4); E(c, '#EEE', x + px + 14, y - 43, 9, 2); }
  R(c, P.steel, x - 6 - 6, y - 52, 8, 10); R(c, '#9AA3AD', x + 34, y - 48, 10, 6); // steel glass + empty bowl
  T(c, '🪰', x + 6, y - 64, 12);
  T(c, 'khaana?', x, y - 76, 12, P.red);
}

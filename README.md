# Ghungat Dash

A 40-second side-scrolling runner. She wears a saree with a ghungat, and the corridor is full of chores, relatives and laundry. Reach the door at the end before the clock runs out.

## How to launch the game

**Option 1: play online (once GitHub Pages is on)**
Open https://nainataneja.github.io/ghungat-dash/

**Option 2: play on your laptop**
1. Download or clone this repo:
   ```
   git clone https://github.com/nainataneja/ghungat-dash.git
   ```
2. Open the folder and **double-click `index.html`**. It opens in your browser (Chrome works best). No install, no server, no internet needed.
3. Press **SPACE** to start.

## Controls
- **Space**, **Up arrow**, **W** or a **click** to jump.
- Jump over chores, avoid relatives, grab power-ups.

## Rules
- You have **40 seconds**. Reach the door before the clock hits zero.
- **Penalties** take time off the clock: Bhaiya -2s, Laundry -3s, Mehmaan -5s.
- **Power-ups** add time (jump to catch them): Salary +2s, Daylight +3s, Food +5s.
- **Chores** (couch uncle, jhadu, unmade bed, empty dining table) slow you down and cost 1s if you hit them.
- The ghungat hides what lies ahead on the right of the screen. A banner names the next item once it comes into view.

## Files
| File | What it is |
|---|---|
| `index.html` | The game page |
| `game.js` | Game logic, and the `CONFIG` block with speed, jump, timer and course layout |
| `sprites.js` | All the drawn characters, objects and backgrounds |
| `preview.html` | Sprite sheet to review every graphic on one page |

## Tuning
Edit the `CONFIG` block at the top of `game.js` to change speed, jump height, gravity, the timer and the length of the course. The `COURSE` list below it sets where each item appears.

Level 1 only. In Level 2, the ghungat comes off.

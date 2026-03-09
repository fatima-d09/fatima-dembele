// ══════════════════════════════════════════════
// CORE ELEMENTS
// ══════════════════════════════════════════════
const intro     = document.getElementById('intro');
const pourEl    = document.getElementById('pour-scene');
const site      = document.getElementById('site');
const yesBtn    = document.getElementById('yes-btn');
const screenMug = document.getElementById('screen-mug');
const darkEl    = document.getElementById('screen-dark');
const desktop   = document.getElementById('retro-desktop');

// ── Button helper ────────────────────────────
function bindBtn(el, fn) {
  if (!el) return;
  el.addEventListener('click', fn);
  el.addEventListener('touchend', (e) => { e.preventDefault(); fn(); });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
  });
}

// ── Intro → Pour → Portfolio ─────────────────
function startPour() {
  intro.classList.add('out');
  setTimeout(() => {
    pourEl.classList.add('visible');
    setTimeout(() => {
      pourEl.classList.add('pouring');
      setTimeout(() => {
        pourEl.style.transition = 'opacity 0.8s';
        pourEl.style.opacity = '0';
        site.style.opacity = '1';
        setTimeout(() => { pourEl.style.visibility = 'hidden'; }, 900);
      }, 3800);
    }, 500);
  }, 400);
}

bindBtn(yesBtn, startPour);

// ── Laptop scroll: mug flickers then dark screen ──
let mugTriggered = false;
const laptopSection = document.querySelector('.scroll-section.laptop');

function checkLaptopScroll() {
  if (mugTriggered || !laptopSection) return;
  const rect     = laptopSection.getBoundingClientRect();
  const scrolled  = -rect.top;
  const total     = rect.height - window.innerHeight;
  const progress  = scrolled / total;
  if (progress >= 0.55 && progress <= 0.78) {
    mugTriggered = true;
    triggerScreenFade();
  }
}

function triggerScreenFade() {
  if (screenMug) screenMug.classList.add('fading');
  setTimeout(() => {
    darkEl.classList.add('active');
    // Show desktop 1s after dark screen fades in
    setTimeout(showDesktop, 1000);
  }, 1500);
}

window.addEventListener('scroll', checkLaptopScroll, { passive: true });

// ══════════════════════════════════════════════
// RETRO WIN98 DESKTOP
// ══════════════════════════════════════════════

function showDesktop() {
  desktop.classList.add('visible');
  try { initClock(); } catch(e) {}
  try { initMinesweeper(); } catch(e) {}
  try { initAtayaBrewBtn(); } catch(e) {}
  try { initContactForm(); } catch(e) {}
}

function initContactForm() {
  const sendBtn = document.querySelector('.email-send-btn');
  if (!sendBtn) return;
  sendBtn.addEventListener('click', () => {
    const subject = document.querySelector('.email-field.editable')?.textContent.trim() || 'Hello Fatima!';
    const body    = document.querySelector('.email-body')?.textContent.trim() || '';
    const mailto  = `mailto:fatoumatad@seoscholars.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

// ── Clock ──────────────────────────────────
function initClock() {
  const el = document.getElementById('taskbar-clock');
  if (!el) return;
  function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    el.textContent = `${h}:${String(m).padStart(2,'0')} ${ampm}`;
  }
  tick();
  setInterval(tick, 10000);
}

// ── Icon double-click opens window ──────────
document.querySelectorAll('.desk-icon').forEach(icon => {
  let clicks = 0, timer;
  icon.addEventListener('click', (e) => {
    // For link icons, prevent navigation on single click
    if (icon.classList.contains('desk-icon-link')) e.preventDefault();
    clicks++;
    if (clicks === 1) {
      icon.classList.add('selected');
      timer = setTimeout(() => { clicks = 0; }, 400);
    } else {
      clearTimeout(timer);
      clicks = 0;
      icon.classList.remove('selected');
      if (icon.classList.contains('desk-icon-link')) {
        window.open(icon.href, '_blank', 'noopener,noreferrer');
      } else {
        openWindow(icon.dataset.window);
      }
    }
  });
});

// ── Open / close / minimise windows ─────────
let zTop = 30;

function openWindow(name) {
  const win = document.getElementById(`win-${name}`);
  if (!win) return;
  win.classList.add('open');
  win.classList.remove('minimized');
  bringToFront(win);
  addTaskbarTask(name);
}

function bringToFront(win) {
  zTop++;
  win.style.zIndex = zTop;
}

document.querySelectorAll('.win-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const win = document.getElementById(`win-${btn.dataset.win}`);
    if (!win) return;
    win.classList.remove('open');
    removeTaskbarTask(btn.dataset.win);
  });
});

document.querySelectorAll('.win-min').forEach(btn => {
  btn.addEventListener('click', () => {
    const win = document.getElementById(`win-${btn.dataset.win}`);
    if (!win) return;
    win.classList.add('minimized');
    const task = document.querySelector(`.taskbar-task[data-win="${btn.dataset.win}"]`);
    if (task) task.classList.remove('active');
  });
});

document.querySelectorAll('.win-max').forEach(btn => {
  btn.addEventListener('click', () => {
    const win = document.getElementById(`win-${btn.dataset.win}`);
    if (!win) return;
    if (win.dataset.maximized === '1') {
      win.style.left   = win.dataset.ox;
      win.style.top    = win.dataset.oy;
      win.style.width  = win.dataset.ow;
      win.style.height = '';
      win.dataset.maximized = '0';
    } else {
      win.dataset.ox = win.style.left;
      win.dataset.oy = win.style.top;
      win.dataset.ow = win.style.width;
      win.style.left   = '0';
      win.style.top    = '0';
      win.style.width  = '100%';
      win.style.height = 'calc(100% - 32px)';
      win.dataset.maximized = '1';
    }
  });
});

// ── Taskbar ──────────────────────────────────
const WINDOW_LABELS = {
  about: '👤 About Me', projects: '📁 Projects',
  resume: '📄 Resume.pdf', skills: '💻 Skills',
  contact: '✉️ Contact', ataya: '☕ Ataya.exe',
  minesweeper: '💣 Minesweeper', notepad: '📝 Notepad',
  recycle: '🗑 Recycle Bin'
};

function addTaskbarTask(name) {
  const existing = document.querySelector(`.taskbar-task[data-win="${name}"]`);
  if (existing) { existing.classList.add('active'); return; }
  const btn = document.createElement('button');
  btn.className = 'taskbar-task active';
  btn.dataset.win = name;
  btn.textContent = WINDOW_LABELS[name] || name;
  btn.addEventListener('click', () => {
    const win = document.getElementById(`win-${name}`);
    if (!win) return;
    if (win.classList.contains('minimized')) {
      win.classList.remove('minimized');
      bringToFront(win);
      btn.classList.add('active');
    } else if (parseInt(win.style.zIndex) === zTop) {
      win.classList.add('minimized');
      btn.classList.remove('active');
    } else {
      bringToFront(win);
      btn.classList.add('active');
    }
  });
  document.getElementById('taskbar-tasks').appendChild(btn);
}

function removeTaskbarTask(name) {
  const task = document.querySelector(`.taskbar-task[data-win="${name}"]`);
  if (task) task.remove();
}

// ── Draggable windows ────────────────────────
document.querySelectorAll('.win-titlebar').forEach(bar => {
  let dragging = false, ox, oy;
  bar.addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON') return;
    const win = bar.closest('.win98-window');
    bringToFront(win);
    dragging = true;
    ox = e.clientX - win.offsetLeft;
    oy = e.clientY - win.offsetTop;
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const win = bar.closest('.win98-window');
    win.style.left = `${e.clientX - ox}px`;
    win.style.top  = `${Math.max(0, e.clientY - oy)}px`;
  });
  document.addEventListener('mouseup', () => { dragging = false; });
});

document.querySelectorAll('.win98-window').forEach(win => {
  win.addEventListener('mousedown', () => bringToFront(win));
});

// ── Ataya Brewer ─────────────────────────────
function initAtayaBrewBtn() {
  const btn = document.getElementById('ataya-brew-btn');
  if (!btn) return;

  function svgEl(id) { return document.getElementById(id); }

  function setStatus(msg) {
    const el = svgEl('ataya-svg-status');
    if (el) el.textContent = msg;
  }

  function resetScene() {
    // tea levels
    svgEl('ataya-tea-left').setAttribute('height', '0');
    svgEl('ataya-tea-left').setAttribute('y', '150');
    svgEl('ataya-tea-right').setAttribute('height', '0');
    svgEl('ataya-tea-right').setAttribute('y', '150');
    // streams
    ['ataya-stream-pot','ataya-stream-lr','ataya-stream-rl'].forEach(id => {
      svgEl(id).setAttribute('opacity', '0');
    });
    // foam + steam
    svgEl('ataya-foam-left').setAttribute('opacity', '0');
    svgEl('ataya-foam-right').setAttribute('opacity', '0');
    svgEl('ataya-steam').setAttribute('opacity', '0');
    // teapot back to start
    svgEl('ataya-teapot').setAttribute('transform', '');
    setStatus('Press Brew to start');
  }

  // Animate tea level in a cup smoothly
  function fillCup(teaId, fromPct, toPct, durationMs) {
    const el = svgEl(teaId);
    const maxH = 28; // max fill height in SVG units
    const startH = maxH * fromPct;
    const endH   = maxH * toPct;
    const startY = 150 - startH;
    const endY   = 150 - endH;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / durationMs, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      const h = startH + (endH - startH) * ease;
      const y = 150 - h;
      el.setAttribute('height', h);
      el.setAttribute('y', y);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Drain a cup (reduce level)
  function drainCup(teaId, fromPct, toPct, durationMs) {
    fillCup(teaId, fromPct, toPct, durationMs);
  }

  // Tilt teapot to pour
  function tiltTeapot(tiltDeg, durationMs) {
    const el = svgEl('ataya-teapot');
    const start = performance.now();
    const origin = 'transform-origin: 80px 118px;';
    function step(now) {
      const t = Math.min((now - start) / durationMs, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      const angle = tiltDeg * ease;
      el.setAttribute('transform', `rotate(${angle} 80 118)`);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function runBrew() {
    btn.disabled = true;
    resetScene();
    await delay(200);

    // 1. Tilt teapot + show stream → fill left cup
    setStatus('Pouring tea…');
    tiltTeapot(-28, 600);
    await delay(400);
    svgEl('ataya-stream-pot').setAttribute('opacity', '1');
    fillCup('ataya-tea-left', 0, 0.85, 1200);
    await delay(1300);
    svgEl('ataya-stream-pot').setAttribute('opacity', '0');
    tiltTeapot(0, 400);
    svgEl('ataya-steam').setAttribute('opacity', '1');
    await delay(400);

    // 2. Pour left → right (3 times back and forth, ~3.2s total)
    setStatus('Aerating…');
    for (let i = 0; i < 3; i++) {
      // left → right
      svgEl('ataya-stream-lr').setAttribute('opacity', '1');
      drainCup('ataya-tea-left', 0.85 - i*0.05, 0.1, 500);
      fillCup('ataya-tea-right', i === 0 ? 0 : 0.1, 0.85 - i*0.05, 500);
      await delay(560);
      svgEl('ataya-stream-lr').setAttribute('opacity', '0');
      await delay(80);

      // right → left
      svgEl('ataya-stream-rl').setAttribute('opacity', '1');
      drainCup('ataya-tea-right', 0.85 - i*0.05, 0.1, 500);
      fillCup('ataya-tea-left', 0.1, 0.85 - i*0.05, 500);
      await delay(560);
      svgEl('ataya-stream-rl').setAttribute('opacity', '0');
      await delay(80);
    }

    // 3. Foam appears on left cup
    setStatus('Foam forming…');
    svgEl('ataya-foam-left').setAttribute('opacity', '0');
    const foamEl = svgEl('ataya-foam-left');
    let fo = 0;
    const foamIn = setInterval(() => {
      fo = Math.min(fo + 0.08, 1);
      foamEl.setAttribute('opacity', fo);
      if (fo >= 1) clearInterval(foamIn);
    }, 40);
    await delay(600);

    setStatus('✅ Ataya is ready! Enjoy ☕');
    btn.disabled = false;
  }

  btn.addEventListener('click', runBrew);
}

// ── Minesweeper ───────────────────────────────
function initMinesweeper() {
  const grid = document.getElementById('mine-grid');
  if (!grid) return;
  const COLS = 9, ROWS = 9, MINES = 10;
  let board = [], gameOver = false, firstClick = true, timerVal = 0, timerInt;

  function buildBoard() {
    board = Array.from({length: ROWS}, () =>
      Array.from({length: COLS}, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }))
    );
  }

  function placeMines(skipR, skipC) {
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!board[r][c].mine && !(r === skipR && c === skipC)) {
        board[r][c].mine = true; placed++;
      }
    }
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (board[r][c].mine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r+dr, nc = c+dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) count++;
          }
        board[r][c].adj = count;
      }
  }

  const COLORS = ['','#0000ff','#008000','#ff0000','#800080','#800000','#008080','#000000','#808080'];

  function render() {
    grid.innerHTML = '';
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        const d = board[r][c];
        if (d.flagged && !d.revealed)      { cell.textContent = '🚩'; }
        else if (!d.revealed)              { /* hidden */ }
        else if (d.mine)                   { cell.textContent = '💣'; cell.style.background = '#f00'; }
        else {
          cell.classList.add('revealed');
          if (d.adj > 0) { cell.textContent = d.adj; cell.style.color = COLORS[d.adj]; }
        }
        cell.addEventListener('click', () => handleClick(r, c));
        cell.addEventListener('contextmenu', e => { e.preventDefault(); handleFlag(r, c); });
        grid.appendChild(cell);
      }
  }

  function reveal(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const d = board[r][c];
    if (d.revealed || d.flagged) return;
    d.revealed = true;
    if (d.adj === 0 && !d.mine)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) reveal(r+dr, c+dc);
  }

  function handleClick(r, c) {
    if (gameOver || board[r][c].revealed || board[r][c].flagged) return;
    if (firstClick) {
      firstClick = false;
      placeMines(r, c);
      timerInt = setInterval(() => {
        timerVal = Math.min(999, timerVal + 1);
        document.getElementById('mine-timer').textContent = String(timerVal).padStart(3,'0');
      }, 1000);
    }
    if (board[r][c].mine) {
      board[r][c].revealed = true;
      gameOver = true;
      clearInterval(timerInt);
      document.getElementById('mine-reset').textContent = '😵';
      for (let ri = 0; ri < ROWS; ri++)
        for (let ci = 0; ci < COLS; ci++)
          if (board[ri][ci].mine) board[ri][ci].revealed = true;
    } else {
      reveal(r, c);
    }
    render();
  }

  function handleFlag(r, c) {
    if (gameOver || board[r][c].revealed) return;
    board[r][c].flagged = !board[r][c].flagged;
    render();
  }

  function reset() {
    gameOver = false; firstClick = true; timerVal = 0;
    clearInterval(timerInt);
    document.getElementById('mine-timer').textContent = '000';
    document.getElementById('mine-reset').textContent = '🙂';
    buildBoard(); render();
  }

  document.getElementById('mine-reset').addEventListener('click', reset);
  buildBoard();
  render();
}

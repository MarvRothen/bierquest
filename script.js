
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let tjorben = { x: 100, y: 300, vy: 0 };
let gravity = 0.7;
let lift = -12;
let obstacles = [];
let bottles = [];
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let gameStarted = false;
let gameOver = false;
let win = false;
let frameCount = 0;
let bgOffset = 0;

document.addEventListener('keydown', () => { if (!gameStarted) startGame(); else flap(); });
document.addEventListener('touchstart', () => { if (!gameStarted) startGame(); else flap(); });

function flap() {
  tjorben.vy = lift;
}

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  gameStarted = true;
  requestAnimationFrame(gameLoop);
  spawnObstacle();
  spawnBottle();
}

function restartGame() {
  window.location.reload();
}

function spawnObstacle() {
  if (gameOver || win) return;
  let gap = 280;
  let top = Math.random() * 200 + 50;
  obstacles.push({ x: canvas.width, top: top, bottom: top + gap, width: 50 });
  setTimeout(spawnObstacle, Math.random() * 2000 + 1500);
}

function spawnBottle() {
  if (gameOver || win) return;
  let y = Math.random() * 400 + 50;
  bottles.push({ x: canvas.width, y: y });
  setTimeout(spawnBottle, Math.random() * 1500 + 1000);
}

const bgImage = new Image();
bgImage.src = 'background.png';

const tjorbenImg = new Image();
tjorbenImg.src = 'tjorben.png';

const bottleImg = new Image();
bottleImg.src = 'bierflasche.png';

function gameLoop() {
  if (gameOver || win) return;
  frameCount++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Parallax-Hintergrund
  bgOffset -= 1;
  if (bgOffset <= -canvas.width) bgOffset = 0;
  ctx.drawImage(bgImage, bgOffset, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bgOffset + canvas.width, 0, canvas.width, canvas.height);

  // Tjorben Animation (leichtes Wippen)
  tjorben.vy += gravity;
  tjorben.y += tjorben.vy;
  let wobble = Math.sin(frameCount / 5) * 2;
  ctx.drawImage(tjorbenImg, tjorben.x, tjorben.y + wobble, 25, 25);

  // Hindernisse
  ctx.fillStyle = '#444';
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 2;
    ctx.beginPath(); ctx.rect(obs.x, 0, obs.width, obs.top); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(obs.x, obs.bottom, obs.width, canvas.height - obs.bottom); ctx.fill(); ctx.stroke();

    if (
      tjorben.x < obs.x + obs.width &&
      tjorben.x + 25 > obs.x &&
      (tjorben.y < obs.top || tjorben.y + 25 > obs.bottom)
    ) {
      gameOver = true;
      document.getElementById('gameOverScreen').style.display = 'flex';
      if (score > highscore) {
        localStorage.setItem('highscore', score);
      }
    }
  }

  // Bierflaschen
  ctx.imageSmoothingEnabled = true;
  for (let i = bottles.length - 1; i >= 0; i--) {
    let b = bottles[i];
    b.x -= 2;
    ctx.drawImage(bottleImg, b.x, b.y, 80, 160);
    if (
      tjorben.x < b.x + 80 &&
      tjorben.x + 25 > b.x &&
      tjorben.y < b.y + 160 &&
      tjorben.y + 25 > b.y
    ) {
      score++;
      bottles.splice(i, 1);
      if (score >= 30) {
        win = true;
        document.getElementById('winScreen').style.display = 'flex';
        if (score > highscore) {
          localStorage.setItem('highscore', score);
        }
      }
    }
  }

  ctx.fillStyle = 'black';
  ctx.font = '20px sans-serif';
  ctx.fillText('Flaschen: ' + score, 10, 30);
  ctx.fillText('Highscore: ' + highscore, 10, 55);

  requestAnimationFrame(gameLoop);
}

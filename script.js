
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bottles = [];
let lives = 3;
let score = 0;
let gameOver = false;
let win = false;

const bier = new Image();
bier.src = 'bierflasche.png';

const wasser = new Image();
wasser.src = 'wasserflasche.jpg';

canvas.addEventListener('click', (e) => {
  if (gameOver || win) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = bottles.length - 1; i >= 0; i--) {
    let b = bottles[i];
    if (x > b.x && x < b.x + 60 && y > b.y && y < b.y + 120) {
      if (b.type === 'bier') {
        score++;
        if (score >= 1995) {
          win = true;
          document.getElementById('winScreen').style.display = 'flex';
        }
      } else {
        lives--;
        if (lives <= 0) {
          gameOver = true;
          document.getElementById('gameOverScreen').style.display = 'flex';
        }
      }
      bottles.splice(i, 1);
    }
  }
});

function spawnBottle() {
  if (gameOver || win) return;
  const isBeer = Math.random() < 0.7;
  const startX = Math.random() * 740;
  const startY = 600;
  const angle = (Math.random() - 0.5) * 2;
  bottles.push({
    x: startX,
    y: startY,
    vx: angle * 5,
    vy: -(Math.random() * 6 + 5),
    type: isBeer ? 'bier' : 'wasser'
  });
  setTimeout(spawnBottle, 500);
}

function update() {
  ctx.clearRect(0, 0, 800, 600);
  bottles.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.2;
    const img = b.type === 'bier' ? bier : wasser;
    ctx.drawImage(img, b.x, b.y, 60, 120);
  });

  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("Punkte: " + score, 10, 30);
  ctx.fillText("Leben: " + lives, 10, 60);

  requestAnimationFrame(update);
}

spawnBottle();
update();

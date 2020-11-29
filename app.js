const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('.scoreEl');
const restart = document.querySelector('.restart');
const op = document.querySelector('.op');
const finalScore = document.querySelector('.finalScore');
const c = canvas.getContext('2d');
let animetionId;
let score = 0;
canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 10, '#fff');
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
  player = new Player(x, y, 10, '#fff');
  projectiles = [];
  enemies = [];
  particles = [];
  scoreEl.innerHTML = 0;
  finalScore.innerHTML = 0;
  score = 0;
}
function spawnEnemies() {
  setInterval(() => {
    const maxR = 30;
    const minR = 10;
    const r = Math.random() * (maxR - minR) + minR;
    let x1;
    let y1;
    if (Math.random() < 0.5) {
      x1 = Math.random() < 0.5 ? 0 - r : x * 2 + r;
      y1 = Math.random() * (y * 2);
    } else {
      x1 = Math.random() * (x * 2);
      y1 = Math.random() < 0.5 ? 0 - r : y * 2 + r;
    }
    const color = `hsl(${Math.random() * 360} , 50%, 50%)`;
    const angle = Math.atan2(y - y1, x - x1);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x1, y1, r, color, velocity));
  }, 1000);
}
function animate() {
  animetionId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0,0,0,.1)';
  c.fillRect(0, 0, x * 2, y * 2);
  player.draw();
  particles.forEach((particle, parIndex) => {
    if (particle.alpha <= 0) {
      particles.slice(parIndex, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, pIndex) => {
    projectile.update();
    if (
      projectile.x + projectile.r < 0 ||
      projectile.x - projectile.r > 2 * x ||
      projectile.y + projectile.r < 0 ||
      projectile.y - projectile.r > 2 * x
    ) {
      setTimeout(() => {
        projectiles.splice(pIndex, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();

    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distance - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animetionId);
      op.style.display = 'flex';
      finalScore.innerHTML = score;
    }

    projectiles.forEach((projectile, pIndex) => {
      //   hit
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        score += 25;
        scoreEl.innerHTML = score;
        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }
        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(pIndex, 1);
          }, 0);
        } else {
          score += 30;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(pIndex, 1);
          }, 0);
        }
      }
    });
  });
}

addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - y, event.clientX - x);
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };
  projectiles.push(new Projectile(x, y, 5, '#fff', velocity));
});
restart.addEventListener('click', () => {
  init();
  animate();
  spawnEnemies();
  op.style.display = 'none';
});

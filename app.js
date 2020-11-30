const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('.scoreEl');
const scoreEl2 = document.querySelector('.scoreEl2');
const scorechart = document.querySelector('.scorechart');
const restart = document.querySelector('.restart');
const op = document.querySelector('.op');
const finalScore = document.querySelector('.finalScore');
const msg = document.querySelector('.msg');
const point = document.querySelector('.point');
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
let highest = 0;
//
function init() {
  scorechart.style.display = 'block';
  document.querySelector('.msg2').style.display = 'none';
  player = new Player(x, y, 10, '#fff');
  projectiles = [];
  enemies = [];
  particles = [];
  finalScore.style.display = 'block';
  point.style.display = 'block';
  scoreEl.innerHTML = 0;
  if (highest < score) {
    highest = score;
    scoreEl2.innerHTML = highest;
  }
  finalScore.innerHTML = 0;
  msg.innerHTML = 'Yeah Boy..!!!😛😛';
  // noob();
  score = 0;
}
// function noob() {
//   if (score < 500) {
//     console.log('L-1');
//     msg.innerHTML = 'Mah!! You are ultra noob.. 😂🤦‍♂️';
//   } else if (score < 1000) {
//     console.log('L-2');
//     msg.innerHTML = 'Hmm!! So you are noob.. 😆😛';
//   } else if (score <= 2000) {
//     msg.innerHTML = 'Good!! But you can do better.. 😃❤';
//   } else if (score <= 4000) {
//     msg.innerHTML = 'Excellent!! You have done great job.. 😊🎇';
//   } else if (score <= 8000) {
//     msg.innerHTML = 'Outstanding!! You are certified pero.. 😂😆';
//   } else {
//     msg.innerHTML = '🎊🤩--OP vai OP-- You are a monster..🤩🎊';
//   }
// }
//
const nww = setInterval(() => {
  const maxR = 30;
  const minR = 10;
  const r = Math.random() * (maxR - minR) + minR;
  let x1 = 0;
  let y1 = 0;
  if (Math.random() < 0.5) {
    x1 = Math.random() < 0.5 ? 0 - r : canvas.width + r;
    y1 = Math.random() * canvas.height;
  } else {
    x1 = Math.random() * canvas.width;
    y1 = Math.random() < 0.5 ? 0 - r : canvas.height + r;
  }
  const color = `hsl(${Math.random() * 360} , 50%, 50%)`;
  const angle = Math.atan2(y - y1, x - x1);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  enemies.push(new Enemy(x1, y1, r, color, velocity));
}, 1500);
//
function animate() {
  animetionId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0,0,0,.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
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
      let noise = new Audio('./noise.mp3');
      noise.play();
      op.style.display = 'flex';
      finalScore.innerHTML = score;
    }

    projectiles.forEach((projectile, pIndex) => {
      //   hit
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        let woh = new Audio('./woh.mp3');
        woh.play();
        score += 25;
        scoreEl.innerHTML = score;
        if (highest < score) {
          highest = score;
          scoreEl2.innerHTML = highest;
        }
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
        // Die
        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(pIndex, 1);
          }, 0);
        } else {
          score += 30;
          scoreEl.innerHTML = score;
          if (highest < score) {
            highest = score;
            scoreEl2.innerHTML = highest;
          }
          restart.innerHTML = 'Try again';
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(pIndex, 1);
          }, 0);
        }
      }
    });
  });
}

//
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
  op.style.display = 'none';
});

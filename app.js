const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, radious, color) {
    this.x = x;
    this.y = y;
    this.radious = radious;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radious, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
class Projectile {
  constructor(x, y, radious, color, velocity) {
    this.x = x;
    this.y = y;
    this.radious = radious;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radious, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, 'blue');
const projectiles = [];

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, x * 2, y * 2);
  player.draw();
  projectiles.forEach((projectile) => {
    projectile.update();
  });
}

addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - y, event.clientX - x);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  projectiles.push(new Projectile(x, y, 5, '#333', velocity));
});
animate();

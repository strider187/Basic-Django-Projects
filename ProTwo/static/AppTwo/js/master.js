// console.log("JS loaded")
// /**
//  * requestAnimationFrame
//  */
// window.requestAnimationFrame = (function(){
//     return  window.requestAnimationFrame       ||
//             window.webkitRequestAnimationFrame ||
//             window.mozRequestAnimationFrame    ||
//             window.oRequestAnimationFrame      ||
//             window.msRequestAnimationFrame     ||
//             function (callback) {
//                 window.setTimeout(callback, 1000 / 60);
//             };
// })();
//
//
// /**
//  * Vector
//  */
// function Vector(x, y) {
//     this.x = x || 0;
//     this.y = y || 0;
// }
//
// Vector.add = function(a, b) {
//     return new Vector(a.x + b.x, a.y + b.y);
// };
//
// Vector.sub = function(a, b) {
//     return new Vector(a.x - b.x, a.y - b.y);
// };
//
// Vector.scale = function(v, s) {
//     return v.clone().scale(s);
// };
//
// Vector.random = function() {
//     return new Vector(
//         Math.random() * 2 - 1,
//         Math.random() * 2 - 1
//     );
// };
//
// Vector.prototype = {
//     set: function(x, y) {
//         if (typeof x === 'object') {
//             y = x.y;
//             x = x.x;
//         }
//         this.x = x || 0;
//         this.y = y || 0;
//         return this;
//     },
//
//     add: function(v) {
//         this.x += v.x;
//         this.y += v.y;
//         return this;
//     },
//
//     sub: function(v) {
//         this.x -= v.x;
//         this.y -= v.y;
//         return this;
//     },
//
//     scale: function(s) {
//         this.x *= s;
//         this.y *= s;
//         return this;
//     },
//
//     length: function() {
//         return Math.sqrt(this.x * this.x + this.y * this.y);
//     },
//
//     lengthSq: function() {
//         return this.x * this.x + this.y * this.y;
//     },
//
//     normalize: function() {
//         var m = Math.sqrt(this.x * this.x + this.y * this.y);
//         if (m) {
//             this.x /= m;
//             this.y /= m;
//         }
//         return this;
//     },
//
//     angle: function() {
//         return Math.atan2(this.y, this.x);
//     },
//
//     angleTo: function(v) {
//         var dx = v.x - this.x,
//             dy = v.y - this.y;
//         return Math.atan2(dy, dx);
//     },
//
//     distanceTo: function(v) {
//         var dx = v.x - this.x,
//             dy = v.y - this.y;
//         return Math.sqrt(dx * dx + dy * dy);
//     },
//
//     distanceToSq: function(v) {
//         var dx = v.x - this.x,
//             dy = v.y - this.y;
//         return dx * dx + dy * dy;
//     },
//
//     lerp: function(v, t) {
//         this.x += (v.x - this.x) * t;
//         this.y += (v.y - this.y) * t;
//         return this;
//     },
//
//     clone: function() {
//         return new Vector(this.x, this.y);
//     },
//
//     toString: function() {
//         return '(x:' + this.x + ', y:' + this.y + ')';
//     }
// };
//
//
// /**
//  * GravityPoint
//  */
// function GravityPoint(x, y, radius, targets) {
//     Vector.call(this, x, y);
//     this.radius = radius;
//     this.currentRadius = radius * 0.5;
//
//     this._targets = {
//         particles: targets.particles || [],
//         gravities: targets.gravities || []
//     };
//     this._speed = new Vector();
// }
//
// GravityPoint.RADIUS_LIMIT = 65;
// GravityPoint.interferenceToPoint = true;
//
// GravityPoint.prototype = (function(o) {
//     var s = new Vector(0, 0), p;
//     for (p in o) s[p] = o[p];
//     return s;
// })({
//     gravity:       0.05,
//     isMouseOver:   false,
//     dragging:      false,
//     destroyed:     false,
//     _easeRadius:   0,
//     _dragDistance: null,
//     _collapsing:   false,
//
//     hitTest: function(p) {
//         return this.distanceTo(p) < this.radius;
//     },
//
//     startDrag: function(dragStartPoint) {
//         this._dragDistance = Vector.sub(dragStartPoint, this);
//         this.dragging = true;
//     },
//
//     drag: function(dragToPoint) {
//         this.x = dragToPoint.x - this._dragDistance.x;
//         this.y = dragToPoint.y - this._dragDistance.y;
//     },
//
//     endDrag: function() {
//         this._dragDistance = null;
//         this.dragging = false;
//     },
//
//     addSpeed: function(d) {
//         this._speed = this._speed.add(d);
//     },
//
//     collapse: function(e) {
//         this.currentRadius *= 1.75;
//         this._collapsing = true;
//     },
//
//     render: function(ctx) {
//         if (this.destroyed) return;
//
//         var particles = this._targets.particles,
//             i, len;
//
//         for (i = 0, len = particles.length; i < len; i++) {
//             particles[i].addSpeed(Vector.sub(this, particles[i]).normalize().scale(this.gravity));
//         }
//
//         this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95;
//         this.currentRadius += this._easeRadius;
//         if (this.currentRadius < 0) this.currentRadius = 0;
//
//         if (this._collapsing) {
//             this.radius *= 0.75;
//             if (this.currentRadius < 1) this.destroyed = true;
//             this._draw(ctx);
//             return;
//         }
//
//         var gravities = this._targets.gravities,
//             g, absorp,
//             area = this.radius * this.radius * Math.PI, garea;
//
//         for (i = 0, len = gravities.length; i < len; i++) {
//             g = gravities[i];
//
//             if (g === this || g.destroyed) continue;
//
//             if (
//                 (this.currentRadius >= g.radius || this.dragging) &&
//                 this.distanceTo(g) < (this.currentRadius + g.radius) * 0.85
//             ) {
//                 g.destroyed = true;
//                 this.gravity += g.gravity;
//
//                 absorp = Vector.sub(g, this).scale(g.radius / this.radius * 0.5);
//                 this.addSpeed(absorp);
//
//                 garea = g.radius * g.radius * Math.PI;
//                 this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI);
//                 this.radius = Math.sqrt((area + garea) / Math.PI);
//             }
//
//             g.addSpeed(Vector.sub(this, g).normalize().scale(this.gravity));
//         }
//
//         if (GravityPoint.interferenceToPoint && !this.dragging)
//             this.add(this._speed);
//
//         this._speed = new Vector();
//
//         if (this.currentRadius > GravityPoint.RADIUS_LIMIT) this.collapse();
//
//         this._draw(ctx);
//     },
//
//     _draw: function(ctx) {
//         var grd, r;
//
//         ctx.save();
//
//         grd = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 5);
//         grd.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
//         grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false);
//         ctx.fillStyle = grd;
//         ctx.fill();
//
//         r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3;
//         grd = ctx.createRadialGradient(this.x, this.y, r, this.x, this.y, this.currentRadius);
//         grd.addColorStop(0, 'rgba(0, 0, 0, 1)');
//         grd.addColorStop(1, Math.random() < 0.2 ? 'rgba(255, 196, 0, 0.15)' : 'rgba(103, 181, 191, 0.75)');
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false);
//         ctx.fillStyle = grd;
//         ctx.fill();
//         ctx.restore();
//     }
// });
//
//
// /**
//  * Particle
//  */
// function Particle(x, y, radius) {
//     Vector.call(this, x, y);
//     this.radius = radius;
//
//     this._latest = new Vector();
//     this._speed  = new Vector();
// }
//
// Particle.prototype = (function(o) {
//     var s = new Vector(0, 0), p;
//     for (p in o) s[p] = o[p];
//     return s;
// })({
//     addSpeed: function(d) {
//         this._speed.add(d);
//     },
//
//     update: function() {
//         if (this._speed.length() > 12) this._speed.normalize().scale(12);
//
//         this._latest.set(this);
//         this.add(this._speed);
//     }
//
//     // render: function(ctx) {
//     //     if (this._speed.length() > 12) this._speed.normalize().scale(12);
//
//     //     this._latest.set(this);
//     //     this.add(this._speed);
//
//     //     ctx.save();
//     //     ctx.fillStyle = ctx.strokeStyle = '#fff';
//     //     ctx.lineCap = ctx.lineJoin = 'round';
//     //     ctx.lineWidth = this.radius * 2;
//     //     ctx.beginPath();
//     //     ctx.moveTo(this.x, this.y);
//     //     ctx.lineTo(this._latest.x, this._latest.y);
//     //     ctx.stroke();
//     //     ctx.beginPath();
//     //     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     //     ctx.fill();
//     //     ctx.restore();
//     // }
// });
//
//
//
// // Initialize
//
// (function() {
//
//     // Configs
//
//     var BACKGROUND_COLOR      = 'rgba(11, 51, 56, 1)',
//         PARTICLE_RADIUS       = 1,
//         G_POINT_RADIUS        = 10,
//         G_POINT_RADIUS_LIMITS = 65;
//
//
//     // Vars
//
//     var canvas, context,
//         bufferCvs, bufferCtx,
//         screenWidth, screenHeight,
//         mouse = new Vector(),
//         gravities = [],
//         particles = [],
//         grad,
//         gui, control;
//
//
//     // Event Listeners
//
//     function resize(e) {
//         screenWidth  = canvas.width  = window.innerWidth;
//         screenHeight = canvas.height = window.innerHeight;
//         bufferCvs.width  = screenWidth;
//         bufferCvs.height = screenHeight;
//         context   = canvas.getContext('2d');
//         bufferCtx = bufferCvs.getContext('2d');
//
//         var cx = canvas.width * 0.5,
//             cy = canvas.height * 0.5;
//
//         grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
//         grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
//         grad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
//     }
//
//     function mouseMove(e) {
//         mouse.set(e.clientX, e.clientY);
//
//         var i, g, hit = false;
//         for (i = gravities.length - 1; i >= 0; i--) {
//             g = gravities[i];
//             if ((!hit && g.hitTest(mouse)) || g.dragging)
//                 g.isMouseOver = hit = true;
//             else
//                 g.isMouseOver = false;
//         }
//
//         canvas.style.cursor = hit ? 'pointer' : 'default';
//     }
//
//     function mouseDown(e) {
//         for (var i = gravities.length - 1; i >= 0; i--) {
//             if (gravities[i].isMouseOver) {
//                 gravities[i].startDrag(mouse);
//                 return;
//             }
//         }
//         gravities.push(new GravityPoint(e.clientX, e.clientY, G_POINT_RADIUS, {
//             particles: particles,
//             gravities: gravities
//         }));
//     }
//
//     function mouseUp(e) {
//         for (var i = 0, len = gravities.length; i < len; i++) {
//             if (gravities[i].dragging) {
//                 gravities[i].endDrag();
//                 break;
//             }
//         }
//     }
//
//     function doubleClick(e) {
//         for (var i = gravities.length - 1; i >= 0; i--) {
//             if (gravities[i].isMouseOver) {
//                 gravities[i].collapse();
//                 break;
//             }
//         }
//     }
//
//
//     // Functions
//
//     function addParticle(num) {
//         var i, p;
//         for (i = 0; i < num; i++) {
//             p = new Particle(
//                 Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
//                 Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
//                 PARTICLE_RADIUS
//             );
//             p.addSpeed(Vector.random());
//             particles.push(p);
//         }
//     }
//
//     function removeParticle(num) {
//         if (particles.length < num) num = particles.length;
//         for (var i = 0; i < num; i++) {
//             particles.pop();
//         }
//     }
//
//
//     // GUI Control
//
//     control = {
//         particleNum: 100
//     };
//
//
//     // Init
//
//     canvas  = document.getElementById('c');
//     bufferCvs = document.createElement('canvas');
//
//     window.addEventListener('resize', resize, false);
//     resize(null);
//
//     addParticle(control.particleNum);
//
//     canvas.addEventListener('mousemove', mouseMove, false);
//     canvas.addEventListener('mousedown', mouseDown, false);
//     canvas.addEventListener('mouseup', mouseUp, false);
//     canvas.addEventListener('dblclick', doubleClick, false);
//
//
//     // GUI
//
//     gui = new dat.GUI();
//     gui.add(control, 'particleNum', 0, 500).step(1).name('Particle Num').onChange(function() {
//         var n = (control.particleNum | 0) - particles.length;
//         if (n > 0)
//             addParticle(n);
//         else if (n < 0)
//             removeParticle(-n);
//     });
//     gui.add(GravityPoint, 'interferenceToPoint').name('Interference Between Point');
//     gui.close();
//
//
//     // Start Update
//
//     var loop = function() {
//         var i, len, g, p;
//
//         context.save();
//         context.fillStyle = BACKGROUND_COLOR;
//         context.fillRect(0, 0, screenWidth, screenHeight);
//         context.fillStyle = grad;
//         context.fillRect(0, 0, screenWidth, screenHeight);
//         context.restore();
//
//         for (i = 0, len = gravities.length; i < len; i++) {
//             g = gravities[i];
//             if (g.dragging) g.drag(mouse);
//             g.render(context);
//             if (g.destroyed) {
//                 gravities.splice(i, 1);
//                 len--;
//                 i--;
//             }
//         }
//
//         bufferCtx.save();
//         bufferCtx.globalCompositeOperation = 'destination-out';
//         bufferCtx.globalAlpha = 0.35;
//         bufferCtx.fillRect(0, 0, screenWidth, screenHeight);
//         bufferCtx.restore();
//
//         // パーティクルをバッファに描画
//         // for (i = 0, len = particles.length; i < len; i++) {
//         //     particles[i].render(bufferCtx);
//         // }
//         len = particles.length;
//         bufferCtx.save();
//         bufferCtx.fillStyle = bufferCtx.strokeStyle = '#fff';
//         bufferCtx.lineCap = bufferCtx.lineJoin = 'round';
//         bufferCtx.lineWidth = PARTICLE_RADIUS * 2;
//         bufferCtx.beginPath();
//         for (i = 0; i < len; i++) {
//             p = particles[i];
//             p.update();
//             bufferCtx.moveTo(p.x, p.y);
//             bufferCtx.lineTo(p._latest.x, p._latest.y);
//         }
//         bufferCtx.stroke();
//         bufferCtx.beginPath();
//         for (i = 0; i < len; i++) {
//             p = particles[i];
//             bufferCtx.moveTo(p.x, p.y);
//             bufferCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
//         }
//         bufferCtx.fill();
//         bufferCtx.restore();
//
//         // バッファをキャンバスに描画
//         context.drawImage(bufferCvs, 0, 0);
//
//         requestAnimationFrame(loop);
//     };
//     loop();
//
// })();

// SOURCE: http://codepen.io/Thibka/pen/mWGxNj

console.log("This is the master js");

var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  canvasWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
  canvasHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
  requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
var persons = [],
  numberOfFirefly = 30,
  birthToGive = 25;

var colors = [];
/* Galactic Tea - http://www.colourlovers.com/palette/1586746/Galactic_Tea*/
colors[2] = [];
colors[2]['background'] = '#2F294F';
colors[2][1] = 'rgba(74,49,89,';
colors[2][2] = 'rgba(130,91,109,';
colors[2][3] = 'rgba(185,136,131,';
colors[2][4] = 'rgba(249,241,204,';

var colorTheme = 2, //getRandomInt(0,colors.length-1);
  mainSpeed = 1;

function getRandomInt(min, max, exept) {
  var i = Math.floor(Math.random() * (max - min + 1)) + min;
  if (typeof exept == "undefined") return i;
  else if (typeof exept == 'number' && i == exept) return getRandomInt(min, max, exept);
  else if (typeof exept == "object" && (i >= exept[0] && i <= exept[1])) return getRandomInt(min, max, exept);
  else return i;
}

function isEven(n) {
  return n == parseFloat(n) ? !(n % 2) : void 0;
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function Firefly(id) {
  this.id = id;
  this.width = getRandomInt(3, 6);
  this.height = this.width;
  this.x = getRandomInt(0, (canvas.width - this.width));
  this.y = getRandomInt(0, (canvas.height - this.height));
  this.speed = (this.width <= 10) ? 2 : 1;
  this.alpha = 1;
  this.alphaReduction = getRandomInt(1, 3) / 1000;
  this.color = colors[colorTheme][getRandomInt(1, colors[colorTheme].length - 1)];
  this.direction = getRandomInt(0, 360);
  this.turner = getRandomInt(0, 1) == 0 ? -1 : 1;
  this.turnerAmp = getRandomInt(1, 2);
  this.isHit = false;
  this.stepCounter = 0;
  this.changeDirectionFrequency = getRandomInt(1, 200);
  this.shape = 2; //getRandomInt(2,3);
  this.shadowBlur = getRandomInt(5, 25);
}

Firefly.prototype.stop = function() {
  this.update();
}

Firefly.prototype.walk = function() {
  var next_x = this.x + Math.cos(degToRad(this.direction)) * this.speed,
    next_y = this.y + Math.sin(degToRad(this.direction)) * this.speed;

  // Canvas limits
  if (next_x >= (canvas.width - this.width) && (this.direction < 90 || this.direction > 270)) {
    next_x = canvas.width - this.width;
    this.direction = getRandomInt(90, 270, this.direction);
  }
  if (next_x <= 0 && (this.direction > 90 && this.direction < 270)) {
    next_x = 0;
    var exept = [90, 270];
    this.direction = getRandomInt(0, 360, exept);
  }
  if (next_y >= (canvas.height - this.height) && (this.direction > 0 && this.direction < 180)) {
    next_y = canvas.height - this.height;
    this.direction = getRandomInt(180, 360, this.direction);
  }
  if (next_y <= 0 && (this.direction > 180 && this.direction < 360)) {
    next_y = 0;
    this.direction = getRandomInt(0, 180, this.direction);
  }

  this.x = next_x;
  this.y = next_y;

  this.stepCounter++;

  if (this.changeDirectionFrequency && this.stepCounter == this.changeDirectionFrequency) {
    this.turner = this.turner == -1 ? 1 : -1;
    this.turnerAmp = getRandomInt(1, 2);
    this.stepCounter = 0;
    this.changeDirectionFrequency = getRandomInt(1, 200);
  }

  this.direction += this.turner * this.turnerAmp;

  this.update();
}

Firefly.prototype.takeOppositeDirection = function() {
  // Right -> Left
  if ((this.direction >= 0 && this.direction < 90) || (this.direction > 270 && this.direction <= 360)) {
    this.direction = getRandomInt(90, 270);
    return;
  }
  // Left -> Right
  if (this.direction > 90 && this.direction < 270) {
    var exept = [90, 270];
    this.direction = getRandomInt(0, 360, exept);
    return;
  }
  // Down -> Up
  if (this.direction > 0 && this.direction < 180) {
    this.direction = getRandomInt(180, 360);
    return;
  }
  // Up -> Down
  if (this.direction > 180) {
    this.direction = getRandomInt(0, 180);
  }
}

Firefly.prototype.update = function() {

  context.beginPath();

  context.fillStyle = this.color + this.alpha + ")";
  context.arc(this.x + (this.width / 2), this.y + (this.height / 2), this.width / 2, 0, 2 * Math.PI, false);
  context.shadowColor = this.color + this.alpha + ")";
  context.shadowBlur = this.shadowBlur;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.fill();

  if (this.id > 15) {
    this.alpha -= this.alphaReduction;
    if (this.alpha <= 0) this.die();
  }

}

Firefly.prototype.die = function() {
  persons[this.id] = null;
  delete persons[this.id];
}

window.onload = function() {
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);

  start();
}

function start() {
  instantiatePopulation();
  animate();
}

function instantiatePopulation() {
  var i = 0;
  while (i < numberOfFirefly) {
    persons[i] = new Firefly(i);
    i++;
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();

  // Création d'une copie de l'array persons
  persons_order = persons.slice(0);
  // Tri par ordre de position sur l'axe y (afin de gérer les z-index)
  persons_order.sort(function(a, b) {
    return a.y - b.y
  });

  // Paint les instances dans l'ordre trié
  for (var i in persons_order) {
    var u = persons_order[i].id;
    persons[u].walk();
  }

  requestAnimationFrame(animate);
}

canvas.onclick = function(e) {
  giveBirth(e, birthToGive);
}

function giveBirth(e, u) {
  var i = persons.length;
  persons[i] = new Firefly(i);
  persons[i].x = e.layerX;
  persons[i].y = e.layerY;

  if (u > 1) giveBirth(e, u - 1);
}

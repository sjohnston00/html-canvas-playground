import Shape from "./Shape.js";
import Sprite from "./Sprite.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";
const amount = document.getElementById("amount");
const amountSpan = document.getElementById("amount-span");
let shapesAmount = (amount === null || amount === void 0 ? void 0 : amount.valueAsNumber) || 1;
const idle = new Image();
idle.src = "/Punk/Punk_idle.png";
const jumping = new Image();
jumping.src = "/Punk/Punk_jump.png";
const running = new Image();
running.src = "/Punk/Punk_run.png";
const spriteImages = new Map();
spriteImages.set("idle", { img: idle, frames: 4 });
spriteImages.set("jumping", { img: jumping, frames: 4 });
spriteImages.set("run", { img: running, frames: 6 });
const sprite = new Sprite(0, 0, 48, 48, 0, 0, spriteImages, 4);
amount === null || amount === void 0 ? void 0 : amount.addEventListener("input", (e) => {
    //adding and remove items rather than re-rendering
    // if (amount.valueAsNumber > shapesAmount) {
    //   const { x, y, height, width, dx, dy } = generateRandomShape()
    //   shapes.push(new Shape(x, y, height, width, 'red', dx, dy))
    // } else if (amount.valueAsNumber < shapesAmount) {
    //   shapes.pop()
    // }
    shapesAmount = amount.valueAsNumber || 1;
    amountSpan.textContent = shapesAmount.toString();
    init();
});
const speed = document.getElementById("speed");
const speedSpan = document.getElementById("speed-span");
let shapeSpeed = (speed === null || speed === void 0 ? void 0 : speed.valueAsNumber) || 1;
speed === null || speed === void 0 ? void 0 : speed.addEventListener("input", (e) => {
    shapeSpeed = speed.valueAsNumber || 1;
    speedSpan.textContent = shapeSpeed.toString();
    shapes.forEach((s) => {
        s.dx = s.dx < 0 ? shapeSpeed * -1 : shapeSpeed;
        s.dy = s.dy < 0 ? shapeSpeed * -1 : shapeSpeed;
    });
    // init()
});
let innerHeight = window.innerHeight;
let innerWidth = window.innerWidth;
window.addEventListener("resize", (e) => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    innerHeight = window.innerHeight;
    innerWidth = window.innerWidth;
    init();
});
window.addEventListener("keydown", (e) => {
    sprite.addKeyState(e.key);
    if (e.key === " ") {
        sprite.IsJumping = true;
    }
});
window.addEventListener("touchstart", (e) => {
    square.addKeyState(" ");
});
window.addEventListener("touchend", (e) => {
    square.removeKeyState(" ");
});
window.addEventListener("keyup", (e) => {
    sprite.removeKeyState(e.key);
    sprite.dx = 0;
});
canvas.height = innerHeight;
canvas.width = innerWidth;
let shapes = new Map();
const square = new Shape(10, 1, 40, 40, "red", 0, 0);
function init() {
    shapes = new Map();
    // for (let index = 0; index < shapesAmount; index++) {
    //   const { x, y, height, width, dx, dy } = generateRandomMovingShape()
    //   shapes.set(
    //     window.crypto.randomUUID(),
    //     new Shape(x, y, height, width, generateRandonColour(), dx, dy)
    //   )
    // }
}
function generateRandonColour() {
    return `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
}
function generateRandomMovingShape() {
    const height = Math.floor(Math.random() * 100) + 10;
    const width = Math.floor(Math.random() * 100) + 10;
    const x = Math.random() * (innerWidth - width * 2) + width;
    const y = Math.random() * (innerHeight - height * 2) + height;
    const dx = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1;
    const dy = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1;
    return { x, y, height, width, dx, dy };
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sprite.update(ctx);
    shapes.forEach((s) => {
        s.update(ctx);
    });
    // square.update(ctx)
    if (sprite.IsJumping) {
        ctx.beginPath();
        ctx.moveTo(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
        ctx.lineTo(200, 200);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    //bottom
    ctx.strokeStyle = "black";
    ctx.strokeRect(-1, innerHeight - 100, innerWidth + 1, 100);
    //circle 1
    ctx.beginPath();
    ctx.arc(100, 100, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    //circle 2
    ctx.beginPath();
    ctx.arc(200, 200, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    //circle 3
    ctx.beginPath();
    ctx.arc(300, 100, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    //circle 4
    ctx.beginPath();
    ctx.arc(400, 200, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    //circle 5
    ctx.beginPath();
    ctx.arc(500, 100, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    requestAnimationFrame(draw);
}
init();
draw();
//# sourceMappingURL=index.js.map
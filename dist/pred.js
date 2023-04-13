const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = '/Map.png';
img.onload = () => {
    console.log('map loaded');
    draw();
};
// let innerHeight = window.innerHeight
// let innerWidth = window.innerWidth
// window.addEventListener('resize', (e) => {
//   canvas.height = window.innerHeight
//   canvas.width = window.innerWidth
//   innerHeight = window.innerHeight
//   innerWidth = window.innerWidth
// })
// canvas.height = innerHeight
// canvas.width = innerWidth
let shapes = new Map();
//TODO: Get the x, y properties from predData killsData and display shapes on the map
// const square = new Shape(10, 1, 40, 40, 'red', 0, 0)
// shapes.set(window.crypto.randomUUID(), square)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    shapes.forEach((s) => {
        s.update(ctx);
    });
}
draw();
export {};
//# sourceMappingURL=pred.js.map
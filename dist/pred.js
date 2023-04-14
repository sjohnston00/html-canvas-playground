import Shape from './Shape.js';
import { data } from './predData.js';
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
function generateRandonColour() {
    return `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
}
let shapes = new Map();
const scale = 0.045;
const mapSize = 24000;
const canvasMapSize = mapSize * scale;
canvas.height = canvasMapSize;
canvas.width = canvasMapSize;
const match = data[0];
//TODO: Get the x, y properties from predData killsData and display shapes on the map
// const square = new Shape(10, 1, 40, 40, 'red', 0, 0)
// shapes.set(window.crypto.randomUUID(), square)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    for (let index = 0; index < match.heroKills.length; index++) {
        const element = match.heroKills[index];
        console.log({
            location: element.location,
            scaledLocation: {
                x: element.location.x * scale,
                y: element.location.y * scale,
                z: element.location.z * scale
            },
            isWithingMap: element.location.x * scale < canvasMapSize &&
                element.location.y * scale < canvasMapSize &&
                element.location.z * scale < canvasMapSize
        });
        const shape = new Shape(element.location.x * scale, element.location.y * scale, 10, 10, generateRandonColour(), 0, 0, 0);
        shapes.set(crypto.randomUUID(), shape);
    }
    shapes.forEach((s) => {
        s.update(ctx);
    });
}
draw();
//# sourceMappingURL=pred.js.map
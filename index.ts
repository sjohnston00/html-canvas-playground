import Shape from './Shape.js'
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const amount = document.getElementById('amount') as HTMLInputElement
const amountSpan = document.getElementById('amount-span') as HTMLSpanElement
let shapesAmount = amount?.valueAsNumber || 1

amount?.addEventListener('input', (e) => {
  //adding and remove items rather than re-rendering
  // if (amount.valueAsNumber > shapesAmount) {
  //   const { x, y, height, width, dx, dy } = generateRandomShape()
  //   shapes.push(new Shape(x, y, height, width, 'red', dx, dy))
  // } else if (amount.valueAsNumber < shapesAmount) {
  //   shapes.pop()
  // }
  shapesAmount = amount.valueAsNumber || 1
  amountSpan.textContent = shapesAmount.toString()
  init()
})

const speed = document.getElementById('speed') as HTMLInputElement
const speedSpan = document.getElementById('speed-span') as HTMLSpanElement
let shapeSpeed = speed?.valueAsNumber || 1

speed?.addEventListener('input', (e) => {
  shapeSpeed = speed.valueAsNumber || 1
  speedSpan.textContent = shapeSpeed.toString()

  for (let index = 0; index < shapes.length; index++) {
    shapes[index].dx = shapes[index].dx < 0 ? shapeSpeed * -1 : shapeSpeed
    shapes[index].dy = shapes[index].dy < 0 ? shapeSpeed * -1 : shapeSpeed
  }
  // init()
})

let innerHeight = window.innerHeight
let innerWidth = window.innerWidth

window.addEventListener('resize', (e) => {
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth

  innerHeight = window.innerHeight
  innerWidth = window.innerWidth

  init()
})

window.addEventListener('keydown', (e) => {
  square.addKeyState(e.key)
  // switch (e.key) {
  //   case 'ArrowRight':
  //     square.dx = 10
  //     break
  //   case 'ArrowLeft':
  //     square.dx = -10
  //     break
  //   case ' ':
  //     square.dy = -10
  //   default:
  //     break
  // }
})

window.addEventListener('keyup', (e) => {
  square.removeKeyState(e.key)
  square.dx = 0
})

canvas.height = innerHeight
canvas.width = innerWidth

let shapes: Shape[] = []

const square = new Shape(10, 1, 40, 40, 'red', 0, 0)

function init() {
  shapes = []
  // for (let index = 0; index < shapesAmount; index++) {
  //   const { x, y, height, width, dx, dy } = generateRandomMovingShape()
  //   shapes.push(new Shape(x, y, height, width, generateRandonColour(), dx, dy))
  // }
}

function generateRandonColour() {
  return `#${((Math.random() * 0xffffff) << 0).toString(16)}`
}

function generateRandomMovingShape() {
  const height = Math.floor(Math.random() * 100) + 10
  const width = Math.floor(Math.random() * 100) + 10
  const x = Math.random() * (innerWidth - width * 2) + width
  const y = Math.random() * (innerHeight - height * 2) + height
  const dx = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1
  const dy = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1
  return { x, y, height, width, dx, dy }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let index = 0; index < shapes.length; index++) {
    shapes[index].update(ctx, innerWidth, innerHeight)
  }
  square.update(ctx, innerWidth, innerHeight)

  //bottom
  ctx.strokeStyle = 'black'
  ctx.strokeRect(0, innerHeight - 100, innerWidth, 100)

  //circle 1
  ctx.beginPath()
  ctx.arc(100, 100, 20, 0, 2 * Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()

  //circle 2
  ctx.beginPath()
  ctx.arc(200, 200, 20, 0, 2 * Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()

  //circle 3
  ctx.beginPath()
  ctx.arc(300, 100, 20, 0, 2 * Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()

  //circle 4
  ctx.beginPath()
  ctx.arc(400, 200, 20, 0, 2 * Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()

  //circle 5
  ctx.beginPath()
  ctx.arc(500, 100, 20, 0, 2 * Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()
  requestAnimationFrame(draw)
}

init()
draw()

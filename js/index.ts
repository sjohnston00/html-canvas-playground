import Shape from './Shape.js'
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const amount = document.getElementById('amount') as HTMLInputElement
const amountSpan = document.getElementById('amount-span') as HTMLSpanElement
const speed = document.getElementById('speed') as HTMLInputElement
const speedSpan = document.getElementById('speed-span') as HTMLSpanElement

let shapeSpeed = speed?.valueAsNumber || 1
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

speed?.addEventListener('input', (e) => {
  shapeSpeed = speed.valueAsNumber || 1
  speedSpan.textContent = shapeSpeed.toString()

  shapes.forEach((s) => {
    s.dx = s.dx < 0 ? shapeSpeed * -1 : shapeSpeed
    s.dy = s.dy < 0 ? shapeSpeed * -1 : shapeSpeed
  })
  // init()
})

let innerHeight = window.innerHeight
let innerWidth = window.innerWidth

canvas.height = innerHeight
canvas.width = innerWidth

window.addEventListener('resize', (e) => {
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth

  innerHeight = window.innerHeight
  innerWidth = window.innerWidth

  init()
})

window.addEventListener('keydown', (e) => {
  square.addKeyState(e.key)
  if (e.key === ' ') {
    console.log('spacebar')
  }
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

window.addEventListener('touchstart', (e) => {
  square.addKeyState(' ')
})
window.addEventListener('touchend', (e) => {
  square.removeKeyState(' ')
})
window.addEventListener('keyup', (e) => {
  square.removeKeyState(e.key)
  square.dx = 0
})

function findClosestShape(x: number, y: number): Shape | null {
  let closestDistance = Infinity
  let closestShape = null
  shapes.forEach((shape) => {
    if (shape.y > y) return //only find the closest shapes that are above the passed in shape (like a swing)
    let distance = Math.sqrt((shape.x - x) ** 2 + (shape.y - y) ** 2)
    if (distance < closestDistance) {
      closestDistance = distance
      closestShape = shape
    }
  })
  return closestShape
}

let shapes = new Map<string, Shape>()

const square = new Shape(10, 1, 40, 40, 'red', 0, 0)

function init() {
  shapes = new Map<string, Shape>()
  for (let index = 0; index < shapesAmount; index++) {
    const { x, y, height, width, dx, dy } = generateRandomMovingShape()
    shapes.set(
      window.crypto.randomUUID(),
      new Shape(x, y, height, width, generateRandonColour(), 0, 0, 0)
    )
  }
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

  shapes.forEach((s) => {
    s.update(ctx)
  })
  square.update(ctx)

  if (square.keyState.has(' ')) {
    const shape = findClosestShape(square.x, square.y)
    ctx.beginPath()
    ctx.moveTo(square.x + square.width / 2, square.y + square.height / 2)
    ctx.lineTo(
      (shape?.x || 0) + (shape?.width || 0) / 2,
      (shape?.y || 0) + (shape?.height || 0) / 2
    )
    ctx.strokeStyle = 'black'
    ctx.stroke()
  }

  // console.log(shapes)

  //bottom
  ctx.strokeStyle = 'black'
  ctx.strokeRect(0, innerHeight - 100, innerWidth, 100)

  //circle 1
  // ctx.beginPath()
  // ctx.arc(100, 100, 20, 0, 2 * Math.PI)
  // ctx.fillStyle = 'black'
  // ctx.fill()

  // //circle 2
  // ctx.beginPath()
  // ctx.arc(200, 200, 20, 0, 2 * Math.PI)
  // ctx.fillStyle = 'black'
  // ctx.fill()

  // //circle 3
  // ctx.beginPath()
  // ctx.arc(300, 100, 20, 0, 2 * Math.PI)
  // ctx.fillStyle = 'black'
  // ctx.fill()

  // //circle 4
  // ctx.beginPath()
  // ctx.arc(400, 200, 20, 0, 2 * Math.PI)
  // ctx.fillStyle = 'black'
  // ctx.fill()

  // //circle 5
  // ctx.beginPath()
  // ctx.arc(500, 100, 20, 0, 2 * Math.PI)
  // ctx.fillStyle = 'black'
  // ctx.fill()
  requestAnimationFrame(draw)
}

init()
draw()

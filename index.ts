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

canvas.height = innerHeight
canvas.width = innerWidth

let shapes: Shape[] = []

function init() {
  shapes = []
  for (let index = 0; index < shapesAmount; index++) {
    const { x, y, height, width, dx, dy } = generateRandomShape()
    shapes.push(new Shape(x, y, height, width, 'red', dx, dy))
  }
}

function generateRandomShape() {
  const height = Math.floor(Math.random() * 100) + 10
  const width = Math.floor(Math.random() * 100) + 10
  const x = Math.random() * (innerWidth - width * 2) + width
  const y = Math.random() * (innerHeight - height * 2) + height
  const dx = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1
  const dy = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1
  return { x, y, height, width, dx, dy }
}

function draw() {
  requestAnimationFrame(draw)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let index = 0; index < shapes.length; index++) {
    shapes[index].update(ctx, innerWidth, innerHeight)
  }
}

init()
draw()

import Shape from "./Shape.js"
const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

const amount = document.getElementById("amount") as HTMLInputElement
const amountSpan = document.getElementById("amount-span") as HTMLSpanElement

const speed = document.getElementById("speed") as HTMLInputElement
const speedSpan = document.getElementById("speed-span") as HTMLSpanElement

let shapeSpeed = speed?.valueAsNumber || 1
let shapesAmount = amount?.valueAsNumber || 1

amount?.addEventListener("input", (e) => {
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

speed?.addEventListener("input", (e) => {
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

window.addEventListener("resize", (e) => {
  innerHeight = window.innerHeight
  innerWidth = window.innerWidth

  canvas.height = innerHeight
  canvas.width = innerWidth
  init()
})

window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    if (square.dy >= 0) {
      square.addKeyState(e.key)
    }
  } else {
    square.addKeyState(e.key)
  }
})

window.addEventListener("touchstart", (e) => {
  square.addKeyState(" ")
})
window.addEventListener("touchend", (e) => {
  square.removeKeyState(" ")
})

window.addEventListener("keyup", (e) => {
  square.removeKeyState(e.key)
})

function findClosestShape(x: number, y: number): Shape | null {
  let closestDistance = Infinity
  let closestShape = null
  shapes.forEach((shape) => {
    // if (shape.y > y) return //only find the closest shapes that are above the passed in shape (like a swing)
    let distance = Math.sqrt((shape.x - x) ** 2 + (shape.y - y) ** 2)
    if (distance < closestDistance) {
      closestDistance = distance
      closestShape = shape
    }
  })
  return closestShape
}

let shapes: Shape[] = []

const square = new Shape(10, innerHeight - 100, 40, 40, "red", 0, 0)

function init() {
  shapes = []
  for (let index = 0; index < shapesAmount; index++) {
    const { x, y, height, width, dx, dy } = generateRandomMovingShape()
    shapes.push(new Shape(x, y, height, width, generateRandonColour(), 0, 0, 0))
  }

  shapes.push(
    new Shape(-1, innerHeight - 100, 100, innerWidth + 1, "grey", 0, 0, 0)
  )
  square.collisionBlocks = shapes
  console.log(square.collisionBlocks)
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
  square.update(ctx)

  for (let index = 0; index < shapes.length; index++) {
    const s = shapes[index]
    s.update(ctx)
    // ctx.beginPath()
    // ctx.moveTo(square.x + square.width / 2, square.y + square.height / 2)
    // ctx.lineTo(s.x + s.width / 2, s.y + s.height / 2)
    // ctx.strokeStyle = "black"
    // ctx.stroke()
  }

  // if (square.keyState.has(" ")) {
  const closestShape = findClosestShape(square.x, square.y)
  if (closestShape) {
    ctx.beginPath()
    ctx.moveTo(square.x + square.width / 2, square.y + square.height / 2)
    ctx.lineTo(
      closestShape.x + closestShape.width / 2,
      closestShape.y + closestShape.height / 2
    )
    ctx.strokeStyle = "black"
    ctx.stroke()
  }
  // }

  //bottom
  ctx.strokeStyle = "black"
  ctx.strokeRect(-1, innerHeight - 100, innerWidth + 1, 100)
  requestAnimationFrame(draw)
}

init()
draw()

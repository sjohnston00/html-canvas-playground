import Shape from './Shape'
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const amount = document.getElementById('amount') as HTMLInputElement
const amountSpan = document.getElementById('amount-span') as HTMLSpanElement

const speed = document.getElementById('speed') as HTMLInputElement
const speedSpan = document.getElementById('speed-span') as HTMLSpanElement

let shapeSpeed = speed?.valueAsNumber || 0
let shapesAmount = amount?.valueAsNumber || 0

amount?.addEventListener('input', (e) => {
  //adding and remove items rather than re-rendering
  // if (amount.valueAsNumber > shapesAmount) {
  //   const { x, y, height, width, dx, dy } = generateRandomShape()
  //   shapes.push(new Shape(x, y, height, width, 'red', dx, dy))
  // } else if (amount.valueAsNumber < shapesAmount) {
  //   shapes.pop()
  // }
  shapesAmount = amount.valueAsNumber || 0
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

// canvas.height = innerHeight
// canvas.width = innerWidth

window.addEventListener('resize', (e) => {
  innerHeight = window.innerHeight
  innerWidth = window.innerWidth

  canvas.height = innerHeight
  canvas.width = innerWidth

  drawImage()

  init()
})

window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    if (square.dy >= 0) {
      square.addKeyState(e.key)
    }
  } else {
    square.addKeyState(e.key)
  }
})

window.addEventListener('touchstart', (e) => {
  square.addKeyState(' ')
})
window.addEventListener('touchend', (e) => {
  square.removeKeyState(' ')
})

window.addEventListener('keyup', (e) => {
  square.removeKeyState(e.key)
})

function findClosestShape(x: number, y: number): Shape | null {
  let closestDistance = Infinity
  let closestShape = null
  shapes.forEach((shape) => {
    if (!shape.hookable) return
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

const square = new Shape(10, innerHeight - 100, 40, 40, 'red', 0, 0)

function init() {
  shapes = []
  for (let index = 0; index < shapesAmount; index++) {
    const { x, y, height, width, dx, dy } = generateRandomMovingShape()
    const newShape = new Shape(
      x,
      y,
      height,
      width,
      generateRandonColour(),
      0,
      0,
      0
    )
    newShape.hookable = true
    shapes.push(newShape)
  }

  // shapes.push(new Shape(60, innerHeight - 100, 100, 300, 'black', 0, 0, 0))
  // shapes.push(new Shape(360, innerHeight - 200, 200, 300, 'black', 0, 0, 0))
  // shapes.push(new Shape(660, innerHeight - 300, 300, 300, 'black', 0, 0, 0))
  // shapes.push(new Shape(960, innerHeight - 400, 400, 300, 'black', 0, 0, 0))
  // shapes.push(new Shape(1260, innerHeight - 500, 500, 300, 'black', 0, 0, 0))
  // shapes.push(new Shape(1260, innerHeight - 500, 500, 300, 'black', 0, 0, 0))

  shapes.push(
    new Shape(
      -1,
      innerHeight - 195,
      195,
      innerWidth + 1,
      'transparent',
      0,
      0,
      0
    )
  )
  square.collisionBlocks = shapes
  console.log(square.collisionBlocks)
}

function generateRandonColour() {
  return `#${((Math.random() * 0xffffff) << 0).toString(16)}`
}

function generateRandomMovingShape() {
  const height = Math.floor(Math.random() * 100) + 25
  const width = Math.floor(Math.random() * 100) + 25
  const x = Math.random() * (innerWidth - width * 2) + width
  const y = Math.random() * (innerHeight - height * 2) + height - 100
  const dx = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1
  const dy = Math.random() > 0.5 ? shapeSpeed : shapeSpeed * -1
  return { x, y, height, width, dx, dy }
}

const backgroundImage = new Image()
backgroundImage.src =
  'https://img.freepik.com/free-vector/autumn-landscape-background_1012-302.jpg?w=2000&t=st=1682620326~exp=1682620926~hmac=ab958d510de1c3f3a4b38c369141ae3cc591d26a41c794e1a47c4851a6ddb9bc'

backgroundImage.onload = () => {
  drawImage()
}

let backgroundImageXPos = 0
let backgroundImageYPos = 0

function drawImage() {
  //TODO: figure out how to draw the image background and move the "camera" based on the square, also make sure we dont move the camera past the boundaries of the image
  const hRatio = canvas.width / backgroundImage.width
  const vRatio = canvas.height / backgroundImage.height
  const ratio = Math.min(hRatio, vRatio)
  const zoom = 2

  function getImageX() {
    if (square.x - 100 < 0) {
      return 0
    }

    if (square.x + canvas.width / 2 > canvas.width) {
      return canvas.width
    }
    return square.x - 100
  }

  const x = getImageX()
  const y = square.y - 100 > 0 ? square.y - 100 : 0
  console.log('image coords', {
    x,
    y,
    backgroundImage: {
      width: backgroundImage.width,
      height: backgroundImage.height
    },
    canvas: { width: canvas.width, height: canvas.height }
  })
  ctx.drawImage(
    backgroundImage,
    x,
    y,
    900 * zoom,
    900 * 0.56 * zoom,
    0,
    0,
    canvas.width,
    canvas.height
  )
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawImage()
  // ctx.drawImage(backgroundImage, 0, 0, innerWidth, innerHeight)
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
    // ctx.beginPath()
    // ctx.moveTo(square.x + square.width / 2, square.y + square.height / 2)
    // ctx.lineTo(
    //   closestShape.x + closestShape.width / 2,
    //   closestShape.y + closestShape.height / 2
    // )
    // ctx.strokeStyle = 'black'
    // ctx.stroke()
    ctx.beginPath()
    ctx.arc(
      closestShape.x + closestShape.width / 2,
      closestShape.y + closestShape.height / 2,
      5,
      0,
      2 * Math.PI
    )
    ctx.fillStyle = 'black'
    ctx.stroke()
    if (square.isJumping) {
      ctx.beginPath()
      ctx.moveTo(square.x + square.width / 2, square.y + square.height / 2)
      ctx.lineTo(
        closestShape.x + closestShape.width / 2,
        closestShape.y + closestShape.height / 2
      )
      ctx.strokeStyle = 'black'
      ctx.stroke()
    }
  }
  // }

  // //bottom
  // ctx.strokeStyle = 'black'
  // ctx.strokeRect(-1, innerHeight - 100, innerWidth + 1, 100)
  requestAnimationFrame(draw)
}

init()
draw()

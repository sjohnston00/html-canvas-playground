import Sprite from "./Sprite.js"
const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

ctx.imageSmoothingEnabled = true
ctx.imageSmoothingQuality = "high"

const idle = new Image()
idle.src = "/Punk/Punk_idle.png"

const jumping = new Image()
jumping.src = "/Punk/Punk_jump.png"

const running = new Image()
running.src = "/Punk/Punk_run.png"

const spriteImages = new Map<
  string,
  { img: HTMLImageElement; frames: number }
>()
spriteImages.set("idle", { img: idle, frames: 4 })
spriteImages.set("jumping", { img: jumping, frames: 4 })
spriteImages.set("run", { img: running, frames: 6 })
const sprite = new Sprite(0, 0, 48, 48, 0, 0, spriteImages, 4)

let innerHeight = window.innerHeight
let innerWidth = window.innerWidth

canvas.height = innerHeight
canvas.width = innerWidth

window.addEventListener("resize", (e) => {
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth

  innerHeight = window.innerHeight
  innerWidth = window.innerWidth
})

window.addEventListener("keydown", (e) => {
  sprite.addKeyState(e.key)
  if (e.key === " ") {
    sprite.IsJumping = true
  }
})

window.addEventListener("keyup", (e) => {
  sprite.removeKeyState(e.key)
  sprite.dx = 0
})

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  sprite.update(ctx)

  //bottom
  ctx.strokeStyle = "black"
  ctx.strokeRect(-1, canvas.height - 100, canvas.width + 1, 100)

  requestAnimationFrame(draw)
}

draw()

import * as PIXI from "pixijs"

const gameDiv = document.getElementById("game") as HTMLDivElement
const count = document.getElementById("count")

async function main() {
  const app = new PIXI.Application({
    // width: window.innerWidth,
    // height: window.innerHeight,
    width: 640,
    height: 360,
    background: "#444444",
  })
  gameDiv.appendChild(app.view)

  PIXI.Assets.add("punkSpriteSheet", "assets/Punk/spritesheet.json")
  PIXI.Assets.add("punkSpriteSheetPNG", "assets/Punk/Spritesheet.png")

  // const textures = await PIXI.Assets.load(["punkSpriteSheetPNG"])

  let currAnimationIndex = 0
  const sheet = await PIXI.Assets.load("punkSpriteSheet")

  const SCALE = 1.5

  let sprite = new PIXI.AnimatedSprite(
    sheet.animations[Object.keys(sheet.animations)[currAnimationIndex]]
  )
  sprite.scale.set(SCALE, SCALE)
  sprite.animationSpeed = 0.088
  sprite.play()
  sprite.x = app.view.width / 3
  sprite.y = app.view.height / 2
  sprite.anchor.set(0.5)
  app.stage.addChild(sprite)

  let sprite2 = new PIXI.AnimatedSprite(
    sheet.animations[Object.keys(sheet.animations)[currAnimationIndex]]
  )
  sprite2.scale.set(SCALE * -1, SCALE)
  sprite2.animationSpeed = 0.088
  sprite2.play()
  sprite2.x = app.view.width / 2
  sprite2.y = app.view.height / 2
  sprite2.anchor.set(0.5)
  app.stage.addChild(sprite2)

  type Bullet = {
    bullet: PIXI.Graphics
    reversed: boolean
    speed: number
  }

  // Add a ticker callback to move the sprite back and forth

  let bullets: Bullet[] = []

  let elapsed = 0.0
  const seconds = 2
  const ms = seconds * 100

  let elapsed2 = 0

  const playerGraphic = new PIXI.Graphics()
  const playerHeight = 50
  const playerWidth = 10

  const playerY = 0
  const playerX = 0
  playerGraphic.beginFill(0xffffff)
  playerGraphic.drawRect(playerX, playerY, playerWidth, playerHeight)
  playerGraphic.endFill()

  const playerTexture = app.renderer.generateTexture(playerGraphic)
  const player = new PIXI.Sprite(playerTexture)
  // player.anchor.set(0.5)
  app.stage.addChild(player)

  gameDiv.addEventListener("mousemove", (e) => {
    if (e.offsetY - player.height / 2 < 0) {
      player.y = 0
    } else if (e.offsetY + player.height / 2 > app.view.height) {
      player.y = app.view.height - player.height
    } else {
      player.y = e.offsetY - player.height / 2
    }

    if (e.offsetX - player.width / 2 < 0) {
      player.x = 0
    } else if (e.offsetX + player.width / 2 > app.view.width) {
      player.x = app.view.width - player.width
    } else {
      player.x = e.offsetX - player.width / 2
    }
  })

  // console.log(app.stage._bounds.)

  const newBulletGraphic = new PIXI.Graphics()

  let hitBullets = 0

  app.ticker.add((delta) => {
    // console.log(bullets)

    elapsed2 += (1 / 60) * delta

    // console.log(elapsed2)
    // console.log(bullets)

    elapsed += delta

    for (let index = 0; index < bullets.length; index++) {
      //TODO: Check the bullet is colliding with the player
      //if it is, destroy it and splice the arary

      const { bullet, reversed, speed } = bullets[index]

      const bulletBounds = bullet.getBounds()
      const bulletX = bulletBounds.x
      const bulletY = bulletBounds.y

      const {
        x: playerX,
        y: playerY,
        height: playerHeight,
        width: playerWidth,
      } = player

      if (
        !reversed &&
        bulletX + bullet.width > playerX &&
        bulletX + bullet.width < playerX + playerWidth &&
        bulletY < playerY + playerHeight &&
        bulletY + bullet.height > playerY
      ) {
        console.log("colliding left side")
        hitBullets++

        if (count) {
          count.textContent = hitBullets.toString()
        }
        console.log(hitBullets)

        bullet.destroy()
        bullets.splice(index, 1)
        index--
        continue
      }

      if (reversed) {
        bullet.x -= speed
      } else {
        bullet.x += speed
      }

      // if (bullet.x < player. ) {
      // }

      //NOTE: The x,y position is relative on the original position it was set at not the position on the canvas
      //e.g original position is x=10 if we do x -=1 the new x position is now -1 not 9
      if (reversed && bullet.x < -app.view.width - bullet.width) {
        bullet.destroy()
        bullets.splice(index, 1)
        index--
        continue
      }
      if (!reversed && bullet.x > app.view.width) {
        bullet.destroy()
        bullets.splice(index, 1)
        index--
        continue
      }
    }
    if (elapsed2 > 0.1) {
      const newBulletGraphic = new PIXI.Graphics()
      const reversed = Math.random() > 0.5
      const speed = randomIntBetween(5, 10)
      // console.log({ reversed })

      const height = 5
      const width = 20

      const y = randomIntBetween(10, app.view.height - height)
      console.log({ y, playerY: player.y })

      const x = reversed ? app.view.width : 0 - width
      newBulletGraphic.beginFill(0xff00ff)
      newBulletGraphic.drawRect(x, y, width, height)
      newBulletGraphic.endFill()

      // const bullet = new PIXI.Sprite(newBulletTexture)
      // bullet.position.set(x, y)
      // bullet.x = x
      // bullet.y = y
      // bullet.width = width
      // bullet.height = height

      app.stage.addChild(newBulletGraphic)
      bullets.push({ bullet: newBulletGraphic, reversed, speed })

      elapsed2 = 0
    }
    // console.log(
    //   `sheet.animations[${Object.keys(sheet.animations)[currAnimationIndex]}]`
    // )
    if (elapsed > ms) {
      elapsed = 0
      if (currAnimationIndex < Object.keys(sheet.animations).length - 1) {
        currAnimationIndex++
      } else {
        currAnimationIndex = 0
      }
      sprite.stop()
      sprite2.stop()
      sprite.textures =
        sheet.animations[Object.keys(sheet.animations)[currAnimationIndex]]
      sprite2.textures =
        sheet.animations[Object.keys(sheet.animations)[currAnimationIndex]]
      sprite.play()
      sprite2.play()
    }
  })

  window.addEventListener("keypress", (e) => {
    if (e.key === "r" || e.key === "R") {
      hitBullets = 0
      if (count) {
        count.textContent = hitBullets.toString()
      }
    }
  })
}

function randomIntBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

main()

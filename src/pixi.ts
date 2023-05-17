import * as PIXI from "pixi.js"

const gameDiv = document.getElementById("game") as HTMLDivElement

async function main() {
  const app = new PIXI.Application<HTMLCanvasElement>({
    // width: window.innerWidth,
    // height: window.innerHeight,
    resolution: Math.max(window.devicePixelRatio, 2),
    autoDensity: true,
    resizeTo: window,
    // width: window.innerHeight,
    // height: window.innerWidth,
    background: "#444444",
    antialias: true,
    hello: true,
    powerPreference: "high-performance",
  })
  //@ts-expect-error
  globalThis.__PIXI_APP__ = app
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
    isGold: boolean
  }

  // Add a ticker callback to move the sprite back and forth

  let bullets: Bullet[] = []

  let elapsed = 0.0
  const seconds = 2
  const ms = seconds * 100

  let elapsed2 = 0

  const playerGraphic = new PIXI.Graphics()

  let hitBullets = Number(window.localStorage.getItem("hits")) || 0
  let playerHeight = 50 + hitBullets
  const playerWidth = 10

  const playerY = 0
  const playerX = 0
  playerGraphic.beginFill("#ffffff")
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

  let timeSinceLastHit = Date.now()
  let timeSinceLastHitGold = Date.now()

  const FPS_Text = new PIXI.Text("FPS: 0", {
    fontSize: "0.9rem",
    fill: "#ffffff",
    padding: 10,
  })
  FPS_Text.x = 8
  FPS_Text.y = 8

  const hitBulletsText = new PIXI.Text(`Hits: ${hitBullets}`, {
    fontSize: "0.9rem",
    fill: "#ffffff",
    padding: 10,
  })

  // hitBulletsText.anchor.set(1, 0)
  hitBulletsText.x = FPS_Text.x + FPS_Text.width + 24
  hitBulletsText.y = 8

  const timeSinceLastHitText = new PIXI.Text(
    `Time Since Last Hit: ${((Date.now() - timeSinceLastHit) / 1000).toFixed(
      1
    )}s`,
    {
      fontSize: "0.9rem",
      fill: "#ffffff",
      padding: 10,
    }
  )

  timeSinceLastHitText.x = hitBulletsText.x + hitBulletsText.width + 24
  timeSinceLastHitText.y = 8

  const timeSinceLastHitGoldText = new PIXI.Text(
    `Time Since Last Hit Gold: ${(
      (Date.now() - timeSinceLastHitGold) /
      1000
    ).toFixed(1)}s`,
    {
      fontSize: "0.9rem",
      fill: "#ffffff",
      padding: 10,
    }
  )

  timeSinceLastHitGoldText.x =
    timeSinceLastHitText.x + timeSinceLastHitText.width + 24
  timeSinceLastHitGoldText.y = 8

  app.stage.addChild(FPS_Text)
  app.stage.addChild(hitBulletsText)
  app.stage.addChild(timeSinceLastHitText)
  app.stage.addChild(timeSinceLastHitGoldText)

  app.ticker.add((delta) => {
    FPS_Text.text = `FPS: ${Math.floor(app.ticker.FPS).toString()}`
    hitBulletsText.text = `Hits: ${Math.floor(hitBullets).toString()}`
    timeSinceLastHitText.text = `Time Since Last Hit: ${(
      (Date.now() - timeSinceLastHit) /
      1000
    ).toFixed(1)}s`

    timeSinceLastHitGoldText.text = `Time Since Last Hit Gold: ${(
      (Date.now() - timeSinceLastHitGold) /
      1000
    ).toFixed(1)}s`

    elapsed2 += (1 / 60) * delta

    elapsed += delta

    for (let index = 0; index < bullets.length; index++) {
      //TODO: Check the bullet is colliding with the player
      //if it is, destroy it and splice the arary

      const { bullet, reversed, speed, isGold } = bullets[index]

      const bulletBounds = bullet.getBounds()
      const bulletX = bulletBounds.x
      const bulletY = bulletBounds.y

      const {
        x: playerX,
        y: playerY,
        height: playerHeight,
        width: playerWidth,
      } = player

      if (isIntersecting(bullet, player)) {
        player.height++
        timeSinceLastHit = Date.now()
        if (isGold) {
          player.height += 10
          timeSinceLastHitGold = Date.now()
          hitBullets += 10
        } else {
          hitBullets++
        }

        window.localStorage.setItem("hits", hitBullets.toString())
        //colliding left side
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
        bullet.renderable = false
        bullet.destroy()
        bullets.splice(index, 1)
        index--
        continue
      }
      if (!reversed && bullet.x > app.view.width) {
        bullet.renderable = false
        bullet.destroy()
        bullets.splice(index, 1)
        index--
        continue
      }
    }
    if (elapsed2 > 0.1) {
      const newBulletGraphic = new PIXI.Graphics()
      const reversed = Math.random() > 0.5
      const isGold = Math.random() > 0.9
      const speed = randomIntBetween(5, 10)

      const height = 5
      const width = 20

      const y = randomIntBetween(10, app.view.height - height)
      const x = reversed ? app.view.width : 0 - width
      newBulletGraphic.beginFill(isGold ? "#FFD700" : "#ff00ff")
      newBulletGraphic.drawRect(x, y, width, height)
      newBulletGraphic.endFill()

      // const bullet = new PIXI.Sprite(newBulletTexture)
      // bullet.position.set(x, y)
      // bullet.x = x
      // bullet.y = y
      // bullet.width = width
      // bullet.height = height

      app.stage.addChild(newBulletGraphic)
      bullets.push({
        bullet: newBulletGraphic,
        reversed,
        speed: isGold ? speed * 3 : speed,
        isGold,
      })

      elapsed2 = 0
    }

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
      window.localStorage.setItem("hits", "0")
      timeSinceLastHit = Date.now()
      timeSinceLastHitGold = Date.now()
      playerHeight = 50 + hitBullets
      player.height = playerHeight
    }
  })
}

function randomIntBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function isIntersecting(a: PIXI.Container, b: PIXI.Container) {
  const ab = a.getBounds()
  const bb = b.getBounds()
  return (
    ab.x + ab.width > bb.x &&
    ab.x < bb.x + bb.width &&
    ab.y + ab.height > bb.y &&
    ab.y < bb.y + bb.height
  )
}

main()

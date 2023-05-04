import * as PIXI from "pixijs"

async function main() {
  const app = new PIXI.Application({
    width: 640,
    height: 360,
    background: "#444444",
  })
  const gameDiv = document.getElementById("game") as HTMLDivElement
  gameDiv.appendChild(app.view)

  PIXI.Assets.add("punkSpriteSheet", "assets/Punk/spritesheet.json")
  PIXI.Assets.add("punkSpriteSheetPNG", "assets/Punk/Spritesheet.png")

  // const textures = await PIXI.Assets.load(["punkSpriteSheetPNG"])

  let currAnimationIndex = 0
  const sheet = await PIXI.Assets.load("punkSpriteSheet")
  console.log(sheet)

  const SCALE = 3

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

  // Add a ticker callback to move the sprite back and forth
  let elapsed = 0.0
  const seconds = 2
  const ms = seconds * 100

  app.ticker.add((delta) => {
    elapsed += delta
    console.log(
      `sheet.animations[${Object.keys(sheet.animations)[currAnimationIndex]}]`
    )
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
}

main()

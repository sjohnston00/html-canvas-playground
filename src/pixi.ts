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

  const sheet = await PIXI.Assets.load("punkSpriteSheet")

  let sprite = new PIXI.AnimatedSprite(sheet.animations["idle"])
  sprite.animationSpeed = 0.088
  sprite.play()

  sprite.x = app.view.width / 2
  sprite.y = app.view.height / 2
  sprite.anchor.set(0.5)
  app.stage.addChild(sprite)

  // Add a ticker callback to move the sprite back and forth
  let elapsed = 0.0
  let currAnimationIndex = 0
  app.ticker.add((delta) => {
    elapsed += delta
    if (elapsed > 200) {
      elapsed = 0
      //TODO: Every 2 seconds swap the texture to another animation
    }
    // sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0
  })
}

main()

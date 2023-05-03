import * as PIXI from "pixijs"

async function main() {
  const app = new PIXI.Application({
    width: 640,
    height: 360,
    background: "#444444",
  })
  const gameDiv = document.getElementById("game") as HTMLDivElement
  gameDiv.appendChild(app.view)

  PIXI.Assets.add("punkIdle", "/assets/Punk/Punk_idle.png")
  PIXI.Assets.add("punkAttack1", "/assets/Punk/Punk_attack1.png")
  PIXI.Assets.add("punkAttack2", "/assets/Punk/Punk_attack2.png")
  PIXI.Assets.add("punkAttack3", "/assets/Punk/Punk_attack3.png")
  PIXI.Assets.add("punkClimb", "/assets/Punk/Punk_climb.png")
  PIXI.Assets.add("punkDeath", "/assets/Punk/Punk_death.png")
  PIXI.Assets.add("punkDoubleJump", "/assets/Punk/Punk_doublejump.png")
  PIXI.Assets.add("punkHurt", "/assets/Punk/Punk_hurt.png")
  PIXI.Assets.add("punkPunch", "/assets/Punk/Punk_punch.png")
  PIXI.Assets.add("punkJump", "/assets/Punk/Punk_jump.png")
  PIXI.Assets.add("punkRunAttack", "/assets/Punk/Punk_run_attack.png")
  PIXI.Assets.add("punkRun", "/assets/Punk/Punk_run.png")
  PIXI.Assets.add("punkSpriteSheet", "assets/Punk/spritesheet.json")

  const textures = await PIXI.Assets.load([
    "punkIdle",
    "punkAttack1",
    "punkAttack2",
    "punkAttack3",
    "punkClimb",
    "punkDeath",
    "punkDoubleJump",
    "punkHurt",
    "punkPunch",
    "punkJump",
    "punkRunAttack",
    "punkRun",
  ])

  const sheet = await PIXI.Assets.load("punkSpriteSheet")
  let sprite = new PIXI.AnimatedSprite(sheet.animations["idle"])
  sprite.animationSpeed = 0.088
  sprite.play()
  sprite.x = app.view.width / 2
  sprite.y = app.view.height / 2
  app.stage.addChild(sprite)

  // Add a ticker callback to move the sprite back and forth
  let elapsed = 0.0
  app.ticker.add((delta) => {
    elapsed += delta
    if (elapsed > 200) {
      elapsed = 0
      //TODO: Every 2 seconds swap the texture to another animation
      // sprite.textures =
    }
    // sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0
  })
}

main()

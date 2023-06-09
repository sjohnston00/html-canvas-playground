import * as PIXI from 'pixi.js'
import { ITextStyle, TextStyle } from 'pixi.js'
import { sound, filters } from '@pixi/sound'

const gameDiv = document.getElementById('game') as HTMLDivElement

async function main() {
  const scale = Math.max(window.devicePixelRatio, 2)
  const app = new PIXI.Application<HTMLCanvasElement>({
    // width: window.innerWidth,
    // height: window.innerHeight,
    resolution: scale,
    autoDensity: true,
    resizeTo: window,
    // width: window.innerHeight,
    // height: window.innerWidth,
    background: '#444444',
    antialias: true,
    hello: true,
    powerPreference: 'high-performance'
  })
  //@ts-expect-error
  globalThis.__PIXI_APP__ = app
  gameDiv.appendChild(app.view)

  loadAssets()

  // const textures = await PIXI.Assets.load(["punkSpriteSheetPNG"])

  let currAnimationIndex = 0
  const sheet = await PIXI.Assets.load('punkSpriteSheet')

  const SCALE = 1.5

  let sprite = loadPlayerSprite()
  let sprite2 = loadPlayerSprite()

  sprite2.x = app.view.width / 2
  sprite2.y = app.view.height / 2
  sprite2.scale.set(SCALE * -1, SCALE) //invert on the x axis

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

  let hitBullets = Number(window.localStorage.getItem('hits')) || 0
  let playerHeight = 50 + hitBullets
  const playerWidth = 10

  const playerY = app.view.height / 2
  const playerX = app.view.width / 2
  playerGraphic.beginFill('#ffffff')
  playerGraphic.drawRect(playerX, playerY, playerWidth, playerHeight)
  playerGraphic.endFill()

  const playerTexture = app.renderer.generateTexture(playerGraphic)
  const player = new PIXI.Sprite(playerTexture)
  // player.anchor.set(0.5)
  app.stage.addChild(player)

  gameDiv.addEventListener('mousemove', (e) => {
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

  const textOptions: Partial<ITextStyle> = {
    fontSize: '0.9rem',
    fontFamily: 'monospace',
    fill: '#ffffff',
    padding: 10
  }
  const FPS_Text = new PIXI.Text('FPS: 0', textOptions)
  FPS_Text.x = 8
  FPS_Text.y = 8

  const hitBulletsText = new PIXI.Text(`Hits: ${hitBullets}`, textOptions)

  // hitBulletsText.anchor.set(1, 0)
  hitBulletsText.x = FPS_Text.x + FPS_Text.width + 24
  hitBulletsText.y = 8

  const timeSinceLastHitText = new PIXI.Text(
    `Time Since Last Hit: ${((Date.now() - timeSinceLastHit) / 1000).toFixed(
      1
    )}s`,
    textOptions
  )

  timeSinceLastHitText.x = hitBulletsText.x + hitBulletsText.width + 24
  timeSinceLastHitText.y = 8

  const timeSinceLastHitGoldText = new PIXI.Text(
    `Time Since Last Hit Gold: ${(
      (Date.now() - timeSinceLastHitGold) /
      1000
    ).toFixed(1)}s`,
    textOptions
  )

  timeSinceLastHitGoldText.x =
    timeSinceLastHitText.x + timeSinceLastHitText.width + 24
  timeSinceLastHitGoldText.y = 8

  const resetText = new PIXI.Text(`Press [r] to reset`, textOptions)

  resetText.x = timeSinceLastHitGoldText.x + timeSinceLastHitGoldText.width + 24
  resetText.y = 8

  const bulletPercentageText = new PIXI.Text(
    `Bullets Hit %: 0.00%`,
    textOptions
  )

  bulletPercentageText.x = FPS_Text.x
  bulletPercentageText.y = FPS_Text.y + FPS_Text.height + 12

  const goldBulletPercentageText = new PIXI.Text(
    `Gold Bullets Hit %: 0.00%`,
    textOptions
  )

  goldBulletPercentageText.x =
    bulletPercentageText.x + bulletPercentageText.width + 24
  goldBulletPercentageText.y = bulletPercentageText.y

  const difficultyText = new PIXI.Text(`Difficulty: easy`, textOptions)

  difficultyText.x =
    goldBulletPercentageText.x + goldBulletPercentageText.width + 24
  difficultyText.y = goldBulletPercentageText.y

  difficultyText.eventMode = 'dynamic'
  // difficultyText.buttonMode = true
  difficultyText.on('pointerdown', changeDifficulty)

  const pauseText = new PIXI.Text(`Press [p] to pause`, textOptions)

  pauseText.x = resetText.x + resetText.width + 24
  pauseText.y = 8

  app.stage.addChild(FPS_Text)
  app.stage.addChild(hitBulletsText)
  app.stage.addChild(timeSinceLastHitText)
  app.stage.addChild(timeSinceLastHitGoldText)
  app.stage.addChild(resetText)
  app.stage.addChild(bulletPercentageText)
  app.stage.addChild(goldBulletPercentageText)
  app.stage.addChild(difficultyText)
  app.stage.addChild(pauseText)

  let bulletsSpawned = 0
  let bulletsHit = 0
  let goldBulletsSpawned = 0
  let goldBulletsHit = 0

  const difficulties = {
    easy: 0.001,
    normal: 0.062,
    hard: 0.1
  }

  let chossenDifficulty: keyof typeof difficulties = 'easy'
  let isPaused = false

  const pauseScreen = new PIXI.Graphics()
  pauseScreen.height = app.stage.height * scale
  pauseScreen.width = app.stage.width * scale
  pauseScreen.beginFill('#ffffff')
  pauseScreen.drawRect(0, 0, app.stage.height * scale, app.stage.width * scale)
  pauseScreen.endFill()
  pauseScreen.alpha = 0.8
  pauseScreen.name = 'pause screen'

  const pauseScreenText = new PIXI.Text('PAUSED', {
    fill: 'black',
    fontSize: '4rem',
    fontWeight: '900',
    padding: 10
  })

  pauseScreenText.anchor.set(0.5)
  console.log({
    width: pauseScreen.width,
    height: pauseScreen.height,
    bounds: pauseScreen.getBounds()
  })

  pauseScreenText.position.x = pauseScreen.width / 2 - pauseScreenText.width / 2 //middle of screen
  pauseScreenText.position.y =
    pauseScreen.height / 8 - pauseScreenText.height / 2 //don't know why but /8 seems to center vertically
  pauseScreen.addChild(pauseScreenText)

  const ticker = app.ticker.add((delta) => {
    if (isPaused) {
      return
    }

    if (player._height < 0) {
      player.height = 50
    }
    player.height -= difficulties[chossenDifficulty]
    updateText()

    elapsed2 += (1 / 60) * delta

    elapsed += delta

    checkBulletCollision()

    if (elapsed2 > 0.1) {
      addBulletToGame()
    }

    if (elapsed > ms) {
      runSpriteAnimation()
    }
  })

  setupResetButton()
  setupPausedButton()

  function setupResetButton() {
    window.addEventListener('keypress', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        bulletsSpawned = 0
        bulletsHit = 0
        goldBulletsSpawned = 0
        goldBulletsHit = 0
        hitBullets = 0
        window.localStorage.setItem('hits', '0')
        timeSinceLastHit = Date.now()
        timeSinceLastHitGold = Date.now()
        playerHeight = 50 + hitBullets
        player.height = playerHeight
      }
    })
  }

  function setupPausedButton() {
    window.addEventListener('keypress', (e) => {
      if (e.key === 'p' || e.key === 'P') {
        isPaused = !isPaused
        if (isPaused) {
          app.stage.addChild(pauseScreen)
          // ticker.stop()
          console.log({ children: app.stage.children })
        } else {
          // ticker.start()
          app.stage.removeChild(pauseScreen)
        }
      }
    })
  }

  function loadPlayerSprite() {
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
    return sprite
  }

  function loadAssets() {
    sound.add('pop', '/assets/audio/pop.wav')
    sound.add('gold-pop', '/assets/audio/gold-pop.mp3')

    PIXI.Assets.add('punkSpriteSheet', 'assets/Punk/spritesheet.json')
    PIXI.Assets.add('punkSpriteSheetPNG', 'assets/Punk/Spritesheet.png')
  }

  function addBulletToGame() {
    const newBulletGraphic = new PIXI.Graphics()
    const reversed = Math.random() > 0.5
    const isGold = Math.random() > 0.9
    const speed = randomIntBetween(5, 10)

    const height = 5
    const width = 20

    const y = randomIntBetween(10, app.view.height - height)
    const x = reversed ? app.view.width : 0 - width
    newBulletGraphic.beginFill(isGold ? '#FFD700' : '#ff00ff')
    newBulletGraphic.drawRect(x, y, width, height)
    newBulletGraphic.endFill()

    // const bullet = new PIXI.Sprite(newBulletTexture)
    // bullet.position.set(x, y)
    // bullet.x = x
    // bullet.y = y
    // bullet.width = width
    // bullet.height = height
    app.stage.addChild(newBulletGraphic)
    bulletsSpawned++

    if (isGold) goldBulletsSpawned++

    bullets.push({
      bullet: newBulletGraphic,
      reversed,
      speed: isGold ? speed * 3 : speed,
      isGold
    })

    elapsed2 = 0
  }

  function runSpriteAnimation() {
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

  function checkBulletCollision() {
    for (let index = 0; index < bullets.length; index++) {
      const { bullet, reversed, speed, isGold } = bullets[index]

      if (isIntersecting(bullet, player)) {
        bulletsHit++
        player.height++
        timeSinceLastHit = Date.now()

        if (isGold) {
          // sound.play("gold-pop")
          sound.play('pop', {
            filters: [new filters.DistortionFilter(0.08)]
          })
          goldBulletsHit++
          player.height += 10
          timeSinceLastHitGold = Date.now()
          hitBullets += 10
        } else {
          sound.play('pop')
          hitBullets++
        }

        window.localStorage.setItem('hits', hitBullets.toString())
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
  }

  function updateText() {
    difficultyText.text = `Difficulty: ${chossenDifficulty}`

    switch (chossenDifficulty) {
      case 'easy':
        difficultyText.style.fill = '#84cc16'
        break
      case 'normal':
        difficultyText.style.fill = '#f59e0b'
        break
      case 'hard':
        difficultyText.style.fill = '#ef4444'
        break
    }

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

    const bulletPercentage = (bulletsHit / bulletsSpawned) * 100 || 0
    bulletPercentageText.text = `Bullets Hit %: ${bulletPercentage.toFixed(2)}%`

    const goldBulletPercentage =
      (goldBulletsHit / goldBulletsSpawned) * 100 || 0
    goldBulletPercentageText.text = `Gold Bullets Hit %: ${goldBulletPercentage.toFixed(
      2
    )}%`
  }
  function changeDifficulty() {
    const difficultiesKeys = Object.keys(difficulties)
    const indexOfCurrentDifficulty = difficultiesKeys.indexOf(chossenDifficulty)
    chossenDifficulty =
      difficultiesKeys[
        indexOfCurrentDifficulty === difficultiesKeys.length - 1
          ? 0
          : indexOfCurrentDifficulty + 1
      ]
  }
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

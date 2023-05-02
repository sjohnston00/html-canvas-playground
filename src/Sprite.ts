export default class Sprite {
  private _x: number
  private _y: number
  private _height: number
  private _width: number
  private _dx: number
  private _dy: number
  private _gravity: number
  private _keyState: Map<string, boolean>
  private _images: Map<string, { img: HTMLImageElement; frames: number }>
  private _spriteIndex: number = 0
  private _lastRendered: number = 0
  private readonly _animationTick = 250
  private readonly _movingSpeed = 2
  private readonly _jumpingSpeed = 2
  private _defaultState = "idle"

  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    dx: number,
    dy: number,
    img: Map<string, { img: HTMLImageElement; frames: number }>,
    gravity: number = 0.5
  ) {
    this._x = x
    this._y = y
    this._height = height
    this._width = width
    this._dx = dx
    this._dy = dy
    this._images = img
    this._keyState = new Map<string, boolean>()
    this._gravity = gravity
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // const gradient = ctx.createLinearGradient(
    //   this._x,
    //   this._y,
    //   this._width,
    //   this._height
    // )
    // gradient.addColorStop(0, this._colour)
    // gradient.addColorStop(0.5, this._colour)
    // gradient.addColorStop(1, 'black')

    if (this._keyState.has(" ")) {
      this._defaultState = "jumping"
    } else if (this._keyState.has("ArrowLeft")) {
      this._defaultState = "run"
    } else if (this._keyState.has("ArrowRight")) {
      this._defaultState = "run"
    } else {
      this._defaultState = "idle"
    }

    const img1 = this._images.get(this._defaultState)
    if (!img1) throw new Error("image not found")
    const { img, frames } = img1

    let spriteHeight = img.height
    let spriteWidth = img.width / frames
    ctx.drawImage(
      img,
      spriteWidth * this._spriteIndex,
      0,
      spriteWidth,
      spriteHeight,
      this._x,
      ctx.canvas.height - 100 - spriteHeight,
      spriteWidth,
      spriteHeight
    )
  }

  public update(ctx: CanvasRenderingContext2D): void {
    if (Date.now() - this._lastRendered > this._animationTick) {
      this._lastRendered = Date.now()
      if (
        this._spriteIndex ===
        (this._images.get(this._defaultState)?.frames || 0) - 1
      ) {
        this._spriteIndex = 0
      } else {
        this._spriteIndex++
      }
    }
    const innerHeight = ctx.canvas.height
    const innerWidth = ctx.canvas.width

    console.log({ controls: this._keyState })

    // console .log(this._keyState)

    if (this._keyState.has("ArrowRight")) {
      this._dx = this._movingSpeed
    } else if (this._keyState.has("ArrowLeft")) {
      this._dx = -this._movingSpeed
    }

    if (this.IsJumping) {
      this._dy = -this._jumpingSpeed
    }

    if (this._x + this._width > innerWidth) {
      this._x = 0
    }

    if (this._x < 0) {
      this._x = innerWidth - this._width
    }

    if (this._y + this._height + 100 >= innerHeight) {
      //if we hit the bottom, set dy to 0 (not moving)
      this._dy = 0
      this._y = innerHeight - this._height - 100
    }

    if (this._y <= 0) {
      //if we hit the top just reverse
      // this._dy = 0
      this._y = innerHeight - this.height - 100
    }

    // debugger
    this._dy += this._gravity
    this._x += this._dx
    this._y += this._dy

    this.draw(ctx)
  }

  public get x(): number {
    return this._x
  }
  public set x(value: number) {
    this._x = value
  }
  public get y(): number {
    return this._y
  }
  public set y(value: number) {
    this._y = value
  }
  public get height(): number {
    return this._height
  }
  public set height(value: number) {
    this._height = value
  }
  public get width(): number {
    return this._width
  }
  public set width(value: number) {
    this._width = value
  }
  public get dx(): number {
    return this._dx
  }
  public set dx(value: number) {
    this._dx = value
  }
  public get dy(): number {
    return this._dy
  }
  public set dy(value: number) {
    this._dy = value
  }

  public get gravity(): number {
    return this._gravity
  }
  public set gravity(value: number) {
    this._gravity = value
  }
  public get keyState() {
    return this._keyState
  }
  public addKeyState(value: string) {
    this._keyState.set(value, true)
  }
  public removeKeyState(value: string) {
    this._keyState.delete(value)
  }

  public get images(): Map<string, { img: HTMLImageElement; frames: number }> {
    return this._images
  }
  public set images(
    value: Map<string, { img: HTMLImageElement; frames: number }>
  ) {
    this._images = value
  }

  public get IsJumping(): boolean {
    return !!this._keyState.get(" ")
  }
  public set IsJumping(value: boolean) {
    if (value) {
      this._keyState.set(" ", true)
    } else {
      this._keyState.delete(" ")
    }
  }
}

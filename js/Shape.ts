export default class Shape {
  private _x: number
  private _y: number
  private _height: number
  private _width: number
  private _dx: number
  private _dy: number
  private _colour: string
  private _gravity: number
  private _keyState: Map<string, boolean>
  private _collisionBlocks: Shape[]
  private _hookable: boolean = false

  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    colour: string,
    dx: number,
    dy: number,
    gravity: number = 0.5,
    collisionBlocks: Shape[] = []
  ) {
    this._x = x
    this._y = y
    this._height = height
    this._width = width
    this._colour = colour
    this._dx = dx
    this._dy = dy
    this._gravity = gravity
    this._keyState = new Map<string, boolean>()
    this._collisionBlocks = collisionBlocks
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
    ctx.fillStyle = this._colour
    ctx.fillRect(this._x, this._y, this._width, this._height)
  }

  public update(ctx: CanvasRenderingContext2D): void {
    // console .log(this._keyState)

    this._x += this._dx
    this.handleInput()

    this.checkForHorizontalCollisions(ctx)
    this.applyGravity()
    this.checkForVerticalCollisions(ctx)

    this.draw(ctx)
  }

  checkForHorizontalCollisions(ctx: CanvasRenderingContext2D) {
    const innerWidth = ctx.canvas.width

    if (this._x < 0) {
      this._x = 0
    }
    if (this._x + this._width > innerWidth) {
      this._x = innerWidth - this._width
    }

    for (let i = 0; i < this._collisionBlocks.length; i++) {
      const collisionBlock = this._collisionBlocks[i]

      // if a collision exists
      if (
        this._x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // collision on x axis going to the left
        if (this.dx < -0) {
          const offset = this.x - this.x
          this.x = collisionBlock.x + collisionBlock.width - offset + 0.01
          break
        }

        if (this.dx > 0) {
          const offset = this.x - this.x + this.width
          this.x = collisionBlock.x - offset - 0.01
          break
        }
      }
    }
  }

  checkForVerticalCollisions(ctx: CanvasRenderingContext2D) {
    const innerHeight = ctx.canvas.height

    if (this._y < 0) {
      this._y = 0
    }
    if (this._y + this._height > innerHeight) {
      this._y = innerHeight - this._height
    }

    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      // if a collision exists
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        if (this.dy < 0) {
          this.dy = 0
          const offset = this.y - this.y
          this.y = collisionBlock.y + collisionBlock.height - offset + 0.01
          break
        }

        if (this.dy > 0) {
          this.dy = 0
          const offset = this.y - this.y + this.height
          this.y = collisionBlock.y - offset - 0.01
          break
        }
      }
    }
  }

  applyGravity() {
    this.dy += this.gravity
    this.y += this.dy
  }

  handleInput() {
    this.dx = 0
    if (this._keyState.has('ArrowRight')) {
      this.dx = 5
    } else if (this._keyState.has('ArrowLeft')) {
      this.dx = -5
    }

    if (this._keyState.has(' ')) {
      this._dy = -10
    }
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
  public get colour(): string {
    return this._colour
  }
  public set colour(value: string) {
    this._colour = value
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
  public get collisionBlocks(): Shape[] {
    return this._collisionBlocks
  }
  public set collisionBlocks(value: Shape[]) {
    this._collisionBlocks = value
  }
  public get hookable(): boolean {
    return this._hookable
  }
  public set hookable(value: boolean) {
    this._hookable = value
  }

  public get isJumping() {
    return this._keyState.has(' ')
  }
}

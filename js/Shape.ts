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

  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    colour: string,
    dx: number,
    dy: number,
    gravity: number = 0.5
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
    const innerHeight = ctx.canvas.height
    const innerWidth = ctx.canvas.width
    // console .log(this._keyState)

    if (this._keyState.has('ArrowRight')) {
      this._dx = 10
    } else if (this._keyState.has('ArrowLeft')) {
      this._dx = -10
    }

    if (this._keyState.has(' ')) {
      this._dy = -10
    }

    if (this._x + this._width > innerWidth) {
      this._x = 0
    }

    if (this._x < 0) {
      this._x = innerWidth - this._width
    }

    if (this._y + this._height + 100 > innerHeight + 1) {
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
}

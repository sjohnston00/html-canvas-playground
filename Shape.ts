export default class Shape {
  private _x: number
  private _y: number
  private _height: number
  private _width: number
  private _dx: number
  private _dy: number
  private _colour: string

  constructor(
    x: number,
    y: number,
    height: number,
    width: number,
    colour: string,
    dx: number,
    dy: number
  ) {
    this._x = x
    this._y = y
    this._height = height
    this._width = width
    this._colour = colour
    this._dx = dx
    this._dy = dy
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this._colour
    ctx.fillRect(this._x, this._y, this._width, this._height)
  }

  public update(
    ctx: CanvasRenderingContext2D,
    innerWidth: number,
    innerHeight: number
  ): void {
    if (this._x + this._width > innerWidth || this._x < 0) {
      this._dx = -this._dx
    }

    if (this._y + this._height > innerHeight || this._y < 0) {
      this._dy = -this._dy
    }
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
}

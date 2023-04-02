export default class Shape {
    constructor(x, y, height, width, colour, dx, dy) {
        this._x = x;
        this._y = y;
        this._height = height;
        this._width = width;
        this._colour = colour;
        this._dx = dx;
        this._dy = dy;
    }
    draw(ctx) {
        ctx.fillStyle = this._colour;
        ctx.fillRect(this._x, this._y, this._width, this._height);
    }
    update(ctx, innerWidth, innerHeight) {
        if (this._x + this._width > innerWidth || this._x < 0) {
            this._dx = -this._dx;
        }
        if (this._y + this._height > innerHeight || this._y < 0) {
            this._dy = -this._dy;
        }
        this._x += this._dx;
        this._y += this._dy;
        this.draw(ctx);
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get dx() {
        return this._dx;
    }
    set dx(value) {
        this._dx = value;
    }
    get dy() {
        return this._dy;
    }
    set dy(value) {
        this._dy = value;
    }
    get colour() {
        return this._colour;
    }
    set colour(value) {
        this._colour = value;
    }
}

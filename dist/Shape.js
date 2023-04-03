export default class Shape {
    constructor(x, y, height, width, colour, dx, dy, gravity = 0.5) {
        this._x = x;
        this._y = y;
        this._height = height;
        this._width = width;
        this._colour = colour;
        this._dx = dx;
        this._dy = dy;
        this._gravity = gravity;
        this._keyState = new Map();
    }
    draw(ctx) {
        // const gradient = ctx.createLinearGradient(
        //   this._x,
        //   this._y,
        //   this._width,
        //   this._height
        // )
        // gradient.addColorStop(0, this._colour)
        // gradient.addColorStop(0.5, this._colour)
        // gradient.addColorStop(1, 'black')
        ctx.fillStyle = this._colour;
        ctx.fillRect(this._x, this._y, this._width, this._height);
    }
    update(ctx) {
        const innerHeight = ctx.canvas.height;
        const innerWidth = ctx.canvas.width;
        // console .log(this._keyState)
        if (this._keyState.has('ArrowRight')) {
            this._dx = 10;
        }
        else if (this._keyState.has('ArrowLeft')) {
            this._dx = -10;
        }
        if (this._keyState.has(' ')) {
            this._dy = -10;
        }
        if (this._x + this._width > innerWidth) {
            this._x = 0;
        }
        if (this._x < 0) {
            this._x = innerWidth - this._width;
        }
        if (this._y + this._height + 100 > innerHeight + 1) {
            //if we hit the bottom, set dy to 0 (not moving)
            this._dy = 0;
            this._y = innerHeight - this._height - 100;
        }
        if (this._y <= 0) {
            //if we hit the top just reverse
            // this._dy = 0
            this._y = innerHeight - this.height - 100;
        }
        // debugger
        this._dy += this._gravity;
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
    get gravity() {
        return this._gravity;
    }
    set gravity(value) {
        this._gravity = value;
    }
    get keyState() {
        return this._keyState;
    }
    addKeyState(value) {
        this._keyState.set(value, true);
    }
    removeKeyState(value) {
        this._keyState.delete(value);
    }
}
//# sourceMappingURL=Shape.js.map
export default class Shape {
    constructor(x, y, height, width, colour, dx, dy, gravity = 0.5, collisionBlocks = []) {
        this._x = x;
        this._y = y;
        this._height = height;
        this._width = width;
        this._colour = colour;
        this._dx = dx;
        this._dy = dy;
        this._gravity = gravity;
        this._keyState = new Map();
        this._collisionBlocks = collisionBlocks;
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
        // console .log(this._keyState)
        this._x += this._dx;
        this.handleInput();
        this.checkForHorizontalCollisions(ctx);
        this.applyGravity();
        this.checkForVerticalCollisions(ctx);
        this.draw(ctx);
    }
    checkForHorizontalCollisions(ctx) {
        const innerWidth = ctx.canvas.width;
        if (this._x < 0) {
            this._x = 0;
        }
        if (this._x + this._width > innerWidth) {
            this._x = innerWidth - this._width;
        }
        for (let i = 0; i < this._collisionBlocks.length; i++) {
            const collisionBlock = this._collisionBlocks[i];
            // if a collision exists
            if (this._x <= collisionBlock.x + collisionBlock.width &&
                this.x + this.width >= collisionBlock.x &&
                this.y + this.height >= collisionBlock.y &&
                this.y <= collisionBlock.y + collisionBlock.height) {
                // collision on x axis going to the left
                if (this.dx < -0) {
                    const offset = this.x - this.x;
                    this.x = collisionBlock.x + collisionBlock.width - offset + 0.01;
                    break;
                }
                if (this.dx > 0) {
                    const offset = this.x - this.x + this.width;
                    this.x = collisionBlock.x - offset - 0.01;
                    break;
                }
            }
        }
    }
    checkForVerticalCollisions(ctx) {
        const innerHeight = ctx.canvas.height;
        if (this._y < 0) {
            this._y = 0;
        }
        if (this._y + this._height > innerHeight) {
            this._y = innerHeight - this._height;
        }
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            // if a collision exists
            if (this.x <= collisionBlock.x + collisionBlock.width &&
                this.x + this.width >= collisionBlock.x &&
                this.y + this.height >= collisionBlock.y &&
                this.y <= collisionBlock.y + collisionBlock.height) {
                if (this.dy < 0) {
                    this.dy = 0;
                    const offset = this.y - this.y;
                    this.y = collisionBlock.y + collisionBlock.height - offset + 0.01;
                    break;
                }
                if (this.dy > 0) {
                    this.dy = 0;
                    const offset = this.y - this.y + this.height;
                    this.y = collisionBlock.y - offset - 0.01;
                    break;
                }
            }
        }
    }
    applyGravity() {
        this.dy += this.gravity;
        this.y += this.dy;
    }
    handleInput() {
        this.dx = 0;
        if (this._keyState.has("ArrowRight")) {
            this.dx = 5;
        }
        else if (this._keyState.has("ArrowLeft")) {
            this.dx = -5;
        }
        if (this._keyState.has(" ")) {
            this._dy = -10;
        }
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
    get collisionBlocks() {
        return this._collisionBlocks;
    }
    set collisionBlocks(value) {
        this._collisionBlocks = value;
    }
}
//# sourceMappingURL=Shape.js.map
export default class Sprite {
    constructor(x, y, height, width, dx, dy, img, gravity = 0.5) {
        this._spriteIndex = 0;
        this._lastRendered = 0;
        this._animationTick = 250;
        this._movingSpeed = 2;
        this._jumpingSpeed = 2;
        this._defaultState = "idle";
        this._x = x;
        this._y = y;
        this._height = height;
        this._width = width;
        this._dx = dx;
        this._dy = dy;
        this._images = img;
        this._keyState = new Map();
        this._gravity = gravity;
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
        if (this._keyState.has(" ")) {
            this._defaultState = "jumping";
        }
        else if (this._keyState.has("ArrowLeft")) {
            this._defaultState = "run";
        }
        else if (this._keyState.has("ArrowRight")) {
            this._defaultState = "run";
        }
        else {
            this._defaultState = "idle";
        }
        const img1 = this._images.get(this._defaultState);
        if (!img1)
            throw new Error("image not found");
        const { img, frames } = img1;
        let spriteHeight = img.height;
        let spriteWidth = img.width / frames;
        ctx.drawImage(img, spriteWidth * this._spriteIndex, 0, spriteWidth, spriteHeight, this._x, ctx.canvas.height - 100 - spriteHeight, spriteWidth, spriteHeight);
    }
    update(ctx) {
        var _a;
        if (Date.now() - this._lastRendered > this._animationTick) {
            this._lastRendered = Date.now();
            if (this._spriteIndex ===
                (((_a = this._images.get(this._defaultState)) === null || _a === void 0 ? void 0 : _a.frames) || 0) - 1) {
                this._spriteIndex = 0;
            }
            else {
                this._spriteIndex++;
            }
        }
        const innerHeight = ctx.canvas.height;
        const innerWidth = ctx.canvas.width;
        console.log({ controls: this._keyState });
        // console .log(this._keyState)
        if (this._keyState.has("ArrowRight")) {
            this._dx = this._movingSpeed;
        }
        else if (this._keyState.has("ArrowLeft")) {
            this._dx = -this._movingSpeed;
        }
        if (this.IsJumping) {
            this._dy = -this._jumpingSpeed;
        }
        if (this._x + this._width > innerWidth) {
            this._x = 0;
        }
        if (this._x < 0) {
            this._x = innerWidth - this._width;
        }
        if (this._y + this._height + 100 >= innerHeight) {
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
    get images() {
        return this._images;
    }
    set images(value) {
        this._images = value;
    }
    get IsJumping() {
        return !!this._keyState.get(" ");
    }
    set IsJumping(value) {
        if (value) {
            this._keyState.set(" ", true);
        }
        else {
            this._keyState.delete(" ");
        }
    }
}
//# sourceMappingURL=Sprite.js.map
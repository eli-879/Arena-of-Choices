export default class Character {
    // TODO: When a character gets kbed into another character, they seem to get stuck within each other - NEED FIX

    constructor(gameWidth, gameHeight, name, pos, ctx) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;

        // character visuals
        this.height = 40;
        this.width = 40;
        this.name = name;
        this.nameLength = ctx.measureText(this.name);

        // character movement
        this.speed = 75;
        this.velocity = {x:50, y:50};
        this.goal = {x:0, y:0};
        this.position = pos;
        this.knockbacked = false;
        this.time = 0;

        // character attributes
        this.maxHealth = 100;
        this.health = 100;
        this.dmg = 10;
    }

    draw(ctx) {
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillText(this.name, this.position.x - (this.nameLength.width / 2)  + 20, this.position.y + 60);
        this.drawHealth(ctx);
    }

    drawHealth(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y + this.height + 30, (this.health / this.maxHealth * this.width), 10);
    }

    update(dt) {
        if (!dt) return;        
    }

    getName() {
        return this.name;
    }

    getPosition() {
        return this.position;
    }

    setPosition(newX, newY) {
        this.position.x = newX;
        this.position.y = newY;
    }

    getVelocity() {
        return this.velocity;
    }

    setVX(vx) {
        this.velocity.x = vx;
    }

    multiplyVX(multiple) {
        this.velocity.x *= multiple;
    }

    setVY(vy) {
        this.velocity.y = vy;
    }

    multiplyVY(multiple) {
        this.velocity.y *= multiple;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    



}
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
        this.maxSpeed = 100;
        this.velocity = {x:50, y:50};
        this.goal = {x:0, y:0};
        this.position = pos;
        this.knockbacked = false;
        this.time = 0;
        this.attackTimer = 0;
        this.attackCD = 750;

        // character attributes
        this.maxHealth = 100;
        this.health = 20;
        this.dmg = 10;
    }

    // Drawing methods

    draw(ctx) {
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillText(this.name, this.position.x - (this.nameLength.width / 2)  + 20, this.position.y + 60);
        this.drawHealth(ctx);
        this.drawAttackCD(ctx);

        if (this.knockbacked) {
            ctx.fillText("KBed", this.position.x, this.position.y -10)
        }
    }

    drawHealth(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y + this.height + 30, (this.health / this.maxHealth * this.width), 10);
    }

    drawAttackCD(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y + this.height + 50, (this.attackTimer / this.attackCD * this.width), 10);
    }

    update(dt) {
        if (!dt) return;        
    }

    // Most getters and setters

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
    
    addPosition(dx, dy) {
        this.position.x += dx;
        this.position.y += dy;
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

    getGoal() {
        return this.goal;
    }

    isKBed() {
        return this.knockbacked;
    }

    setKBed(bool) {
        this.knockbacked = bool;
    }

    getTime() {
        return this.time;
    }

    addTime(dt) {
        this.time += dt;
    }

    setTime(dt) {
        this.time = dt;
    }

    minusHealth(dmg) {
        this.health -= dmg;
    }

    isDead() {
        if (this.health <= 0) {
            return true;
        }
        return false;
    }

    getAttackTimer() {
        return this.attackTimer;
    }

    setAttackTimer(time) {
        this.attackTimer = time;
    }

    cooldownAttackTimer(dt) {
        if (this.attackTimer > 0) {
            this.attackTimer -= dt;
        }
        else {
            this.attackTimer = 0;
        }
        
    }

    // Movement related methods

    keepInside() {
        if (this.position.x <= 1) {
            this.position.x = 5;
            this.velocity.x = 0;
        }

        if (this.position.x >= this.gameWidth - this.width - 1) {
            this.position.x =  this.gameWidth - this.width - 5;
            this.velocity.x = 0;
        }

        if (this.position.y <= 1) {
            this.position.y = 5;
            this.velocity.y = 0;
        }

        if (this.position.y >= this.gameHeight - this.height - 1) {
            this.position.y = this.gameHeight - this.height - 5;
            this.velocity.y = 0;
        }
    }



    getClosestEnemy(characterList) {
        let closest;
        let closestDist = 999999;
        for (var i = 0; i < characterList.length; i++) {
            var dist = this.getDist(characterList[i])
            if (dist < closestDist && dist != 0 && !characterList[i].isKBed()) {
                closestDist = dist;
                closest = characterList[i];
            }
        }
        
        return closest
    }

    setGoal(character) {
        if (character != null) {
            this.goal = character.getPosition();
        }
        else {
            this.goal = {x: this.gameWidth / 2 - this.width / 2,
                        y: this.gameHeight / 2- this.height / 2};
        }
    }

    getGoal() {
        return this.goal;
    }

    getDist(character) {
        let pos = character.getPosition();
        let part1 = Math.pow(this.position.x - pos.x, 2);
        let part2 = Math.pow(this.position.y - pos.y, 2);

        return Math.pow(part1 + part2, 0.5);
    }

    getUnitVector() {
        let part1 = this.goal.x - this.position.x
        let part2 = this.goal.y - this.position.y
        let magnitude = Math.pow(Math.pow(part1, 2) + Math.pow(part2, 2), 0.5);

        return {x: part1/magnitude,
                y: part2/magnitude};
    }

    updateVelocities() {
        let d1 = (this.goal.x - this.position.x);
        let d2 = (this.goal.y - this.position.y);

        // checking to see if distance to goal == 0
        if (d1 != 0 && d2 != 0) {
            // gets a unit vector to get speed of this object
            let unitVector = this.getUnitVector();

            // 75 pixels total movement per second
            this.velocity.x = unitVector.x * this.speed;
            this.velocity.y = unitVector.y * this.speed;
        }

    }

    hit(other, dt) {
       
        other.setTime(dt);
        
        var otherV = other.getVelocity();

        other.addPosition(Math.sign(otherV.x) * (-10), Math.sign(otherV.y) * (-10));
       
        // TODO - multiplication up to a limit
        if (other.isKBed()) {
            console.log("collateral!!!", other.getName(), other.getVelocity());
            other.setVX((otherV.x * -0.5));
            other.setVY((otherV.y * -0.5));
        }
        else {
            other.setVX((otherV.x * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1));
            other.setVY((otherV.y * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1));
        }

        other.setKBed(true);

        other.minusHealth(this.dmg);

        this.attackTimer = this.attackCD;
        
    }

}
export default class Character {
    // TODO: When a character gets kbed into another character, they seem to get stuck within each other - NEED FIX

    constructor(gameWidth, gameHeight, name, pos, image, id, ctx) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
<<<<<<< HEAD

        // character visual traits
        this.height = 40;
        this.width = 40;
        this.name = name;
        this.nameLength = ctx.measureText(this.name);

        this.speed = 5;
        this.vx = 1;
        this.vy = 1;

        this.goal = {x:0, y:0};

=======
        this.id = id;
        

        // character visuals
        this.height = 80;
        this.width = 80;
        this.name = name;
        this.nameLength = ctx.measureText(this.name);
        this.image = image;
        this.imageTimer = 0;
        this.imageTimerMax = 150;
        this.border = 0;
        this.spacing = 0;
        this.row = 2;
        this.col = 0;
        this.facing = "right";

        this.spriteDict = {running: [[0, 2], [3, 2]],
                            KBed: [[0, 3], [5, 3]],
                            attacking: [[7, 1], [10, 1]],
                            winning: [[4, 1], [7, 1]]
                        };

        // character movement
        this.speed = 75;
        this.maxSpeed = 100;
        this.velocity = {x:50, y:50};
        this.goal = {x:0, y:0};
>>>>>>> moving-collision-outside-of-character-object
        this.position = pos;
        this.knockbacked = false;
        this.running = true;
        this.attacking = false;
        this.winning = false;
        this.time = 0;
<<<<<<< HEAD

        // character combat attributes
        this.dmg = 10;
        this.critChance = 10;
        this.maxHealth = 100;
        this.health = 100;
=======
        this.attackTimer = 0;
        this.attackCD = 1100;
        this.timeforAttackAnimation = this.attackCD - ((this.spriteDict["attacking"][1][0] - this.spriteDict["attacking"][0][0]) * this.imageTimerMax) - 200;

        // character attributes
        this.maxHealth = 100;
        this.health = 100;
        this.dmg = 10;
>>>>>>> moving-collision-outside-of-character-object
    }

    // Drawing methods

    draw(ctx, dt) {
        this.imageTimer += dt;
        ctx.fillStyle = "#f00";
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillText(this.name, this.position.x - (this.nameLength.width / 2)  + 20, this.position.y + this.height + 20);
        this.drawHealth(ctx);
        this.drawAttackCD(ctx);

        if (this.knockbacked) {
            ctx.fillText("KBed", this.position.x, this.position.y - 10)
            this.drawSpriteKBed(ctx);
        }
        else if (this.running) {
            this.drawSpriteRunning(ctx);
        }
        else if (this.attacking) {
            this.drawSpriteAttacking(ctx);
        }
        else if (this.winning) {
            this.drawSpriteWinning(ctx);
        }

    }

    drawHealth(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y + this.height + 30, (this.health / this.maxHealth * this.width), 10);
    }

<<<<<<< HEAD
    hit(deltaTime, target) {
        if (!this.knockbacked) {
            this.knockbacked = true;
            this.time = deltaTime;
            this.position.x -= (this.vx * 10);
            this.position.y -= (this.vy * 10);
            this.vx = (this.vx * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1);
            this.vy = (this.vy * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1);
                
            this.health -= 10;
        }
        
=======
    drawAttackCD(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y + this.height + 50, (this.attackTimer / this.attackCD * this.width), 10);
>>>>>>> moving-collision-outside-of-character-object
    }

    drawSpriteRunning(ctx) {
        if (this.imageTimer > this.imageTimerMax) {
            
            this.col += 1;
            
            this.imageTimer = 0;
        }
        var sprite = this.getSpriteRunning("running");
        if (this.facing == "right") {
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height); 
        }
        else {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, - this.position.x - this.width, this.position.y, this.width, this.height); 
            ctx.scale(-1, 1);
        }
        
    }

    drawSpriteAttacking(ctx) {
        if (this.imageTimer > this.imageTimerMax) {
            this.col += 1
            this.imageTimer = 0;
        }

        var sprite = this.getSpriteKBed("attacking");
        if (this.facing == "right") {
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height); 
        }
        else {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, - this.position.x - this.width, this.position.y, this.width, this.height); 
            ctx.scale(-1, 1);
        }

<<<<<<< HEAD

    getPos() {
        return this.position;
=======
>>>>>>> moving-collision-outside-of-character-object
    }

    drawSpriteKBed(ctx) {
        if (this.imageTimer > this.imageTimerMax) {
            
            this.col += 1;
            
            this.imageTimer = 0;
        }
        
        var sprite = this.getSpriteKBed("KBed");
        if (this.facing == "right") {
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height); 
        }
        else {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, - this.position.x - this.width, this.position.y, this.width, this.height); 
            ctx.scale(-1, 1);
        }
    }

    drawSpriteWinning(ctx) {
        if (this.imageTimer > this.imageTimerMax) {
            
            this.col += 1;
            
            this.imageTimer = 0;
        }
        
        var sprite = this.getSpriteKBed("winning");
        if (this.facing == "right") {
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height); 
        }
        else {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, - this.position.x - this.width, this.position.y, this.width, this.height); 
            ctx.scale(-1, 1);
        }
    }

    spritePositionToImagePosition(row, col) {
        return {
            x: (
                this.border +
                col * (this.spacing + this.width)
            ),
            y: (
                this.border +
                row * (this.spacing + this.height)
            )
        }
    }

    getSpriteRunning(condition) {

        if (this.col == this.spriteDict[condition][1][0]) {
            this.col = this.spriteDict[condition][0][0];
            //this.row += 1
        }
        
        return this.spritePositionToImagePosition(this.row, this.col);
    }

    getSpriteKBed(condition) {

        if (this.col == this.spriteDict[condition][1][0]) {
            this.col = this.spriteDict[condition][1][0] - 1;
            //this.row += 1
        }

        return this.spritePositionToImagePosition(this.row, this.col);
    }

    getSpriteAttacking(condition) {

        if (this.col == this.spriteDict[condition][1][0]) {
            this.attacking = false;

            //this.row += 1
        }

        console.log(this.row, this.col);

        var spritePos = this.spritePositionToImagePosition(this.row, this.col);

        return spritePos;
    }

    getSpriteWinning(condition) {

        if (this.col == this.spriteDict[condition][1][0]) {
            this.col = this.spriteDict[condition][0][0];

        }

        console.log(this.row, this.col);

        var spritePos = this.spritePositionToImagePosition(this.row, this.col);

        return spritePos;
    }
    setSprite(condition) {
        this.col = this.spriteDict[condition][0][0];
        
        this.row = this.spriteDict[condition][0][1];
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

    setAttacking(bool) {
        this.attacking = bool;
    }

    getAttacking() {
        return this.attacking;
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

    getTimeForAttackAnimation() {
        return this.timeforAttackAnimation;
    }

    getRunning() {
        return this.running;
    }

    setRunning(bool) {
        this.running = bool;
    }

    getID() {
        return this.id;
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
            if (dist < closestDist && characterList[i].getID() != this.id && !characterList[i].isKBed()) {
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
            this.goal = {x: this.position.x,
                        y: this.position.y};
            this.velocity.x = 0;
            this.velocity.y = 0;
            //this.winning = true;
            //this.running = false;
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

        if (this.velocity.x < 0) {
            this.facing = "left";
        }
        else if (this.velocity.x > 0) {
            this.facing = "right";
        }

    }

    hit(other, dt) {
       
        other.setTime(dt);
        
<<<<<<< HEAD
            
            console.log("AHH ITS TOUCHING", this.name);
        }        
    
=======
        var otherV = other.getVelocity();

        other.addPosition(Math.sign(otherV.x) * (-10), Math.sign(otherV.y) * (-10));
       
        // TODO - multiplication up to a limit
        if (other.isKBed()) {
            other.setVX((otherV.x * -0.5));
            other.setVY((otherV.y * -0.5));
        }
        else {
            other.setVX((otherV.x * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1));
            other.setVY((otherV.y * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1));
        }

        other.setKBed(true);
        other.setRunning(false);

        this.setAttacking(true);
        this.setRunning(false);
        this.setSprite("attacking");

        other.minusHealth(this.dmg);
        other.setSprite("KBed");
        

        this.attackTimer = this.attackCD;
        
>>>>>>> moving-collision-outside-of-character-object
    }

}
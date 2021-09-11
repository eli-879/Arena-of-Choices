export default class Character {

    constructor(gameWidth, gameHeight, name, pos, ctx) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;

        // character visual traits
        this.height = 40;
        this.width = 40;
        this.name = name;
        this.nameLength = ctx.measureText(this.name);

        this.speed = 5;
        this.vx = 1;
        this.vy = 1;

        this.goal = {x:0, y:0};

        this.position = pos;
        this.knockbacked = false;
        this.time = 0;

        // character combat attributes
        this.dmg = 10;
        this.critChance = 10;
        this.maxHealth = 100;
        this.health = 100;
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
        
    }



    getPos() {
        return this.position;
    }

    getName() {
        return this.name;
    }

    getDist(character) {
        let pos = character.getPos();
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

    getClosestEnemy(characterList) {
        let closest;
        let closestDist = 999999;
        for (var i = 0; i < characterList.length; i++) {
            var dist = this.getDist(characterList[i])
            if (dist < closestDist && dist != 0) {
                closestDist = dist;
                closest = characterList[i];
            }
        }
        
        return closest
    }

    hit() {
        this.health -= 10;
    }

    getTime() {
        return this.time;
    }

    getVX() {
        return this.vx;
    }

    getVY() {
        return this.vy;
    }

    isDead() {
        if (this.health <= 0) {
            return true;
        }
        return false;
    }

    isKBed() {

        return this.knockbacked;
    }

    setKBed(bool) {
        this.time = 0;
        this.knockbacked = bool;
    }

    setGoal(character) {
        if (character != null) {
            this.goal = character.getPos();
        }
        else {
            this.goal = {x: this.gameWidth / 2 - this.width / 2,
                        y: this.gameHeight / 2- this.height / 2};
        }
    }

    setTime(dt) {
        this.time = dt;
    }

    setXPos(xp) {
        this.position.x = xp;
    }

    setYPos(yp) {
        this.position.y = yp;
    }

    setVX(vx) {
        this.vx = vx;
    }

    setVY(vy) {
        this.vy = vy;
    }

    isTouching(characterList) {
        for (var i = 0; i< characterList.length; i++) {
            let char = characterList[i];
            let pos = char.getPos();
            if (this.position.x < pos.x + this.width && this.position.x + this.width > pos.x && this.position.y + this.height > pos.y && this.position.y < pos.y + this.height && this.position.x != pos.x) {
                return true;
            }
        }
        return false;
    }

    getTouching(characterList) {
        for (var i = 0; i< characterList.length; i++) {
            let char = characterList[i];
            let pos = char.getPos();
            if (this.position.x < pos.x + this.width && this.position.x + this.width > pos.x && this.position.y + this.height > pos.y && this.position.y < pos.y + this.height && this.position.x != pos.x) {
                return char;
            }
        }
        return false;

    }

    keepInside() {
        if (this.position.x <= 1) {
            this.position.x = 5;
            this.vx = 0;
        }

        if (this.position.x >= this.gameWidth - this.width - 1) {
            this.position.x =  this.gameWidth - this.width - 5;
            this.vx = 0;
        }

        if (this.position.y <= 1) {
            this.position.y = 5;
            this.vy = 0;
        }

        if (this.position.y >= this.gameHeight - this.height - 1) {
            this.position.y = this.gameHeight - this.height - 5;
            this.vy = 0;
        }
    }

    bounce(characterList, dt) {
        this.keepInside();
        let touching = this.isTouching(characterList);

        if (!touching) {
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.position.x += this.vx;
            this.position.y += this.vy;
        }
        else {
            this.vx *= -1;
            this.vy *= -1;
            this.position.x += this.vx;
            this.position.y += this.vy;
        }
        

        this.time += dt;

    }

    move(characterList, deltaTime) {
        //keeps objects inside game play box
        this.keepInside();

        // gets the goal of this character by calculating closest enemy that is not itself
        this.setGoal(this.getClosestEnemy(characterList));
        
        let d1 = (this.goal.x - this.position.x);
        let d2 = (this.goal.y - this.position.y);

        // checking to see if distance to goal == 0
        if (d1 != 0 && d2 != 0) {
            // gets a unit vector to get speed of this object
            let unitVector = this.getUnitVector();

            this.vx = unitVector.x;
            this.vy = unitVector.y;
        }
        

        // checking if a box touches another box
        var touching = this.isTouching(characterList);

        // if not touching continue to move towards towards goal
        if (!touching) {
            
            if (this.position.x > 0 && this.position.x < this.gameWidth-this.width-1) {
                this.position.x += this.vx;
            }
            
    
            if (this.position.y > 0 && this.position.y < this.gameHeight-this.height-1) {
                this.position.y += this.vy ;
    
            }
            
        }
        else {
           
            this.knockbacked = true;
            this.time = deltaTime;
            this.position.x -= (this.vx * 10);
            this.position.y -= (this.vy * 10);

            this.vx = (this.vx * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1);
            this.vy = (this.vy * -7.5) + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1);
                

            this.health -= 10;
            
        
            
            console.log("AHH ITS TOUCHING", this.name);
        }        
    
    }


}
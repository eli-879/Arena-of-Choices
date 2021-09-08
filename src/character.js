export default class Character {

    constructor(gameWidth, gameHeight, name, pos, ctx) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.health = 100;
        this.height = 40;
        this.width = 40;
        this.name = name;
        this.nameLength = ctx.measureText(this.name);

        this.speed = 5;
        this.vx = 1;
        this.vy = 1;

        this.goal = 0;

        this.position = pos;
    }

    draw(ctx) {
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillText(this.name, this.position.x - (this.nameLength.width / 2)  + 20, this.position.y + 60);
        this.drawHealth(ctx);
    }

    drawHealth(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y + this.height + 30, (this.health / 100.0 * this.width), 10);
    }

    update(dt) {
        if (!dt) return;        
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

    getClosestEnemy(charactersList) {
        let closest;
        let closestDist = 999999;
        for (var i = 0; i < charactersList.length; i++) {
            var dist = this.getDist(charactersList[i])
            if (dist < closestDist && dist != 0) {
                closestDist = dist;
                closest = charactersList[i];
            }
        }
        
        return closest
    }

    isDead() {
        if (this.health <= 0) {
            return true;
        }
        return false;
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

    isTouching(charactersList) {
        for (var i = 0; i< charactersList.length; i++) {
            let pos = charactersList[i].getPos();
            if (this.position.x < pos.x + this.width && this.position.x + this.width > pos.x && this.position.y + this.height > pos.y && this.position.y < pos.y + this.height && this.position.x != pos.x) {
                return true;
            }
        }
        return false;
    }

    keepInside() {
        if (this.position.x <= 0) {
            this.position.x = 5;
        }

        if (this.position.x >= this.gameWidth - this.width) {
            this.position.x =  this.gameWidth - this.width - 5;
        }

        if (this.position.y <= 0) {
            this.position.y = 5;
        }

        if (this.position.y >= this.gameHeight - this.height) {
            this.position.y = this.gameHeight - this.height - 5;
        }
    }

    bounce() {
        this.position.x -= (this.vx * 500);
        this.position.y -= (this.vy * 500);

    }

    move(charactersList) {
        //keeps objects inside game play box
        this.keepInside();

        // gets the goal of this character by calculating closest enemy that is not itself
        this.setGoal(this.getClosestEnemy(charactersList));
        
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
        let touching = this.isTouching(charactersList);

        // if not touching continue to move towards towards goal
        if (!touching) {
            
            if (this.position.x > 0 && this.position.x < this.gameWidth-this.width-1) {
                this.position.x += this.vx;
            }
            
    
            if (this.position.y > 0 && this.position.y < this.gameHeight-this.height-1) {
                this.position.y += this.vy;
    
            }
            
        }
        else {
            this.bounce();
            this.health -= 10;
            console.log("AHH ITS TOUCHING", this.name);
        }


        
        
    
    }


}
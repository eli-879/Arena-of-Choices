export default class Character {

    constructor(gameWidth, gameHeight, name, pos, ctx) {
        this.height = 40;
        this.width = 40;
        this.name = name;
        this.nameLength = ctx.measureText(this.name);
        this.font = "16px serif";

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
    }

    update(dt) {
        if (!dt) return;        
    }

    getPos() {
        return this.position;
    }

    getDist(character) {
        let pos = character.getPos();
        let part1 = Math.pow(this.position.x - pos.x, 2);
        let part2 = Math.pow(this.position.y - pos.y, 2);

        return Math.pow(part1 + part2, 0.5);
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

    setGoal(character) {
        if (character != null) {
            this.goal = character.getPos();
        }
        else {
            console.log("YEEEEEEEEEEEEEEEEEEET");
        }
        
    }

    move(charactersList) {
        this.setGoal(this.getClosestEnemy(charactersList));
        
        let d1 = (this.goal.x - this.position.x);
        let d2 = (this.goal.y - this.position.y);

        // checking to see if distance to goal == 0
        if (d1 != 0 && d2 != 0) {
            this.vx = (d1) / Math.abs(d1);
            this.vy = (d2) / Math.abs(d2);
        }
        

        console.log(this.goal.x, this.position.x, this.goal.y, this.position.y, this.name);
        console.log(this.vx, this.vy);


        if (this.position.x > 0 && this.position.x < 920) {
            this.position.x += this.vx;
        }

        if (this.position.y > 0 && this.position.y < 680) {
            this.position.y += this.vy;

        }
        
    
    }


}
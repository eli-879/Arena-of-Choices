import Character from './character.js';

export default class Henry extends Character {
    constructor(gameWidth, gameHeight, name, pos, image, id, ctx) {
        super(gameWidth, gameHeight, name, pos, image, id, ctx);

        this.spriteSheetHenry = "Assets/henry.png";
        this.spriteSheetHenryAttacking = "Assets/henry_attack.png";
        this.spriteSheetHenryWinning = "Assets/henry2.png";

        this.image = new Image();
        this.image.src = this.spriteSheetHenry;
        this.image.crossOrigin = true;

        this.imageAttacking = new Image();
        this.imageAttacking.src = this.spriteSheetHenryAttacking
        this.imageAttacking.crossOrigin = true;

        this.imageWinning = new Image();
        this.imageWinning.src = this.spriteSheetHenryWinning;
        this.imageWinning.crossOrigin = true;

        this.spriteDict = {running: [[0, 2], [3, 2]],
                            knockedback: [[0, 3], [5, 3]],
                            attacking: [[0, 0], [4, 0]],
                            winning: [[0, 0], [4, 0]]
                        };

        this.timeforAttackAnimation = this.attackCD - ((this.spriteDict["attacking"][1][0] - this.spriteDict["attacking"][0][0]) * this.imageTimerMax) - 200;
               
    }



    drawSpriteAttacking(ctx) {
        var sprite = this.getSpriteOneLoop("attacking");
        if (this.facing == this.directions.RIGHT) {
            ctx.drawImage(this.imageAttacking, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height); 
        }
        else {
            ctx.scale(-1, 1);
            ctx.drawImage(this.imageAttacking, sprite.x, sprite.y, 80, 80, - this.position.x - this.width, this.position.y, this.width, this.height); 
            ctx.scale(-1, 1);
        }

    }

    drawSpriteWinning(ctx) {        
        var sprite = this.getSpriteConstantLoop("winning");
        if (this.facing == this.directions.RIGHT) {
            ctx.drawImage(this.imageWinning, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height); 
        }
        else {
            ctx.scale(-1, 1);
            ctx.drawImage(this.imageWinning, sprite.x, sprite.y, 80, 80, - this.position.x - this.width, this.position.y, this.width, this.height); 
            ctx.scale(-1, 1);
        }
    }
}
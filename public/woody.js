import Character from './character.js';

export default class Woody extends Character {
    constructor(gameWidth, gameHeight, name, pos, image, id, ctx) {
        super(gameWidth, gameHeight, name, pos, image, id, ctx);

        this.spriteSheetWoody = "Assets/woody.png";
        this.spriteSheetWoodyWinning = "Assets/woody2.png";

        this.image = new Image();
        this.image.src = this.spriteSheetWoody;
        this.image.crossOrigin = true;

        this.imageWinning = new Image();
        this.imageWinning.src = this.spriteSheetWoodyWinning;
        this.imageWinning.crossOrigin = true;

        this.spriteDict = {running: [[0, 2], [3, 2]],
                            knockedback: [[0, 3], [5, 3]],
                            attacking: [[0, 1], [3, 1]],
                            winning: [[1, 3], [10, 3]]
                        };

        this.timeforAttackAnimation = this.attackCD - ((this.spriteDict["attacking"][1][0] - this.spriteDict["attacking"][0][0]) * this.imageTimerMax) - 200;


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
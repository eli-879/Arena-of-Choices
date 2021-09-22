import Character from './character.js';

export default class Firzen extends Character {
    constructor(gameWidth, gameHeight, name, pos, image, id, ctx) {
        super(gameWidth, gameHeight, name, pos, image, id, ctx);

        this.spriteSheetFirzen = "Assets/firzen.png";
        this.spriteSheetFirzenWinning = "Assets/firzen1.png";

        this.image = new Image();
        this.image.src = this.spriteSheetFirzen;
        this.image.crossOrigin = true;

        this.imageWinning = new Image();
        this.imageWinning.src = this.spriteSheetFirzenWinning;
        this.imageWinning.crossOrigin = true;

        this.spriteDict = {running: [[0, 2], [3, 2]],
                            knockedback: [[0, 3], [5, 3]],
                            attacking: [[4, 1], [7, 1]],
                            winning: [[4, 0], [10, 0]]
                        };
        
        this.timeforAttackAnimation = this.attackCD - ((this.spriteDict["attacking"][1][0] - this.spriteDict["attacking"][0][0]) * this.imageTimerMax) - 200;

        

                        
    }

    drawSpriteWinning(ctx) {        
        var sprite = this.getSpriteConstantLoop("winning");
        console.log(sprite);
        console.log(this.status);
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
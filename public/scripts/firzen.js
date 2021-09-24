import Character from './character.js';

export default class Firzen extends Character {
    constructor(gameWidth, gameHeight, name, pos, image, id, assets, ctx) {
        super(gameWidth, gameHeight, name, pos, image, id, assets, ctx);

        this.image = this.assets[0];
        this.imageWinning = this.assets[1];

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
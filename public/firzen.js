import Character from './character.js';

export default class Firzen extends Character {
    constructor(gameWidth, gameHeight, name, pos, image, id, ctx) {
        super(gameWidth, gameHeight, name, pos, image, id, ctx);

        this.spriteSheetFirzen = "Assets/firzen.png";

        this.image = new Image();
        this.image.src = this.spriteSheetFirzen;
        this.image.crossOrigin = true;

        this.spriteDict = {running: [[0, 2], [3, 2]],
                            knockedback: [[0, 3], [5, 3]],
                            attacking: [[4, 1], [7, 1]],
                            winning: [[4, 1], [7, 1]]
                        };
        
        this.timeforAttackAnimation = this.attackCD - ((this.spriteDict["attacking"][1][0] - this.spriteDict["attacking"][0][0]) * this.imageTimerMax) - 200;

                        
    }
}
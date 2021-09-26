import Character from "./character.js";

export default class Firzen extends Character {
    constructor(gameWidth, gameHeight, name, pos, image, id, assets, ctx) {
        super(gameWidth, gameHeight, name, pos, image, id, assets, ctx);

        this.image = this.assets[0];
        this.imageWinning = this.assets[1];

        this.spriteDict = {
            running: [
                [0, 2],
                [3, 2],
            ],
            knockedback: [
                [0, 3],
                [5, 3],
            ],
            attacking: [
                [4, 1],
                [7, 1],
            ],
            winning: [
                [4, 0],
                [10, 0],
            ],
        };

        this.timeforAttackAnimation =
            (this.attackCD -
                (this.spriteDict["attacking"][1][0] -
                    this.spriteDict["attacking"][0][0]) *
                    this.imageTimerMax) *
            0.5;
        if (this.timeforAttackAnimation <= 0) {
            console.log("ERROR 0 for timeForAttackAnimation");
        }
    }
}

import Character from "./character.js";

export default class Woody extends Character {
	constructor(gameWidth, gameHeight, name, pos, image, id, assets, ctx) {
		super(gameWidth, gameHeight, name, pos, image, id, assets, ctx);

		this.image = this.assets[0];
		this.imageWinning = this.assets[1];

		// custom column/row coords from sprite sheet

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
				[0, 1],
				[3, 1],
			],
			winning: [
				[1, 3],
				[10, 3],
			],
		};

		// time needed for animation to attack
		// catches error if time is  < 0
		this.timeforAttackAnimation =
			(this.attackCD - (this.spriteDict["attacking"][1][0] - this.spriteDict["attacking"][0][0]) * this.imageTimerMax) * 0.5;
		if (this.timeforAttackAnimation <= 0) {
			console.log("ERROR 0 for timeForAttackAnimation");
		}
	}
}

import Character from "./character.js";

export default class Henry extends Character {
	constructor(gameWidth, gameHeight, name, pos, image, id, assets, ctx) {
		super(gameWidth, gameHeight, name, pos, image, id, assets, ctx);

		this.image = this.assets[0];
		this.imageAttacking = this.assets[1];
		this.imageWinning = this.assets[2];

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
				[0, 0],
				[4, 0],
			],
			winning: [
				[0, 0],
				[4, 0],
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

	// henry has slightly different attacking as his comes from a different sprite sheet than normal
	drawSpriteAttacking(ctx) {
		var sprite = this.getSpriteOneLoop("attacking");
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.imageAttacking, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.imageAttacking, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}
}

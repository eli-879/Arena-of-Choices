import Character from "./character.js";
//TODO: WORK IN PROGRESS
export default class Julian extends Character {
	constructor(gameWidth, gameHeight, name, pos, image, id, ctx) {
		super(gameWidth, gameHeight, name, pos, image, id, ctx);

		this.height = 100;

		this.spriteSheetJulian0 = "Assets/julian0.png";
		this.spriteSheetJulian1 = "Assets/julian1.png";

		this.image0 = new Image();
		this.image0.src = this.spriteSheetJulian0;
		this.image0.crossOrigin = true;

		this.image1 = new Image();
		this.image1.src = this.spriteSheetJulian1;
		this.image1.crossOrigin = true;

		this.spriteLocs = [
			{ name: "sprite200", x: 6, y: 10, width: 98, height: 82 },
			{ name: "sprite201", x: 132, y: 16, width: 74, height: 83 },
			{ name: "sprite202", x: 333, y: 21, width: 97, height: 78 },
			{ name: "sprite203", x: 220, y: 22, width: 105, height: 77 },
			{ name: "sprite204", x: 564, y: 27, width: 87, height: 52 },
			{ name: "sprite205", x: 454, y: 30, width: 92, height: 59 },
			{ name: "sprite206", x: 664, y: 62, width: 98, height: 36 },
			{ name: "sprite207", x: 17, y: 117, width: 82, height: 57 },
		];

		this.spriteDict = {
			running: [
				[6, 2],
				[9, 2],
			],
			knockedback: [[4], [7]],
			attacking: [[1], [4]],
			winning: [
				[4, 1],
				[7, 1],
			],
		};

		this.frameCounter = 0;
	}

	draw(ctx, dt) {
		this.imageTimer += dt;
		ctx.fillStyle = "#f00";
		ctx.fillText(this.name, this.position.x - this.nameLength.width / 2 + 20, this.position.y + this.height + 20);
		this.drawHealth(ctx);
		this.drawAttackCD(ctx);

		switch (this.status) {
			case this.states.RUNNING:
				this.drawSpriteRunning(ctx);
				break;
			case this.states.KNOCKBACKED:
				ctx.fillText("KBed", this.position.x, this.position.y - 10);
				this.drawSpriteKBed(ctx);
				break;
			case this.states.ATTACKING:
				this.drawSpriteAttacking(ctx);
				break;
			case this.states.WINNING:
				break;
		}

		if (this.imageTimer > this.imageTimerMax) {
			if (this.status == this.states.RUNNING || this.status == this.states.WINNING) {
				this.col += 1;
				this.imageTimer = 0;
			} else {
				this.frameCounter += 1;
				this.imageTimer = 0;
			}
		}
	}

	drawSpriteAttacking(ctx) {
		let sprite = this.getSpriteOneLoop("attacking");
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image1, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.image1, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	drawSpriteRunning(ctx) {
		let sprite = this.getSpriteConstantLoop("running");
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image0, sprite.x, sprite.y, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(
				this.image0,
				sprite.x,
				sprite.y,
				this.width,
				this.height,
				-this.position.x - this.width,
				this.position.y,
				this.width,
				this.height
			);
			ctx.scale(-1, 1);
		}
	}

	drawSpriteKBed(ctx) {
		let sprite = this.getSpriteOneLoop("knockedback");
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image1, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.image1, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	drawSpriteWinning(ctx) {
		let sprite = this.getSpriteKBed("winning");
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image0, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.image0, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	async loadFile(url) {
		try {
			const response = await fetch(url);
			const data = await response.text();
		} catch (err) {
			console.error(err);
		}

		return data;
	}
}

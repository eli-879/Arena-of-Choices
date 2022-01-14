export default class Character {
	constructor(gameWidth, gameHeight, name, pos, id, assets, ctx) {
		this.gameHeight = gameHeight;
		this.gameWidth = gameWidth;
		this.id = id;

		// character visuals
		this.height = 80;
		this.width = 80;
		this.name = name;
		this.nameLength = ctx.measureText(this.name);
		this.image;
		this.imageWinning;
		this.imageTimer = 0;
		this.imageTimerMax = 125;
		this.border = 0;
		this.spacing = 0;
		this.row = 2;
		this.col = 0;

		this.assets = assets;

		this.directions = {
			RIGHT: "right",
			LEFT: "left",
		};
		this.facing = this.directions.RIGHT;

		this.spriteDict;

		// character movement
		this.speed = 75;
		this.maxSpeed = 100;
		this.velocity = { x: 50, y: 50 };
		this.goal = { x: 0, y: 0 };
		this.position = pos;

		this.states = {
			RUNNING: "running",
			KNOCKBACKED: "knockedback",
			ATTACKING: "attacking",
			WINNING: "winning",
			DEAD: "dead",
		};

		this.status = this.states.RUNNING;

		this.time = 0;
		this.attackTimer = 0;
		this.attackCD = 900;

		// character attributes
		this.maxHealth = 100;
		this.health = 100;
		this.dmg = 10;
	}

	// Drawing methods

	draw(ctx, dt) {
		this.imageTimer += dt;
		ctx.fillStyle = "#f00";
		// draws name
		ctx.fillText(this.name, this.position.x - this.nameLength.width / 2 + 40, this.position.y + this.height + 20);

		// if they are not dead, draw health and attack cooldown timer
		if (this.status != this.states.DEAD) {
			this.drawHealth(ctx);
			this.drawAttackCD(ctx);
		}

		// decides what to draw depending on state of character
		switch (this.status) {
			case this.states.RUNNING:
				this.drawSpriteRunning(ctx);
				break;
			case this.states.KNOCKBACKED:
				this.drawSpriteKBed(ctx);
				break;
			case this.states.ATTACKING:
				this.drawSpriteAttacking(ctx);
				break;
			case this.states.WINNING:
				this.drawSpriteWinning(ctx);
				break;
			case this.states.DEAD:
				this.drawSpriteDead(ctx);
		}

		// handles sprite images, depending on time length per sprite frame
		// if timer for frame is up, move to next frame in animation
		if (this.imageTimer > this.imageTimerMax) {
			this.col += 1;
			this.imageTimer = 0;
		}
	}

	// draw health
	drawHealth(ctx) {
		ctx.fillStyle = "lime";
		ctx.font = "20px Arial";
		ctx.fillRect(this.position.x, this.position.y + this.height + 35, (this.health / this.maxHealth) * this.width, 10);
		ctx.fillText(this.health + " HP", this.position.x, this.position.y + this.height + 35);
	}

	// draw attack cooldown
	drawAttackCD(ctx) {
		ctx.fillStyle = "blue";
		ctx.fillRect(this.position.x, this.position.y + this.height + 50, (this.attackTimer / this.attackCD) * this.width, 10);
	}

	// draw running
	drawSpriteRunning(ctx) {
		// sprite is constant loop over sprite animation
		let sprite = this.getSpriteConstantLoop("running");

		// draw reverse depending on velocity on x axis
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	// draw attacking
	drawSpriteAttacking(ctx) {
		// sprite is only one loop - stops on last frame of animation
		let sprite = this.getSpriteOneLoop("attacking");

		// draw reverse depending on velocity on x axis
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	// draws if character is KBed
	drawSpriteKBed(ctx) {
		// sprite is only one loop - stops on last frame of animation
		let sprite = this.getSpriteOneLoop("knockedback");
		ctx.fillText("KBed", this.position.x + this.width / 2 - ctx.measureText("KBed").width / 2, this.position.y - 10);

		// draw reverse depending on velocity on x axis
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	// draws if character has won
	drawSpriteWinning(ctx) {
		// runs on constant loop, draws WINNER text
		let sprite = this.getSpriteConstantLoop("winning");
		ctx.fillStyle = "fuchsia";
		ctx.fillText("WINNER", this.position.x + this.width / 2 - ctx.measureText("WINNER").width / 2, this.position.y - 10);

		// draw reverse depending on velocity on x axis
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.imageWinning, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.imageWinning, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	// draws character lying prone on ground
	drawSpriteDead(ctx) {
		let sprite = this.getSpriteOneLoop("knockedback");
		if (this.facing == this.directions.RIGHT) {
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, this.position.x, this.position.y, this.width, this.height);
		} else {
			ctx.scale(-1, 1);
			ctx.drawImage(this.image, sprite.x, sprite.y, 80, 80, -this.position.x - this.width, this.position.y, this.width, this.height);
			ctx.scale(-1, 1);
		}
	}

	// each sprite frame is 80x80 so turns col/row into x/y coords
	spritePositionToImagePosition(col, row) {
		return {
			x: this.border + col * (this.spacing + this.width),
			y: this.border + row * (this.spacing + this.height),
		};
	}

	// constant loop - if column gets to end of sprite sheet, reset back to beginning
	getSpriteConstantLoop(condition) {
		if (this.col == this.spriteDict[condition][1][0]) {
			this.col = this.spriteDict[condition][0][0];
		}

		return this.spritePositionToImagePosition(this.col, this.row);
	}

	// one loop - if column gets to end, stay on the last frame
	getSpriteOneLoop(condition) {
		if (this.col == this.spriteDict[condition][1][0]) {
			this.col = this.spriteDict[condition][1][0] - 1;
		}

		return this.spritePositionToImagePosition(this.col, this.row);
	}

	// set sprite frame - called when character changes state so animation can change
	setSprite(condition) {
		this.col = this.spriteDict[condition][0][0];
		this.row = this.spriteDict[condition][0][1];
	}

	// Most getters and setters

	getName() {
		return this.name;
	}

	getPosition() {
		return this.position;
	}

	setPosition(newX, newY) {
		this.position.x = newX;
		this.position.y = newY;
	}

	addPosition(dx, dy) {
		this.position.x += dx;
		this.position.y += dy;
	}

	getVelocity() {
		return this.velocity;
	}

	setVX(vx) {
		this.velocity.x = vx;
	}

	multiplyVX(multiple) {
		this.velocity.x *= multiple;
	}

	setVY(vy) {
		this.velocity.y = vy;
	}

	multiplyVY(multiple) {
		this.velocity.y *= multiple;
	}

	getHeight() {
		return this.height;
	}

	getWidth() {
		return this.width;
	}

	getGoal() {
		return this.goal;
	}

	getTimeKnockedback() {
		return this.time;
	}

	addTimeKnockedback(dt) {
		this.time += dt;
	}

	setTimeKnockedback(dt) {
		this.time = dt;
	}

	minusHealth(dmg) {
		this.health -= dmg;
	}

	isDead() {
		if (this.health <= 0) {
			return true;
		}
		return false;
	}

	getAttackTimer() {
		return this.attackTimer;
	}

	setAttackTimer(time) {
		this.attackTimer = time;
	}

	cooldownAttackTimer(dt) {
		if (this.attackTimer - dt < 0) {
			this.attackTimer = 0;
		} else {
			this.attackTimer -= dt;
		}
	}

	getTimeForAttackAnimation() {
		return this.timeforAttackAnimation;
	}

	getID() {
		return this.id;
	}

	getFacing() {
		return this.facing;
	}

	setFacing(dir) {
		this.facing = dir;
	}

	setStatus(status) {
		this.status = status;
	}

	getStatus() {
		return this.status;
	}

	getDmg() {
		return this.dmg;
	}

	// Movement related methods

	// keeps character inside field
	keepInside() {
		if (this.position.x <= 1) {
			this.position.x = 5;
			this.velocity.x = 0;
		}

		if (this.position.x >= this.gameWidth - this.width - 1) {
			this.position.x = this.gameWidth - this.width - 5;
			this.velocity.x = 0;
		}

		if (this.position.y <= 80) {
			this.position.y = 81;
			this.velocity.y = 0;
		}

		if (this.position.y >= this.gameHeight - this.height - 1) {
			this.position.y = this.gameHeight - this.height - 5;
			this.velocity.y = 0;
		}
	}

	// finds closest enemy and returns it
	getClosestEnemy(characterList) {
		let closest;
		let closestDist = 999999;
		for (let i = 0; i < characterList.length; i++) {
			let dist = this.getDist(characterList[i]);
			if (dist < closestDist && characterList[i].getID() != this.id && characterList[i].getStatus() != this.states.KNOCKBACKED) {
				closestDist = dist;
				closest = characterList[i];
			}
		}
		return closest;
	}

	// sets goal to closest enemy - if the goal is null,stop moving as character has won
	setGoal(character) {
		if (character != null) {
			this.goal = character.getPosition();
		} else {
			this.goal = { x: this.position.x, y: this.position.y };
			this.velocity.x = 0;
			this.velocity.y = 0;
		}
	}

	//some get functions relating to movement

	getGoal() {
		return this.goal;
	}

	// gets dist from character
	getDist(character) {
		let pos = character.getPosition();
		let part1 = Math.pow(this.position.x - pos.x, 2);
		let part2 = Math.pow(this.position.y - pos.y, 2);

		return Math.pow(part1 + part2, 0.5);
	}

	// turns distance into a unit vector
	getUnitVector() {
		let part1 = this.goal.x - this.position.x;
		let part2 = this.goal.y - this.position.y;
		let magnitude = Math.pow(Math.pow(part1, 2) + Math.pow(part2, 2), 0.5);

		return { x: part1 / magnitude, y: part2 / magnitude };
	}

	// update movement of character based on goal
	updateVelocities() {
		let d1 = this.goal.x - this.position.x;
		let d2 = this.goal.y - this.position.y;

		// checking to see if distance to goal == 0
		if (d1 != 0 && d2 != 0) {
			// gets a unit vector to get speed of this object
			let unitVector = this.getUnitVector();

			// 75 pixels total movement per second
			this.velocity.x = unitVector.x * this.speed;
			this.velocity.y = unitVector.y * this.speed;
		}
	}

	// changes this.facing letiable based on velocity of x
	updateDirection() {
		if (this.velocity.x < 0) {
			this.facing = "left";
		} else if (this.velocity.x > 0) {
			this.facing = "right";
		}
	}

	// hits the other player passed in
	// changes other velocity
	// sets this character attack on cooldown
	// TODO: maybe random damage instead of 10?
	hit(other, dt) {
		if (this.status == this.states.ATTACKING) {
		} else {
			other.setTimeKnockedback(dt);

			let otherV = other.getVelocity();

			other.addPosition(Math.sign(otherV.x) * -10, Math.sign(otherV.y) * -10);

			other.setVX(otherV.x * -7.5 + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1));
			other.setVY(otherV.y * -7.5 + (Math.floor(Math.random() * 5) * Math.random() < 0.5 ? -1 : 1));

			this.attackTimer = this.attackCD;
		}
	}
}

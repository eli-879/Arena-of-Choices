import Woody from "./woody.js";
import Firzen from "./firzen.js";
import Henry from "./henry.js";
import Justin from "./justin.js";
import Collision from "./collision.js";
import DamageSplat from "./damagesplat.js";
import UI from "./UI.js";

class Game {
	constructor() {
		this.MIN_STEP = 10;
		this.SPRITE_HEIGHT = 80;
		this.players = 0;

		this.lastTime = 0;

		// states of each character
		this.states = {
			RUNNING: "running",
			KNOCKEDBACK: "knockedback",
			ATTACKING: "attacking",
			WINNING: "winning",
			DEAD: "dead",
		};

		this.assets = {};

		// clamping frames so they are not too long or short
		this.typicalFrame = 16;
		this.smallestFrame = 14;
		this.longestFrame = 50;

		// arrays to store info
		this.names = [];
		this.characterList = [];

		// store all char at beginning
		this.beginning = [];

		// arrays to store names and actual objects of dead chars
		this.deathListNames = [];
		this.deathListObjects = [];

		// array for damage splats
		this.damageSplats = [];

		// height and width of canvas
		this.GAME_WIDTH = 960;
		this.GAME_HEIGHT = 720;

		// DOM elements that are needed
		this.DOMElements = {
			deathlist: document.getElementById("deathlist"),
			canvas: document.getElementById("gameScreen"),
			ctx: document.getElementById("gameScreen").getContext("2d"),
		};
	}

	// load all assets into assets variable
	initAssets() {
		let woodyImage = new Image();
		woodyImage.src = "Assets/woody.png";

		let woodyImageWinning = new Image();
		woodyImageWinning.src = "Assets/woody2.png";

		this.assets.woodyAssets = [woodyImage, woodyImageWinning];

		let firzenImage = new Image();
		firzenImage.src = "Assets/firzen.png";

		let firzenImageWinning = new Image();
		firzenImageWinning.src = "Assets/firzen1.png";

		this.assets.firzenAssets = [firzenImage, firzenImageWinning];

		let henryImage = new Image();
		henryImage.src = "Assets/henry.png";

		let henryImageAttacking = new Image();
		henryImageAttacking.src = "Assets/henryAttacking.png";

		let henryImageWinning = new Image();
		henryImageWinning.src = "Assets/henry2.png";

		this.assets.henryAssets = [henryImage, henryImageAttacking, henryImageWinning];

		let justinImage = new Image();
		justinImage.src = "Assets/justin0.png";

		let justinImageAttacking = new Image();
		justinImageAttacking.src = "Assets/justin1.png";

		this.assets.justinAssets = [justinImage, justinImageAttacking];

		let bg = new Image();
		bg.src = "Assets/bg1.png";
		this.assets.bg = bg;

		let damageSplatRed = new Image();
		let damageSplatBlue = new Image();

		damageSplatRed.src = "Assets/dmgsplat_red.png";
		damageSplatBlue.src = "Assets/dmgsplat_blue.png";

		this.assets.damageSplats = [damageSplatRed, damageSplatBlue];
	}

	initStartButton() {
		const boundHandleStartButtonPress = this.handleStartButtonPress.bind(this);
		document.getElementById("start").addEventListener("click", boundHandleStartButtonPress);
	}

	initCanvas() {
		this.DOMElements.canvas.height = 720;
		this.DOMElements.canvas.width = 960;

		this.DOMElements.ctx.font = "16px Arial";

		this.DOMElements.ctx.clearRect(0, 0, this.DOMElements.canvas.width, this.DOMElements.canvas.height);
	}

	handleStartButtonPress() {
		// gets all names entered in textbox, one name per each line, gets rid of lines with nothing in them
		let names = document.getElementById("entries").value.split("\n");
		for (let i = names.length - 1; i > -1; i--) {
			if (names[i].trim() == "") {
				names.splice(i, 1);
			}
		}

		// max names of 24 so screen doesn't get too overcrowded
		if (names.length > 24) {
			names = [];
		}

		this.resetGame();
		this.names = names;
		this.beginning.push(names);
		this.players = names.length;

		// generates character location
		for (let i = 0; i < names.length; i++) {
			let pos = this.getNewCharacterPosition();
			let rand = Math.floor(Math.random() * 4);

			// generates a random character out of 4
			// TODO: add more characters

			let character = this.createNewCharacter(rand, pos, i);

			if (character != -1) this.characterList.push(character);
		}
	}

	createNewCharacter(rand, pos, characterNum) {
		if (rand == 0)
			return new Henry(
				this.GAME_WIDTH,
				this.GAME_HEIGHT,
				this.names[characterNum],
				pos,
				characterNum,
				this.assets.henryAssets,
				this.DOMElements.ctx
			);
		else if (rand == 1)
			return new Firzen(
				this.GAME_WIDTH,
				this.GAME_HEIGHT,
				this.names[characterNum],
				pos,
				characterNum,
				this.assets.firzenAssets,
				this.DOMElements.ctx
			);
		else if (rand == 2)
			return new Woody(
				this.GAME_WIDTH,
				this.GAME_HEIGHT,
				this.names[characterNum],
				pos,
				characterNum,
				this.assets.woodyAssets,
				this.DOMElements.ctx
			);
		else if (rand == 3)
			return new Justin(
				this.GAME_WIDTH,
				this.GAME_HEIGHT,
				this.names[characterNum],
				pos,
				characterNum,
				this.assets.justinAssets,
				this.DOMElements.ctx
			);

		return -1;
	}

	getNewCharacterPosition() {
		let xp = this.getRandomTile(6) * this.SPRITE_HEIGHT * 2 + this.SPRITE_HEIGHT;
		let yp = this.getRandomTile(3) * this.SPRITE_HEIGHT * 2 + this.SPRITE_HEIGHT;

		while (this.checkXYOverlap(xp, yp, this.characterList)) {
			xp = this.getRandomTile(6) * this.SPRITE_HEIGHT * 2 + this.SPRITE_HEIGHT;
			yp = this.getRandomTile(4) * this.SPRITE_HEIGHT * 2 + this.SPRITE_HEIGHT;
		}

		return { x: xp, y: yp };
	}

	resetGame() {
		this.beginning = [];
		this.deathListNames = [];
		this.deathListObjects = [];
		this.characterList = [];
		this.damageSplats = [];
	}

	// gameloop that controls the game
	gameLoop(timestamp) {
		let deltaTime = timestamp - this.lastTime;
		if (deltaTime > this.longestFrame) deltaTime = this.typicalFrame;

		this.lastTime = timestamp;

		this.DOMElements.ctx.clearRect(0, 0, this.DOMElements.canvas.width, this.DOMElements.canvas.height);

		// controls all calculations of each character
		this.updateGame(deltaTime);

		// Finds if game has ended and sends data to server as a JSON
		if (this.deathListNames.length === this.players - 1) {
			this.deathListNames.push(this.characterList[0].getName());

			const data = { deathListNames: this.deathListNames, beginning: this.beginning };

			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			};

			fetch("/api", options)
				.then((response) => response.json())
				.then((json) => {
					console.log(json);
				});

			this.players = -999;
		}
		const boundGameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(boundGameLoop);
	}

	// handles all calculations of characters by time
	updateGame(dt) {
		let step = dt;
		do {
			this.resolveAllCollisions(step);
			// drawing portion
			this.drawAllElements(step);

			dt -= step;
			step = dt;
		} while (dt > 0);
	}

	resolveAllCollisions(step) {
		// first finds if there is at least one collision between characters
		let hit = this.findFirstCollision(step);

		// if there is at least one collision, find all collisions by turning them into collision objects, handle them, and move each character
		if (hit != null) {
			step = Math.max(hit.getTime(), this.MIN_STEP);
			this.updateObjects(step);
			this.handleCollisions(step);
			// else just move each character
		} else {
			this.updateObjects(step);
		}
	}

	drawAllElements(step) {
		// draw bg
		this.DOMElements.ctx.drawImage(this.assets.bg, 0, 0);

		// draw dead characters as lying prone on the ground
		for (let i = 0; i < this.deathListObjects.length; i++) {
			this.deathListObjects[i].draw(this.DOMElements.ctx, step);
		}

		//draw alive characters either as KBed or running or winning
		for (let i = 0; i < this.characterList.length; i++) {
			this.characterList[i].draw(this.DOMElements.ctx, step);
		}

		// draw damage splats
		for (let i = 0; i < this.damageSplats.length; i++) {
			this.damageSplats[i].draw(this.DOMElements.ctx);

			this.damageSplats[i].updateTime(step);
			if (this.damageSplats[i].getTime() > 2000) {
				this.damageSplats.splice(i, 1);
				i--;
			}
		}

		// finds if there is only 1 character left alive and makes him celebrate
		if (this.characterList.length == 1) {
			if (this.characterList[0].getStatus() != this.states.WINNING) {
				this.characterList[0].setSprite(this.states.WINNING);
			}
			this.characterList[0].setStatus(this.states.WINNING);
		}
	}

	updateDeathDOM() {
		// updates list of dead characters based on characters that are in the deathListNames array
		this.DOMElements.deathlist.innerHTML = "";
		for (let i = 0; i < this.deathListNames.length; i++) {
			this.DOMElements.deathlist.innerHTML = this.DOMElements.deathlist.innerHTML + (i + 1) + ". " + this.deathListNames[i] + "<br />";
		}
	}

	// function that handles moving the characters around and recognising when they are dead
	updateObjects(step) {
		for (let i = 0; i < this.characterList.length; i++) {
			let character = this.characterList[i];
			let pos = character.getPosition();
			let v = character.getVelocity();

			// keeps characters within a boundary
			character.keepInside();

			// if character has a cooldown on their attack, reduce it by time passed
			character.cooldownAttackTimer(step);

			// if character is dead, push him into dead list and remove him from alive list
			if (character.isDead()) {
				this.deathListNames.push(character.getName());
				this.updateDeathDOM();

				character.setStatus(this.states.DEAD);
				this.deathListObjects.push(character);

				this.characterList.splice(i, 1);
				i--;
				continue;
			}

			// handles if character is KBed by another - pushes them back in the opposite direction they were running in
			if (character.getStatus() == this.states.KNOCKEDBACK) {
				character.setVX(v.x * 0.95);
				character.setVY(v.y * 0.95);
				character.setPosition(pos.x + (step * v.x) / 1000, pos.y + (step * v.y) / 1000);
				character.addTimeKnockedback(step);

				// if they reach the time limit on being KBed, reset them back to running state
				if (character.getTimeKnockedback() > 1000) {
					character.setStatus(this.states.RUNNING);
					character.setSprite(this.states.RUNNING);
					character.setTimeKnockedback(0);
				}

				// otherwise if they are not KBed, set a goal destination to the nearest enemy where they will run to
			} else {
				character.setGoal(character.getClosestEnemy(this.characterList));
				character.updateVelocities();

				character.setPosition(pos.x + (step * v.x) / 1000, pos.y + (step * v.y) / 1000);
			}

			// if a character has completed an attack animation, reset them back to running state.
			if (character.getAttackTimer() < character.getTimeForAttackAnimation() && character.getStatus() == this.states.ATTACKING) {
				character.setSprite(this.states.RUNNING);
				character.setStatus(this.states.RUNNING);
			}

			// if character is running, update the direction they face (left if negative movement, right if positive movement)
			if (character.getStatus() == this.states.RUNNING) {
				character.updateDirection();
			}
		}
	}

	// handles each collision - is passed a collision and decides who gets hit and who is the one hitting
	// returns dmg number and character that gets hit
	updateVelocities(collision, step) {
		let obj1 = collision.getObj1();
		let obj2 = collision.getObj2();

		let rand = Math.floor(Math.random() * 15);

		// make sure that in the collision object, the two colliding objects are not null
		if (obj1 != null && obj2 != null) {
			//if they are not nulls, check their attack cooldown timers

			//if obj1 is ready to attack but obj2 isn't, obj2 will definitely getting hit
			if (obj1.getAttackTimer() == 0 && obj2.getAttackTimer() != 0) {
				if (obj1.getStatus() != this.states.KNOCKEDBACK && obj2.getStatus() != this.states.KNOCKEDBACK) {
					obj1.hit(obj2, step);
					this.updateStatus(obj1, obj2);
					this.updateHealth(obj1, obj2, rand);
					return [obj2, rand];
				}
				//vice versa
			} else if (obj1.getAttackTimer() != 0 && obj2.getAttackTimer() == 0) {
				if (obj1.getStatus() != this.states.KNOCKEDBACK && obj2.getStatus() != this.states.KNOCKEDBACK) {
					obj2.hit(obj1, step);
					this.updateStatus(obj2, obj1);
					this.updateHealth(obj2, obj1, rand);
					return [obj1, rand];
				}

				// if both characters have their attack ready, it will be a 50/50 on who gets hit
			} else if (obj1.getAttackTimer() == 0 && obj2.getAttackTimer() == 0) {
				let coinflip = Math.floor(Math.random() * 2);

				if (coinflip == 0) {
					if (obj1.getStatus() != this.states.KNOCKEDBACK && obj2.getStatus() != this.states.KNOCKEDBACK) {
						obj1.hit(obj2, step);
						this.updateStatus(obj1, obj2);
						this.updateHealth(obj1, obj2, rand);
						return [obj2, rand];
					}
				} else {
					if (obj1.getStatus() != this.states.KNOCKEDBACK && obj2.getStatus() != this.states.KNOCKEDBACK) {
						obj2.hit(obj1, step);
						this.updateStatus(obj2, obj1);
						this.updateHealth(obj2, obj1, rand);
						return [obj1, rand];
					}
				}
			}
		}
	}

	// function that handles all collisions
	handleCollisions(step) {
		// finds all collisions, set up unique collisions and charactersSeen as an collision between Char1 and Char2 is also a collision between Char2 and Char1
		// we don't want that to register as two seperate collisions
		let allCollisions = this.findAllCollisions(step);
		let uniqueCollisions = [];
		let charactersSeen = [];

		// look at each individual collision
		for (let i = 0; i < allCollisions.length; i++) {
			let obj1 = allCollisions[i].getObj1();
			let obj2 = allCollisions[i].getObj2();

			// if they are both not in the characterSeen array, push their unique ID and their collision in
			if (!charactersSeen.includes(obj1.getID()) && !charactersSeen.includes(obj2.getID())) {
				charactersSeen.push(obj1.getID());
				charactersSeen.push(obj2.getID());
				uniqueCollisions.push(allCollisions[i]);
			}
		}

		// using all unique collisions, handle each unique collision using the function above
		for (let collision of uniqueCollisions) {
			// info contains who was hit and the damage
			let info = this.updateVelocities(collision, step);
			if (info != undefined) {
				this.createDamageSplats(info[0].getPosition(), info[1]);
			}
		}
	}

	// finds all collisions by comparing each character to see if their hitboxes overlap and returns a array of all collisions
	findAllCollisions(dt) {
		let collisions = [];
		for (let i = 0; i < this.characterList.length; i++) {
			for (let j = i + 1; j < this.characterList.length; j++) {
				let hit = this.findCollision(i, j, dt);
				if (hit != null) {
					collisions.push(hit);
				}
			}
		}
		return collisions;
	}

	// function that finds 1 collision to see if we need to run findAllCollisions func
	findFirstCollision(dt) {
		for (let i = 0; i < this.characterList.length; i++) {
			for (let j = i + 1; j < this.characterList.length; j++) {
				let hit = this.findCollision(i, j, dt);
				if (hit != null) {
					return hit;
				}
			}
		}
	}

	// checks to see if there is a collision between characters at index i and j by checking overlaps of hitboxes
	// if there is, create a Collision object and return it to findAllCollisions func
	findCollision(i, j, dt) {
		let obj1 = this.characterList[i];
		let obj2 = this.characterList[j];
		let obj1Pos = obj1.getPosition();
		let obj2Pos = obj2.getPosition();
		if (
			obj1Pos.x <= obj2Pos.x + obj2.getWidth() &&
			obj1Pos.x + obj1.getWidth() >= obj2Pos.x &&
			obj1Pos.y + obj1.getHeight() >= obj2Pos.y &&
			obj1Pos.y <= obj2Pos.y + obj2.getHeight()
		) {
			let dir = 0;
			let col = new Collision(obj1, obj2, dir, dt);
			return col;
		}
		return null;
	}

	// creates damage splat object and appends it to the damage splat list
	createDamageSplats(location, number) {
		let damageSplat = new DamageSplat(location, number, this.assets.damageSplats);
		this.damageSplats.push(damageSplat);
	}

	// updates statuses between two characters hitting each other - one hits, one gets KBed
	updateStatus(obj1, obj2) {
		// obj1 is the hitter, obj2 is the hittee(is that a word?)
		obj1.setStatus(this.states.ATTACKING);
		obj1.setSprite(this.states.ATTACKING);

		obj2.setStatus(this.states.KNOCKEDBACK);
		obj2.setSprite(this.states.KNOCKEDBACK);
	}

	// updates health after a collision
	updateHealth(obj1, obj2, dmg) {
		// obj1 is the hitter, obj2 is the hittee
		//let dmg = obj1.getDmg();
		obj2.minusHealth(dmg);
	}

	// function used when generating characters at the beginning to make sure when they spawn they
	// do not overlap - keeps generating random coords until no overlaps are found
	checkXYOverlap(xpos, ypos, characterList) {
		for (const character of characterList) {
			if (character.getPosition().x == xpos && character.getPosition().y == ypos) {
				return true;
			}
		}
		return false;
	}

	// gets a random 80x80 tile
	getRandomTile(max_tiles) {
		// tile size of 80x80 - 9 up, 12 across
		return Math.floor(Math.random() * max_tiles);
	}
}

const UIManager = new UI();
UIManager.initArrow();
UIManager.initResizeableNav();
UIManager.initInfoTabs();
//UIManager.initResizablePageLayout();
//d

const game = new Game();
game.initAssets();
game.initStartButton();
game.initCanvas();
game.gameLoop(0);

export default class DamageSplat {
	constructor(pos, number, assets) {
		this.pos = pos;
		this.number = number;
		this.assets = assets;
		this.time = 0;
		this.width = 40;
		this.height = 40;
	}

	updateTime(step) {
		this.time += step;
	}

	getTime() {
		return this.time;
	}

	// draws damage splat
	draw(ctx) {
		// draws blue splat if damage is 0 and red otherwise
		if (this.number == 0) {
			ctx.drawImage(this.assets[1], this.pos.x, this.pos.y);
		} else {
			ctx.drawImage(this.assets[0], this.pos.x, this.pos.y);
		}
		ctx.fillStyle = "white";
		ctx.fillText("" + this.number, this.pos.x + this.width / 2 - ctx.measureText("" + this.number).width / 2, this.pos.y + this.height / 2 + 5);
	}
}

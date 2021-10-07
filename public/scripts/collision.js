export default class Collision {
	// collision class that is used to handle collisions
	constructor(obj1, obj2, dir, time) {
		this.objectIndex1 = obj1;
		this.objectIndex2 = obj2;
		this.direction = dir;
		this.time = time;
	}

	getObj1() {
		return this.objectIndex1;
	}

	getObj2() {
		return this.objectIndex2;
	}

	getTime() {
		return this.time;
	}
}

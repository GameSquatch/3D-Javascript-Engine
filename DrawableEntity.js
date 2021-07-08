
class DrawableEntity {
	constructor() {
		this.pos = new Vec3D(0, 0, 0);
		this.vertices = [];
		this.faces = [];
	}

	update() {
		throw new Error("Must implement update method for DrawableEntity inheritance.");
	}

	render() {
		throw new Error("Must implement render method for DrawableEntity inheritance.");
	}

	drawFace() {
		throw new Error("Must implement drawFace method for DrawableEntity inheritance");
	}
}
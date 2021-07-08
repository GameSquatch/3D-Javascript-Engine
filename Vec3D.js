
class Vec3D {
	constructor(x, y, z) {
		this.x = x;
   	this.y = y;
   	this.z = z;
	}

	mult(vec) {
		this.x = this.x * vec.x;
		this.y = this.y * vec.y;
		this.z = this.z * vec.z;

		return this;
	}

	sub(vec) {
		this.x = this.x - vec.x;
		this.y = this.y - vec.y;
		this.z = this.z - vec.z;

		return this;
	}

	add(vec) {
		this.x = this.x + vec.x;
		this.y = this.y + vec.y;
		this.z = this.z + vec.z;

		return this;
	}

	scale(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	cross(vec) {
		let nx = ((this.y * vec.z) - (this.z * vec.y));
		let ny = ((this.z * vec.x) - (this.x * vec.z));
		let nz = ((this.x * vec.y) - (this.y * vec.x));
		this.x = nx;
		this.y = ny;
		this.z = nz;

		return this;
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}

	normalize() {
		let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
	}

	static distance(vec1, vec2) {
		let diff = new Vec3D(0, 0, 0).add(vec2).sub(vec1);

		return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
	}

	static fromVec(vec) {
		return new Vec3D(vec.x, vec.y, vec.z);
	}

	static diff(vec1, vec2) {
		return new Vec3D(vec1.x - vec2.x, vec1.y - vec2.y, vec1.z - vec2.z);
	}
	 
}
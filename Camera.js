
class Camera {
	constructor(posVec, rotationVec, { W }) {
		this.pos = posVec;
		this.rotation = rotationVec;
		this.windowWidth = W;
	}

	projectVec(vec3D) {
		let A = Math.cos(this.rotation.x);// theta
		let B = Math.cos(this.rotation.y);// gamma
		let C = Math.cos(this.rotation.z);// delta

		let D = Math.sin(this.rotation.x);// theta
		let E = Math.sin(this.rotation.y);// gamma
		let F = Math.sin(this.rotation.z);// delta

		let dx = B * (F * (vec3D.y - this.pos.y) + C *  (vec3D.x - this.pos.x)) - E * (vec3D.z - this.pos.z);
		let dy = D * (B * (vec3D.z - this.pos.z) + E * (F * (vec3D.y - this.pos.y) + C * (vec3D.x - this.pos.x))) + A * (C * (vec3D.y - this.pos.y) - F * (vec3D.x - this.pos.x));
		let dz = A * (B * (vec3D.z - this.pos.z) + E * (F * (vec3D.y - this.pos.y) + C * (vec3D.x - this.pos.x))) - D * (C * (vec3D.y - this.pos.y) - F * (vec3D.x - this.pos.x));

		const x = -1 * ((100 / dz) * dx * this.windowWidth / 100);
		const y = (100 / dz) * dy * this.windowWidth / 100;

		return { x, y };
	}
}
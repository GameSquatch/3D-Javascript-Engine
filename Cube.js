

class Cube extends DrawableEntity {
	constructor(posVec, width) {
		super();
		this.pos = posVec;

		// Not spreading because it will be read-only anyways
		this.vertices = [
			new Vec3D(-1, 1, 1).scale(width).add(posVec),//top left
			new Vec3D(1, 1, 1).scale(width).add(posVec),// top right
			new Vec3D(1, -1, 1).scale(width).add(posVec),// bottom right
			new Vec3D(-1, -1, 1).scale(width).add(posVec),// bottom left
			new Vec3D(-1, 1, -1).scale(width).add(posVec),
			new Vec3D(1, 1, -1).scale(width).add(posVec),
			new Vec3D(1, -1, -1).scale(width).add(posVec),
			new Vec3D(-1, -1, -1).scale(width).add(posVec)
		];

		this.faces = [
			new Face([
				this.vertices[0],
				this.vertices[1],
				this.vertices[2],
				this.vertices[3]
			]), 
			new Face([
				this.vertices[1],
				this.vertices[5],
				this.vertices[6],
				this.vertices[2]
			]),
			new Face([
				this.vertices[5],
				this.vertices[4],
				this.vertices[7],
				this.vertices[6]
			]),
			new Face([
				this.vertices[4],
				this.vertices[0],
				this.vertices[3],
				this.vertices[7]
			]),
			new Face([
				this.vertices[4],
				this.vertices[5],
				this.vertices[1],
				this.vertices[0]
			]),
			new Face([
				this.vertices[7],
				this.vertices[6],
				this.vertices[2],
				this.vertices[3]
			])
		];
		
	}

	update(context, camera) {
		// if you want to animate the cube, mutate the verteces within the faces here

		this.faces.sort((faceA, faceB) => {
			const distA = Vec3D.distance(faceA.center, camera.pos);
			const distB = Vec3D.distance(faceB.center, camera.pos);
			return distA < distB ? 1 : -1;
		});
		this.render(context, camera);
	}

	render(context, camera) {
		this.faces.forEach((face) => {
			this.drawFace(face, context, camera);
		});
	}

	drawFace(face, context, camera) {
		let xy = camera.projectVec(face.getVertex(0));

		context.beginPath();
		context.moveTo(xy.x, xy.y);

		for (let i = 1; i < face.vertices.length; i += 1) {
			xy = camera.projectVec(face.getVertex(i));
			context.lineTo(xy.x, xy.y);
		}

		context.closePath();
		context.fillStyle = `rgba(${face.randR}, ${face.randG}, ${face.randB}, 0.82)`;
		context.fill();
		context.strokeStyle = 'black';
		context.stroke();
	}
}
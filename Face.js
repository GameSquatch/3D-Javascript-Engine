
class Face {
	constructor(vertices) {
		this.vertices = vertices;
		this.normal = this.calcNormalVec();
		this.center = this.calcFaceCenter();

		this.randR = parseInt(Math.random() * 141) + 115;
		this.randG = parseInt(Math.random() * 141) + 115;
		this.randB = parseInt(Math.random() * 141) + 115;
	}

	calcNormalVec() {
		let e1 = new Vec3D(0, 0, 0).add(this.vertices[1]).sub(this.vertices[2]); // difference of vertex 1 and 2
		let e2 = this.vertices[2];//.sub(this.vertices[3]); // difference of vertex 2 and 3
		// let e3 = vertsInFace[2].sub(vertsInFace[3]);
		// let e4 = vertsInFace[3].sub(vertsInFace[0]);

		// reassign e1 to the cross product normal of the edges and return it
		e1 = e1.cross(e2);
		e1.normalize();
		return e1;
	}

	calcFaceCenter() {
		let center = new Vec3D(0, 0, 0);

		this.vertices.forEach((vertex) => {
			center = center.add(vertex);
		});

		// Basically like an average position between face vertices
		center.scale(1 / this.vertices.length);
  
		return center;
  }

  getVertex(i) {
	  if (i >= this.vertices.length || i < 0) {
		  throw new Error("Access out of bounds vertex for face.");
	  }

	  return this.vertices[i];
  }
}
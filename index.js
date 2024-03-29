
(function(window) {
	const can = document.querySelector("#canvas");
	const c = can.getContext("2d");
	const W = window.innerWidth;
	const H = window.innerHeight;
	can.width = W;
	can.height = H;
	let frames = 0;
	const spinSpeed = 0.0006;
	let spinAmt = 0;
	
	const domFPS = document.getElementById("fps");
	let prevTime = null;
	let frameTime = null;

	// here is where I create the 'camera' object. The parameters are: Camera(x, y, z, theta, gamma, delta)
	// x, y, and z are the 3d position coordinates, and theta, gamma, and delta are the angles relative to the
	// x, y, and z axes. theta is the angle relative to the x axis, gamma -> y, and delta -> z
	// If we input an angle into gamma, the camera would spin around the y-axis, so it would turn the camera
	// left or right
	const cam = new Camera(new Vec3D(0, 6, 10), new Vec3D(6, 0, 0), { W });

	// these are the variables to move the camera around in a circle. Frames is incremented every frame and
	// 0.002 is just making the change more gradual. If we just did sin(frames), the number jumps by 1 each frame.
	// In radians, 1 is a big jump, so I just used an arbitrary constant 0.002. Because sin and cos return a value
	// from -1 to 1, I multiplied it by 7 so now we get -7 to 7. You can make x use cosine and z use sine, but
	// they HAVE to use each; they can't be the same, and this is how you get circular movement.
	let x = Math.sin(frames * spinSpeed) * 14;
	let z;
	// z = Math.cos(frames * spinSpeed) * 14;
	// set the camera to these values
	// cam.pos.x = x;
	// cam.pos.z = z;

	// light = new Vec3d(12, 9, 6);
	// lightPower = 1;

	//mesh = new Mesh(24); // MESH GOES LAST
	const cube = new Cube(new Vec3D(0, 0, 0), 2);

	const cube2 = new Cube(new Vec3D(4, 0, 0), 1);

	// light is just a position
	
	// make center of the canvas the origin
	c.translate(W / 2, H / 2);

	draw();


	function draw(timestamp = null) {
		requestAnimationFrame(draw);
		// increment frame count and calc fps
		frames++;
		fps = calcFPS(timestamp);
		
		// only update fps span content every 8 frames
		if (!(frames % 8)) {
			 domFPS.textContent = fps;
		}

		if (frameTime === null) {
			return;
		}
  
		// clear the canvas each frame before drawing on it using white
		c.clearRect(-W / 2, -H / 2, W, H);
  
		// every frame I need to update the camera in its circular path around the cube and set it.
		// y = (Math.sin(frames * spinSpeed) + 1) / 2 * 4 + 1;
		x = Math.sin(spinAmt) * 20;
		z = Math.cos(spinAmt) * 20;
		cam.pos.x = x;
		cam.pos.z = z;
		// cam.pos.y = y;
		
		// This is a bit of magic at the moment, and there is a better way to do it, but this actually rotates
		// the camera itself. The gamma angle is incremented by an arbitrary (not so arbitrary as you'll find out)
		// every frame and then set to itself devided by Math.PI * 2. If You were to comment out these lines, you
		// would find that the camera still goes around the cube, but at some point, you won't be able to see the
		// cube anymore. This is because the camera will always point in one direction unless we change it. Here,
		// I used the same number that I used to update the camera position. This makes it so that the camera,
		// while moving around the cube, also points at the cube as well.
		cam.rotation.y = spinAmt;//gamma
		cam.rotation.y %= Math.PI * 2;
		// cam.theta += 0.001;
		// cam.theta %= Math.PI * 2;
		// cam.delta += 0.003;
		// cam.delta %= Math.PI * 2;
  
		// light.x = Math.sin(frames * spinSpeed * 3) * 5;
		// light.z = Math.sin(frames * spinSpeed) * 20;
		const dist1 = Vec3D.distance(cube.pos, cam.pos);
		const dist2 = Vec3D.distance(cube2.pos, cam.pos);
		if (dist1 > dist2) {
			cube.update(c, cam);
			cube2.update(c, cam);
		} else {
			cube2.update(c, cam);
			cube.update(c, cam);
		}
		
		spinAmt += frameTime * spinSpeed;
  }


	function calcFPS(timestamp) {
		if (timestamp === null) {
			prevTime = timestamp;
			return -1;
		}
		frameTime = timestamp - prevTime;
		prevTime = timestamp;

		return Math.round(1000 / frameTime);
	}
})(window);
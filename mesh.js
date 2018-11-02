var can, c, W, H;//global vars go here

let mesh;
let light, lightPower;

// let alpha = 1;
// let colors = [`rgba(0, 255, 0, ${alpha})`, `rgba(255, 255, 0, ${alpha})`, `rgba(255, 0, 0, ${alpha})`, `rgba(0, 255, 0, ${alpha})`, `rgba(255, 180, 180, ${alpha})`, `rgba(130, 130, 130, ${alpha})`];

// variable for the camera object. I was intimidated by the variable name, "camera" at first.
// Really it is just a point in 3d space that we use to do some math to the object we are viewing
// on the screen. More is explained later :)
let cam;
let spinSpeed = 0.006;

// in this code I am moving the 'camera' in a circle, so these are the vars to keep track of its position
// NOTE* for this simulation (and most 3d projections) the "floor" refers to the x and z axes, and y is up and down.
// ...more on this later too
let x, y, z;

// variables to calculate frames per second and display it
let fps, prevTime, domFPS;
let frames = 0;

window.onload = function() {
    init();
    draw();
}
/*
Okay, bear with me for these explanations. I
did my best just to understand them myself,
and I am no expert, but I do understand much
more than I did when I started trying to figure
out how 3d graphics worked. I was inspired to
even attempt this from the codes of Dylan Missuwe,
so thank you for that! Okay, on we go to the good
parts :) Happy Coding!
*/

function init() {
    can = document.getElementById("can");
    c = can.getContext("2d");
    W = window.innerWidth;
    H = window.innerHeight;
    can.width = W;
    can.height = H;
    
    domFPS = document.getElementById("fps");
    prevTime = Date.now();

    // here is where I create the 'camera' object. The parameters are: Camera(x, y, z, theta, gamma, delta)
    // x, y, and z are the 3d position coordinates, and theta, gamma, and delta are the angles relative to the
    // x, y, and z axes. theta is the angle relative to the x axis, gamma -> y, and delta -> z
    // If we input an angle into gamma, the camera would spin around the y-axis, so it would turn the camera
    // left or right
    cam = new Camera(0, 10, 20, -0.40, 0, 0);

    // these are the variables to move the camera around in a circle. Frames is incremented every frame and
    // 0.002 is just making the change more gradual. If we just did sin(frames), the number jumps by 1 each frame.
    // In radians, 1 is a big jump, so I just used an arbitrary constant 0.002. Because sin and cos return a value
    // from -1 to 1, I multiplied it by 7 so now we get -7 to 7. You can make x use cosine and z use sine, but
    // they HAVE to use each; they can't be the same, and this is how you get circular movement.
    x = Math.sin(frames * spinSpeed) * 14;
    // z = Math.cos(frames * spinSpeed) * 14;
    // set the camera to these values
    // cam.pos.x = x;
    // cam.pos.z = z;

    light = new Vec3d(12, 9, 6);
    lightPower = 1;

    mesh = new Mesh(24); // MESH GOES LAST

    // light is just a position
    

    // make center of the canvas the origin
    c.translate(W / 2, H / 2);
}

// the drawing function
function draw() {
    requestAnimationFrame(draw);

    // clear the canvas each frame before drawing on it using white
    c.clearRect(-W / 2, -H / 2, W, H);

    // every frame I need to update the camera in its circular path around the cube and set it.
    // y = (Math.sin(frames * spinSpeed) + 1) / 2 * 4 + 1;
    x = Math.sin(frames * spinSpeed) * 20;
    z = Math.cos(frames * spinSpeed) * 20;
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
    cam.gamma += spinSpeed;
    cam.gamma %= Math.PI * 2;
    // cam.theta += 0.001;
    // cam.theta %= Math.PI * 2;
    // cam.delta += 0.003;
    // cam.delta %= Math.PI * 2;

    // light.x = Math.sin(frames * spinSpeed * 3) * 5;
    // light.z = Math.sin(frames * spinSpeed) * 20;

    mesh.update();
    
    // increment frame count and calc fps
    frames++;
    fps = calcFPS();
    
    // only update fps span content every 8 frames
    if (!(frames % 8)) {
        domFPS.textContent = fps;
    }
}

// a face contains the vertices and can return the i'th vertex in the vertex(i) function
// count just returns the number of vertices, for for loops and stuff
function Face(vertices) {
    this.verts = vertices;
    // console.log(this.verts);
    this.normal = calcNormal(this.verts); // Vec3d
    // console.log(this.normal);
    this.center = calcFaceCenter(this.verts); // Vec3d
    this.distFromCam = Vec3d.distance(this.center, cam.pos);
    this.color = new Vec3d(255, 120, 120);
    
    this.vertex = function(i) {
        // if i is valid, return vertex i
        if (i >= 0 && i < this.verts.length) {
            return this.verts[i];
        }
        else {
            throw new Error("Attempted to get out of bounds in vertices");
        }
    };
}

// camera class just holds its position and angle data
function Camera(x, y, z, theta, gamma, delta) {

  this.pos = new Vec3d(x, y, z);

  this.theta = theta;
  this.gamma = gamma;
  this.delta = delta;
}

function calcdxyz(vertex) {

    let A = Math.cos(cam.theta);
    let B = Math.cos(cam.gamma);
    let C = Math.cos(cam.delta);

    let D = Math.sin(cam.theta);
    let E = Math.sin(cam.gamma);
    let F = Math.sin(cam.delta);

    let dx = B * (F * (vertex.y - cam.pos.y) + C *  (vertex.x - cam.pos.x)) - E * (vertex.z - cam.pos.z);
    let dy = D * (B * (vertex.z - cam.pos.z) + E * (F * (vertex.y - cam.pos.y) + C * (vertex.x - cam.pos.x))) + A * (C * (vertex.y - cam.pos.y) - F * (vertex.x - cam.pos.x));
    let dz = A * (B * (vertex.z - cam.pos.z) + E * (F * (vertex.y - cam.pos.y) + C * (vertex.x - cam.pos.x))) - D * (C * (vertex.y - cam.pos.y) - F * (vertex.x - cam.pos.x));

    let x = -1 * ((100 / dz) * dx * W / 100);
    let y = (100 / dz) * dy * W / 100;

    return [x, y];
}

function drawFaces(c, face) {
    // xy is the two-element-array returned from calcdxyz. Here it is for the first vertex. We do this to use
    // the contexts moveTo function for each face, so we start over every time we draw a new face
    let xy = calcdxyz(face.vertex(0));

    // new Vec3d(255, 120, 120); // 
    // console.log(face.normal);
    let color = shader(face.normal, face.color);

    c.beginPath();
    c.fillStyle = `rgba(${Math.round(color.x)}, ${Math.round(color.y)}, ${Math.round(color.z)}, 1)`;
    c.moveTo(xy[0], xy[1]);// use xy[0] to get x and xy[1] for y

    // for every vertex in the passed in face
    for (let i = 1; i < face.verts.length; ++i) {
        // set xy to the calculated x and y screen points for that vertex
        xy = calcdxyz(face.vertex(i));
        // draw a line to those screen positions
        c.lineTo(xy[0], xy[1]);
    }

    c.closePath();
    
    c.fill();
    
}

function Mesh(sz) {
    let size = sz;
    let ratio = 10 / sz;
    
    this.vertices = [];
    for (let i = 0; i < size; ++i) {
        for (let j = 0; j < size; ++j) {
            let vert = new Vec3d((j * ratio) - ((ratio * size) / 2), Math.sin(j * 0.6) + Math.cos(i * 0.6), (i * ratio) - ((ratio * size) / 2));
            this.vertices.push(vert);
        }
    }

    this.faces = [];
    for (let i = 0; i < size - 1; ++i) {
        for (let j = 0; j < size - 1; ++j) {
            this.faces.push(new Face([this.vertices[j + (i * size)], this.vertices[j + (i * size) + 1], this.vertices[j + ((i + 1) * size) + 1], this.vertices[j + ((i + 1) * size)]]));
        }
    }

    this.render = function() {
        for (let i = 0; i < this.faces.length; ++i) {
            drawFaces(c, this.faces[i]);
        }
    }
    this.calcFaceCenters = function() {
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].normal = calcNormal(this.faces[i].verts);
            this.faces[i].center = calcFaceCenter(this.faces[i].verts);
            this.faces[i].distFromCam = Vec3d.distance(this.faces[i].center, cam.pos);
        }
    }
    this.sortFaceDrawOrders = function() {
        this.faces.sort((a, b) => {
            return a.distFromCam < b.distFromCam ? 1 : -1;
        });
    }
    this.update = function() {
        for (let i = 0; i < this.faces.length; ++i) {
            for (let j = 0; j < this.faces[i].verts.length; ++j) {
                this.faces[i].verts[j].y = Math.sin(frames * 0.01 + this.faces[i].verts[j].x) + Math.cos(frames * 0.01 + this.faces[i].verts[j].z);
            }
        }
        this.calcFaceCenters();
        this.sortFaceDrawOrders();
        this.render();
    }
}

function Vec3d(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.mult = function(vec) {
        let nx = this.x * vec.x;
        let ny = this.y * vec.y;
        let nz = this.z * vec.z;

        return new Vec3d(nx, ny, nz);
    }

    this.sub = function(vec) {
        let nx = this.x - vec.x;
        let ny = this.y - vec.y;
        let nz = this.z - vec.z;

        return new Vec3d(nx, ny, nz);
    }

    this.add = function(vec) {
        let nx = this.x + vec.x;
        let ny = this.y + vec.y;
        let nz = this.z + vec.z;

        return new Vec3d(nx, ny, nz);
    }

    this.scale = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }

    this.cross = function(vec) {
        let newX = ((this.y * vec.z) - (this.z * vec.y));
        let newY = ((this.z * vec.x) - (this.x * vec.z));
        let newZ = ((this.x * vec.y) - (this.y * vec.x));

        return new Vec3d(newX, newY, newZ);
    }

    this.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    this.normalize = function() {
        let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
    }

     Vec3d.distance = function(vec1, vec2) {
        let diff = vec2.sub(vec1);

        return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
    }
}

function calcNormal(vertsInFace) {
    let e1 = vertsInFace[1].sub(vertsInFace[2]); // difference of vertex 1 and 2
    let e2 = vertsInFace[2].sub(vertsInFace[3]); // difference of vertex 2 and 3
    // let e3 = vertsInFace[2].sub(vertsInFace[3]);
    // let e4 = vertsInFace[3].sub(vertsInFace[0]);

    // reassign e1 to the cross product normal of the edges and return it

    e1 = e1.cross(e2);
    e1.normalize();

    return e1;
}

function calcFaceCenter(verts) {
    let center = new Vec3d(0, 0, 0);
    for (let i = 0; i < verts.length; ++i) {
        center = center.add(verts[i]);
    }
    center.scale(1 / verts.length);

    return center;
}
// calculate fps function
function calcFPS() {
    let diff = Date.now() - prevTime;
    
    prevTime = Date.now();
    
    return Math.round(1000 / diff);
}

function shader(norm, faceColor) {

    let a = new Vec3d(0.1, 0.1, 0.1);// for ambience
    let ambient = faceColor.mult(a);
    // console.log(ambient);

    // from fragment to the light, negative
    let l = norm.sub(light);
    l.normalize();
    // l.scale(-1);

    // from fragment to camera (eye)
    let eye = cam.pos.sub(norm);
    eye.normalize();
    eye.scale(-1);
    let r = reflect(eye, norm); // vec3d
    // console.log(l);
    let distance = Vec3d.distance(light, norm);
    // console.log(distance);
    
    let cosTheta = norm.dot(l);
    cosTheta = cosTheta < 0 ? 0 : cosTheta;
    cosTheta = cosTheta > 1 ? 1 : cosTheta;

    let cosAlpha = eye.dot(r);
    cosAlpha = cosAlpha < 0 ? 0 : cosAlpha > 0.8 ? 0.8 : cosAlpha; // clamp 0 to 0.5
    // console.log(cosTheta);

    let color = new Vec3d(255, 255, 255); // color of the light (& specular color for this one)

    let shade = cosTheta * lightPower * (1 / (distance * distance));
    let spec = lightPower * Math.pow(cosAlpha, 7) * (1 / (distance * distance));
    
    // console.log(cosTheta, shade);
    color.scale(shade + spec);
    // color.scale(spec);
    // console.log(color);
    
    color = color.mult(faceColor);
    // console.log(color);

    color = color.add(ambient);
    clampColor(color);
    // console.log(color);

    return color;
}

function clampColor(colorVec) {
    colorVec.x = colorVec.x > 255 ? 255 : colorVec.x;
    colorVec.x = colorVec.x < 0 ? 0 : colorVec.x;

    colorVec.y = colorVec.y > 255 ? 255 : colorVec.y;
    colorVec.y = colorVec.y < 0 ? 0 : colorVec.y;

    colorVec.z = colorVec.z > 255 ? 255 : colorVec.z;
    colorVec.z = colorVec.z < 0 ? 0 : colorVec.z;
}

function reflect(l, n) {
    let spec = new Vec3d(1, 1, 1);

    spec.x = 2 * l.dot(n) * n.x - l.x;
    spec.y = 2 * l.dot(n) * n.y - l.y;
    spec.z = 2 * l.dot(n) * n.y - l.y;

    return spec;
}

// Current texture applied to cube.
let texs = [];
let tex;

function preload(){
	for (let i = 0; i < 16; i++){
	 texs[i] = loadImage("https://redhendev.github.io/hilbertGallery/images/hil" + 
					int(i+1) + ".png");
	}
}

function setup(){
    
   createCanvas(window.innerWidth,
				window.innerWidth,
			   WEBGL);
	
	newTex();
	
	strokeWeight(6);
}

function newTex(){
	tex = texs[int(random(0,15))]
}

function mousePressed(){
	newTex();
}

function draw(){
	background(101,
			  0,
			  101);
	
	speed = map(mouseX, 0, width,
			   0.01, 12);
	speedY = map(mouseY, 0, height,
			   0.01, 12);
	
	translate(0,-height/7);
	rotateY(speed);
	rotateX(speedY);
	texture(tex);
	box(height/3.2);	
	
	if (frameCount % 200 === 0)
		newTex();
}

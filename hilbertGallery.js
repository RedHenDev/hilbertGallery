// Current texture applied to cube.
let tex;

function setup(){
    
   createCanvas(window.innerWidth,
				window.innerWidth,
			   WEBGL);
	
	newTex();
	
	strokeWeight(5);
}

function newTex(){
	tex = loadImage("https://github.io/RedHenDev/hilbertGallery/images/hil" + 
					 int(random(1,16)) + ".png");
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
	
	translate(0,-width/7);
	rotateY(speed);
	rotateX(speedY);
	texture(tex);
	box(width/3.2);	
	
	if (frameCount % 200 === 0)
		newTex();
}

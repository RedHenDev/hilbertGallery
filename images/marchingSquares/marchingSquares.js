//new Q5("global");

let autoMove = true;

let nodes = [];
let squares = [];

let step;

let rows = 64;
let columns = 64;

let linesOn = true;

let g = Math.random()*255;

let xOff = 0;

function setup(){
    createCanvas(window.innerWidth,
								 window.innerHeight);
    
    paintBackground();
	
	//strokeWeight(2);
	
	march();
}

function paintBackground(){
	background(0,72,0);
}

function march(){
	nodes = [];
	squares = [];
	
	scatterNodes();
	//renderNodes();
	gatherSquares(rows,columns);
	renderSquares();
}

function mouseMoved(){
  if (!autoMove)
	scrollMarch();
}

function scrollMarch(){
  xOff+=1*step;
	paintBackground();
	march();
}

function draw(){
  if (autoMove){
    scrollMarch();
  }
}

function renderSquares(){
	for (let i = 0; i < squares.length; i++){
		//squares[i].crudeRender();
		squares[i].render();
	}
}

// Create array of squares, each with
// four nodes taken as vertices.
function gatherSquares(_rY, _cX){
	
	let tn = _cX * _rY;	// Total nodes.
	
	// Loop through relevant nodes.
	// Approx 1 square per node.
	// I.e. not any in last column-x.
	// Not any in last row-y.
	for (let i = 0; i < tn - _cX; i++){
		// Multiple of cX-1?
		if (i % _cX-(_cX-1) !== 0){
			let baby = new Square();
			let aFourNodes = [4];
			aFourNodes[0] = nodes[i];
			aFourNodes[1] = nodes[i + 1];
			aFourNodes[2] = nodes[i + 1 + _cX];
			aFourNodes[3] = nodes[i + _cX];
			baby.assignNodes(aFourNodes);
			squares.push(baby);
		}
	}
}

function renderNodes(){
	for (let i = 0; i < nodes.length; i++){
		nodes[i].render();
	}
}

function scatterNodes(){
	// Draw nodes, randomly on or off.
	
	let cX = columns;	// Columns.
	let rY = rows;	// Rows.
	
	// How far apart to draw nodes?
	// Minus 1 from rows in order to fit squares
	// exactly across canvas.
	step = width/(cX-1);
	// Would be cool to write a LCF function here.
	// I.e. to calc a step that fits maximum 
	// number of nodes in consideration of both
	// height and width.
	
	// For Perlin noise.
	noiseSeed(1984);
	
	for (let i = 0; i < rY; i++){
		for (let j = 0; j < cX; j++){
			// Just random.
			//let onORoff = Math.round(Math.random());
			// Perlin.
			let onORoff = Math.round(
				noise((j*step)+xOff,(i*step)));
			let baby = new Node(j*step,i*step,
							 onORoff);
			nodes.push(baby);
		}
	}

}

class Square{
	constructor(){
		this.nodes = [4];	
		this.bin = 0;
	}
	assignNodes(aFourNodes){
		// Empty our array of nodes.
		//this.nodes = [];
		// Populate with passed in array.
		this.nodes = aFourNodes;
		
		// Build binary identity based on
		// the four node vertices.
		// Starting with top left, going
		// clockwise.
		this.bin = 	this.nodes[0].on +
								this.nodes[1].on * 2 +
								this.nodes[2].on * 4 +
								this.nodes[3].on * 8;
	}
	
	render(){
		// Half-way points between vertices.
		let l = createVector(this.nodes[0].pos.x,
													 this.nodes[0].pos.y+
													 step*0.5);
		let r = createVector(this.nodes[1].pos.x,
													 this.nodes[0].pos.y+
													 step*0.5);
		let t = createVector(this.nodes[0].pos.x+step*0.5,
													 this.nodes[0].pos.y);
		let b = createVector(this.nodes[0].pos.x+step*0.5,
													 this.nodes[2].pos.y);
		
		if (!linesOn) {	
										stroke(0,g,0); 
									 	fill(0,g,0);}
		
		switch (this.bin){
			case (1): 
				if (linesOn)
				line(l.x,l.y,t.x,t.y);
				triangle(l.x,l.y, t.x,t.y,l.x,t.y);
				break;
			case (2): 
				if (linesOn)
				line(t.x,t.y,r.x,r.y);
				triangle(r.x,r.y, t.x,t.y,r.x,t.y);
				break;
			case (3): 
				if (linesOn)
				line(l.x,l.y,r.x,r.y);
				triangle(l.x,t.y, r.x,t.y,l.x,l.y);
				triangle(r.x,r.y, r.x,t.y,l.x,l.y);
				break;
			case (4): 
				if (linesOn)
				line(b.x,b.y,r.x,r.y);
				triangle(b.x,b.y, r.x,r.y,r.x,b.y);
				break;
			case (5): 
				if (linesOn)
				line(b.x,b.y,r.x,r.y);
				triangle(b.x,b.y, r.x,r.y,r.x,b.y);
				if (linesOn)
				line(l.x,l.y,t.x,t.y);
				triangle(l.x,l.y, t.x,t.y,l.x,t.y);
				break;
			case (6): 
				if (linesOn)
				line(t.x,t.y,b.x,b.y);
				triangle(t.x,t.y, b.x,b.y,r.x,t.y);
				triangle(b.x,b.y, r.x,t.y,r.x,b.y);
				break;
			case (7): 
				if (linesOn)
				line(l.x,l.y,b.x,b.y);
				triangle(l.x,l.y, b.x,b.y,t.x,t.y);
				triangle(l.x,t.y, t.x,t.y,l.x,l.y);
				triangle(t.x,t.y, b.x,b.y,r.x,b.y);
				triangle(t.x,t.y, r.x,t.y,r.x,b.y);
				break;
			case (8): 
				if (linesOn)
				line(l.x,l.y,b.x,b.y);
				triangle(l.x,l.y, b.x,b.y,l.x,b.y);
				break;
			case (9): 
				if (linesOn)
				line(b.x,b.y,t.x,t.y);
				triangle(t.x,t.y, b.x,b.y,l.x,t.y);
				triangle(b.x,b.y, l.x,t.y,l.x,b.y);
				break;
			case (10):
				if (linesOn)
				line(t.x,t.y,r.x,r.y);
				triangle(r.x,r.y, t.x,t.y,r.x,t.y);
				if (linesOn)
				line(l.x,l.y,b.x,b.y);
				triangle(l.x,l.y, b.x,b.y,l.x,b.y);
				break;
			case (11): 
				if (linesOn)
				line(b.x,b.y,r.x,r.y);
				triangle(r.x,r.y, b.x,b.y,t.x,t.y);
				triangle(r.x,t.y, t.x,t.y,r.x,r.y);
				triangle(t.x,t.y, b.x,b.y,l.x,b.y);
				triangle(t.x,t.y, l.x,t.y,l.x,b.y);
				break;
			case (12): 
				if (linesOn)
				line(l.x,l.y,r.x,r.y);
				triangle(l.x,b.y, r.x,b.y,l.x,l.y);
				triangle(r.x,r.y, r.x,b.y,l.x,l.y);
				break;
			case (13): 
				if (linesOn)
				line(r.x,r.y,t.x,t.y);
				beginShape();
				vertex(l.x, t.y);
				vertex(t.x, t.y);
				vertex(r.x, r.y);
				vertex(r.x, b.y);
				vertex(l.x, b.y);
				endShape(CLOSE);
				break;
			case (14): 
				if (linesOn)
				line(t.x,t.y,l.x,l.y);
				beginShape();
				vertex(r.x, t.y);
				vertex(t.x, t.y);
				vertex(l.x, l.y);
				vertex(l.x, b.y);
				vertex(r.x, b.y);
				endShape(CLOSE);
				break;
			case (15):
				rect(l.x,t.y,step);
		}
	}
	
	crudeRender(){
		// Just render squares a random 
		// transparent shade of green.
		fill(0,Math.random()*255,0,101);
		rect(	this.nodes[0].pos.x,
					this.nodes[0].pos.y,
					step,
					step);
	}
	
}

class Node{
	constructor(_x,_y,_on){
		this.pos = createVector(_x,_y);
		this.on = _on;
		this.rad = 4;
	}
	
	render(){
		
		if (this.on) { fill(0);
									stroke(255);
//									push();
//			rectMode(CENTER);
//									noStroke();
//			translate(this.pos.x, this.pos.y);
//			rotate(radians(45));
//			rect(0,0,step*0.8);
//			rectMode(LEFT);
//		pop();
								 }
		else {fill(255);
					stroke(0);
				
				 }
		circle(this.pos.x,this.pos.y,this.rad);
		
	}
}

/* 
So, this function will calc which
nodes to grab as the four corners of
the current square.

Of course, the number of squares will
be a function of the number of nodes,
which are themselves a function of how
many columns (x) and rows (y).

Another way of looking at this problem
is to consider each node as the top left
of a new square. That is, all except for
our edge cases: if in final column or final
row. Final row is easy (node > tc * (rc-1)),
and final column...similar? (node % cn == 0),
i.e. is node number a multiple of total columns?
-> So, we could convert the function below
from n = square number to n = node number :D

*/

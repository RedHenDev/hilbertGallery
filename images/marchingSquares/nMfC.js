

var canvas;

// Terrain seed.
var Eve = 221188;
var offset = 1;

// So that we can find blocks in bods array.
var firstBlockID;

// Flappy's texture.
var flappyTex;
var flappy;

var pipeTex;
var pipes = [];
var woP = 120;    // Width of pipes.

var flappyBabs = [];

// Ghost texture.
var babTex;

// Mechanism to prevent movement when dragging.
var canMove = true;

var stars = [];

var landNum = 0;

var vox;
var coinVox;
var ghostVox;

function preload(){
    flappyTex = loadImage("RedHenIconAlpha512512.png");
    
    babTex = loadImage("ghostEgg.png");
    
    vox = loadSound("Sirens_in_Darkness_by_cynicmusic.mp3");
    
    coinVox = loadSound("coin9.wav");
    ghostVox = loadSound("ghost.wav");
}

function setup(){
    
    canvas = createCanvas(windowWidth, windowHeight);
    
    background(0,101,222);
 
    RedHen_2DPhysics.setupMatter();
    
    // Note the order we ceate these bods.
    // If we create flappy last, then this causes
    // a bug on first level (flappy deleted instead of one of
    // the baby flappies).
    RedHen_2DPhysics.newObj("GhostRectangle", width/2, -50, width * 1.5, 100);
    bods[bods.length-1].makeStatic();
    
    spawnFlappy();
    
    spawnPipes(3);
    
    createTerrain(0);
    
     for (let s = 0; s < 42; s++){
         let sPos = createVector
         (100+Math.random()*(width-200),
         100+Math.random()*(height-200))
    stars.push(sPos);
     }
    
    vox.play();
    
}

var theta = 1;
var dayT = true;

var ghostyTime = 255;

function draw(){
    
    // If it's at least somewhat dark,
    // and there be ghosts, then use
    // alpha to create strange trails.
    if (theta < 0.5 &&
       flappyBabs.length > 0)
        {ghostyTime = 42;}
    else ghostyTime = 255;
    
    background(0,101*theta,222*theta,ghostyTime);
    
    if (dayT){
    theta -=0.0005;
    if (theta <= 0) dayT = false;
    }
    if (!dayT){
    theta +=0.0005;
    if (theta > 1) dayT = true;
    }
    
    // Stars...
    stroke(0,101,222);
    
    for (let s = 0; s < stars.length; s++){
        strokeWeight(Math.random()*4);
        point(stars[s].x, stars[s].y);
    }
    
    // The SUN!
    fill(155 + 100 * theta,200,0);
    noStroke();
    ellipse(100+theta*width,(height+200)-theta*height,200);
    
    noStroke();
    //strokeWeight(2);
    fill(255);
    textSize(32);
    //text("FPS: " + Math.round(frameRate()), 32,32);
    let units = "";
    if (landNum === 1 || landNum === -1)
        units = "mile"
        else units = "miles!"
    text("Travelled " + landNum + " " + units, 32, 64);
    
//    stroke(0,100,0);
//    strokeWeight(4);
//    fill(51,51,0);
//    rect(width/2, height-20, width,40);
    
    if (flappyBabs.length > 0 && frameCount % 4 === 0)
        babyChase();
    
    //RedHen_2DPhysics.checkInputgGlobalMovement();
    
    RedHen_2DPhysics.updateObjs();
    
    blinkie.render();
    
    checkNavigation();
    
  
    
}


function touchEnded(){
    
    // To prevent movement when dragging objects.
    if (canMove === false) { 
        canMove = true;
        return;
    }
    
    
    
    let flappyDir = createVector(0,0);
    
    if (mouseX > width/2 || mouseX > flappy.bod.position.x){
        flappyDir.x = 0.04;
    }
    else {
        flappyDir.x = -0.01; 
    }
    
    flappyDir.y = -0.1;
    flappy.addForce(flappyDir); 

}
function mouseDragged(){
    // To prevent movement when dragging objects.
    canMove = false;
}

// To handle collision events, we could have a static
// method that returns the indices of the pair of
// bods hit, respective to two labels passed in! How do
// we get TWO indices out? In a 2D vector :)

function spawnBaby(_vPipePos){
    
    if (theta < 0.4) ghostSize = 40;
    else ghostSize = 20;
    
    // Spawns a baby hen/thing just beneath pipe.
    RedHen_2DPhysics.newObj("circle", _vPipePos.x, _vPipePos.y + 100, ghostSize);
    //bods[bods.length-1].texture = flappyTex;
    bods[bods.length-1].OSR = false;
    bods[bods.length-1].bod.label = "babyFlap";
    bods[bods.length-1].bod.mass = 1.3;
    bods[bods.length-1].stroke = color(255);
    bods[bods.length-1].strokeWeight = 8;
    bods[bods.length-1].texture = babTex;
    flappyBabs.push(bods[bods.length-1]);
    
}

function repositionGhosts(_amountX, _amountY){
    // Move the flappy babies.
        if (flappyBabs.length > 0){
            for (let i = 0; i < flappyBabs.length; i++){
                flappyBabs[i].makePosition
                (flappyBabs[i].bod.position.x + _amountX,
                flappyBabs[i].bod.position.y + _amountY);
            }
        }
}

function babyChase(){
         let fV = createVector(flappy.bod.position.x,
                              flappy.bod.position.y);
    
         // Baby flappy's heading...
    var hV = createVector(0,0);
    
    for (let i = 0; i < flappyBabs.length; i++){
       
    
        let fbV = createVector(flappyBabs[i].bod.position.x,
                              flappyBabs[i].bod.position.y);
        
        let vfV = createVector(flappyBabs[i].bod.velocity.x,
                               flappyBabs[i].bod.velocity.y);
        
        hV = p5.Vector.sub(fV, fbV);
        hV = hV.normalize();
        vfV = vfV.normalize();
        
        let nhV = p5.Vector.sub(vfV, hV);
        
        hV = hV.mult(0.008);
        
        flappyBabs[i].addForce(hV);
    }
}

function hitPipe(event){
        // Ref to all pairs of bodies colliding.
        var pairs = event.pairs;
        // Iterate over the pairs to
        // find the condition you're
        // looking for.
        for (let i = 0; i < pairs.length;i++){
            // The event's pairs will have a 
            // bodyA and bodyB object that
            // we can grab here...
            let bodA = pairs[i].bodyA;
            let bodB = pairs[i].bodyB;
            
            // Hit pipe...
            if (bodB.label === "pipe" && bodA.label === "flappy"){
                // pipes[0].makeSleep(false); // How to refer to pipe in question?
                //Matter.Sleeping.set(bodA, false);
                spawnBaby(bodB.position);
                spawnBaby(bodB.position);
                
                ghostVox.play();
                
                checkGameOver();
                
                break;
              }
            
            // Bumped by ghost...
            if (bodB.label === "babyFlap" &&
               bodA.label === "flappy"){
                // Shrink flappy on impact.
           //     if (flappy.dia > 20){
//                let recordOfmass = flappy.bod.mass;
//                flappy.makeScale(0.9);
//                flappy.dia = flappy.dia * 0.9;
//                flappy.bod.mass = recordOfmass;
                    
                if (blinkie.scale > 2){
                let recordOfmass = flappy.bod.mass;
                //flappy.makeScale(2);
                //flappy.dia = flappy.dia * 2;
                blinkie.incScale(-1);
                flappy.bod.mass = recordOfmass;
                    
                    
                }
                
                break;
            }
            
            
//            if (bodA.label == "flappy"){
//                Matter.Sleeping.set(bodB, false);
//                break;
//            }
//            
            }   // End of forLoop.
}       // End of collision events function.

function checkGameOver(){
    if (flappyBabs.length > 20){
        alert("Oh no! \n That's 21 Pilot Ghosts! \n  It wouldn't be right to carry on.");
        
        location.reload();
    }
}

function spawnPipes(_number){
    
    let pipeX =  woP*2 + (width/10);
    
    for(let i = 1; i <= _number; i++){
        let loP = height/3;
        RedHen_2DPhysics.newObj 
        ("rectangle", pipeX * i,-50 + Math.random()* 200,
        woP, loP);
        bods[bods.length-1].bod.label = "pipe";
        //bods[bods.length-1].makeStatic();
        bods[bods.length-1].makeSleep(true);
        pipes.push(bods[bods.length-1]);
        bods[bods.length-1].OSR = false;
        bods[bods.length-1].roll = true;
        bods[bods.length-1].texture = 
            loadImage("tubo.png");
    }
    
}

function reScalePipes(){
    
    let pipeX =  woP*2 + (width/10);
    
    for (let i = 0; i < pipes.length; i++){
        pipes[i].makeSleep(true);
        pipes[i].makeAngle(0);
        //pipes[i].bod.height += (Math.random()*100)-50;
        pipes[i].makePosition(pipeX * (i+1),
                             -50+ Math.random()*200);
    }
}

function checkNavigation(){
    
    // First, make sure flappy is on screen.
    
    if (flappy.bod.position.y < 0 ||
       flappy.bod.position.y > height){
       // alert("Oh no! \n Red Hen is lost :( \n Let's refresh!");
        //location.reload();
        flappy.makePosition(width/2, height/2);
    }
    
    
    if (flappy.bod.position.x > width-32){
        
        landNum++;
        
        // Play coin sound!
        coinVox.play();
        
        // Shrink flappy on impact.
        if (flappy.dia < 222){
        let recordOfmass = flappy.bod.mass;
        //flappy.makeScale(2);
        //flappy.dia = flappy.dia * 2;
        blinkie.incScale(1);
        flappy.bod.mass = recordOfmass;
        }
        
        //newTerrain!
        createTerrain(1);
        
        // Reposition flappy!
        flappy.makePosition(42, flappy.bod.position.y-64);
        reScalePipes();
        
        return;
    }
    if (flappy.bod.position.x < 32){
        
        landNum--;
        
        //newTerrain!
        createTerrain(-1);
        // Reposition flappy!
        flappy.makePosition(width-88, flappy.bod.position.y-164);
        reScalePipes();
        
    }
}





function spawnFlappy(){
    //RedHen_2DPhysics.newObj("circle", 64, height/10, width/32);
//    bods[bods.length-1].texture = flappyTex;
    
    blinkie = new antBot(true, 64, height/10, 4);
    
    flappy = bods[bods.length-1];
    flappy.OSR = false;
    flappy.bod.label = "flappy";
}

function createTerrain(_EveInc){
    // How many blocks can we instantiate
    // that both looks good and runs smoothly?
    
    let nOr = 4;
    let nOc = 40;
    let bWid = width/nOc;
    let steepness = bWid*15;
    let grade = 9;
    let groundLevel = height + (100 / 22) * bWid;
    
    // Check whether we need to splice old blocks...
    if (_EveInc != 0){
        
        // Remove old flappy babies.
        for (let i = flappyBabs.length-1; i >= 0; i--){
            RedHen_2DPhysics.removeObj(flappyBabs[i].id);
            flappyBabs.splice(i, 1);
        }
       
        
            for (let i = firstBlockID + (nOr*nOc-1); i >= firstBlockID; i--){
                RedHen_2DPhysics.removeObj(i);
            }
       
    }
    
    //Eve += _EveInc*nOc;
    offset += nOc * _EveInc;
    noiseSeed(Eve);
    
    for (let row = 0; row < nOr; row++){
        for (let col = 0; col < nOc; col++){
            
            if (row === 0){
            RedHen_2DPhysics.newObj 
            ("rectangle",(col*bWid)+bWid/2,
            groundLevel-((noise((col+offset)/grade)*steepness)/2),
            bWid,(noise((col+offset)/grade)*steepness));  }  
                
            else{
            RedHen_2DPhysics.newObj 
            ("box",(col*bWid)+bWid/2,
            groundLevel-(row*bWid)-(col*4),
            bWid);
            }
            
            // Switch off OSC for blocks, since we need
            // to reuse them later.
            bods[bods.length-1].OSR = false;
            // Mass increase so that flappy doesn't knock them around easily.
            //bods[bods.length-1].bod.density = 1;
            bods[bods.length-1].bod.restitution = 0;
            
            //bods[bods.length-1].makeSleep(true);
            
            // Store index of *first* block, so that
            // we can reference the blocks later :)
            if (row == 0 && col == 0){
            firstBlockID = bods.length-1;}
            
            if (row < nOr-3){
                bods[bods.length-1].makeStatic();
                //bods[bods.length-1].makeSleep(true);
            }
            if (row > 0){
                bods[bods.length-1].makePosition (bods[bods.length-1].bod.position.x, bods[bods.length-1].bod.position.y - (noise((col+offset)/grade)*steepness));
            }
            let myC = map(row,0,nOr,100, 200);
            bods[bods.length-1].fill = color(myC*2,myC,0);
            //bods[bods.length-1].stroke = color(myC*2,myC-60,0);
            bods[bods.length-1].stroke = color(0);
            bods[bods.length-1].strokeWeight = 4;
            if (row==nOr-1) {bods[bods.length-1].fill = color(0,myC,0);
            bods[bods.length-1].stroke = color(0,myC-60,0);
                            }
        }
    }
    
}

let trials = [];
let mic;
let amplitude;

function setup() {
  createCanvas(windowWidth, 400);
  strokeWeight(1.5);
  
  // Start the mic
  mic = new p5.AudioIn();
  mic.start();
  
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
}

function draw() {
  background(10, 10, 10, 100); 
  
  // Get volume level
  let vol = amplitude.getLevel(); 
  let curveStrength = map(vol, 0, 0.5, 10, 100); // scale it to use for arc height
  
  // Track mouse movement
  trials.push({x: mouseX, y: mouseY, t: millis()});
  
  if (trials.length > 100){
    trials.shift();
  }
  
  for(let i = 0; i < trials.length; i++){
    let p1 = trials[i];
    for(let j = i + 1; j < trials.length; j++){
      let p2 = trials[j];
      
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 100){
        let alpha = map(d, 0, 100, 255, 0);
        
        // Random blue shades
        let r = random(100, 255);
        let g = random(100, 255);
        let b = random(100, 255);
        stroke(r, g, b, alpha);
        noFill();
        
        // Louder volume = higher curve
        let controlX = (p1.x + p2.x) / 2 + sin(p1.t * 0.005 + j) * curveStrength;
        let controlY = (p1.y + p2.y) / 2 + cos(p2.t * 0.005 + i) * curveStrength;
        
        bezier(p1.x, p1.y, controlX, controlY, controlX, controlY, p2.x, p2.y);
      }
    }
  }
  
   // Set the noise level and scale.
  let noiseLevel = 500;
  let noiseScale = 1000;

  // Scale the input coordinate.
  let nt = noiseScale * frameCount;

  // Compute the noise values.
  let x = noiseLevel * noise(nt);
  let y = noiseLevel * noise(nt + 10000);

  // Draw the point.
  strokeWeight(2);
  point(x, y);
}

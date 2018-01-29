// End-Date for Campaign
let ed = new Date(2018, 11, 12);


// Setup for Canvas Element
function setup() {
  pixelDensity(2.0);
  let canvas = createCanvas(600, 400);
  angleMode(DEGREES);
  canvas.parent('sketch-holder');
}


// Draw Loop for Count Down Timer
function draw() {
  let timer = getTimer();
  clear();
  
  stroke(220);
  ellipse(54, 200, 100, 100);
  ellipse(200, 200, 100, 100);
  ellipse(346, 200, 100, 100);
  ellipse(492, 200, 100, 100);
  
  stroke(50, 120, 220);
  noFill();
  strokeWeight(3);
  strokeCap(ROUND);
  
  arc(54, 200, 100, 100, 270, timer.days);
  arc(200, 200, 100, 100, 270, timer.h);
  arc(346, 200, 100, 100, 270, timer.m);
  arc(492, 200, 100, 100, 270, timer.s);
}

// Time Calculations and Mapping
function getTimer() {
  let d = new Date();
  
  let distance = ed.getTime() - d.getTime();
  
  let days = Math.floor(distance / (60*60*24*1000));
  let h = Math.floor(distance / (60 * 60 * 1000)) - (days * 24);
  let m = Math.floor(distance / (60 * 1000)) - (days * 24 * 60);
  let s = Math.floor(distance / (1000)) - (days * 86400) - (h * 3600);
  let ms = distance - (days * 86400000) - (h * 3600000) - (m * 60000);
  
  let finalTime = {
    "days": map(days, 365, 0, 269, -89),
    "h": map(m, 1440, 0, 269, -89),
    "m": map(s, 3600, 0, 269, -89),
    "s": map(ms, 60000, 0, 269, -89)
  }
  
  return finalTime;
}

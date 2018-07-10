// ====== Program output configuration  ===========
// Marker size in pixels
window.markerSize  = 512; 
window.markerSizeCm  = 8;  // cm

// ====== Triangle configuration  ================= 
// Triangle max size in pixel
window.triangleSize = 128;

// Draw number of triangles per marker
window.triangleLimit = 10;

// Lines' width
window.triangleStrokeWidth = 10;

// Color limits to control overall color brightness
window.colorUpperLimit = 255;
window.colorLowerLimit = 128;


// Border size in percentage (it takes marker space 
window.borderSizePercent = 0.25; // e.g., 0.25 for 25%

// Border color (initially set to black)
var borderColor = 0; 

// Background clear color
window.backgroundColor = [255, 255, 255];


// ===== Variables and code below should be modified at your own risk ====
var markerCounter = 0;
var realMarkerSize, borderSize;

// ==== computer vision related ==== //
var featureCount = 0, corners = [];
window.minFeatures = 400;

// ==== Canvas related things === //
var p5canvas;
var gui;
var latestMarkerImageData, latestMarkerImage;
var generating = false;

// ==== p5.js dom related ==== //
var statusText;

// Creates a new random marker
function createMarker()
{
  // finds border dimensions
  borderSize = borderSizePercent*markerSize;
  
  // finds out real space for markers
  realMarkerSize = markerSize - 2*borderSize;
	
  // cleans the screen
  background(backgroundColor[0],backgroundColor[1],backgroundColor[2]);
  

  // draw triangles
  strokeWeight(triangleStrokeWidth);
  for (var i = 0; i < triangleLimit; i++)
  {
    // Randoming triangle corners, in their own relative coordinate system
    var a = createVector(random(-triangleSize/2, triangleSize/2), random(-triangleSize/2, triangleSize/2));
    var b = createVector(random(-triangleSize/2, triangleSize/2), random(-triangleSize/2, triangleSize/2));
    var c = createVector(random(-triangleSize/2, triangleSize/2), random(-triangleSize/2, triangleSize/2));
    
    // Randoming the center position on the canvas
    var p = new createVector( borderSize + random(realMarkerSize), borderSize + random(realMarkerSize));
    
    // Randoming fill color
    fill(random(colorLowerLimit, colorUpperLimit),random(colorLowerLimit, colorUpperLimit),random(colorLowerLimit, colorUpperLimit));
  
    // Drawing the triangle
    triangle(a.x + p.x, a.y + p.y,
             b.x + p.x, b.y + p.y,
             c.x + p.x, c.y + p.y); 
  }
  
  // draw borders
  strokeWeight(0);
  fill(borderColor);
  rect(0, 0, markerSize, borderSize);                      // up 
  rect(0, markerSize - borderSize, markerSize, borderSize + 1);  // down
  rect(0, 0, borderSize, markerSize); // left
  rect(markerSize - borderSize, 0, borderSize + 1, markerSize); // right
  
  
  // save image in memory
  latestMarkerImageData = p5canvas.drawingContext.getImageData(0, 0, width, height);
  if (!generating)
    latestMarkerImage = p5canvas.canvas.toDataURL("image/jpg");
	    
  findFeatures();
 
  updateStatus();
 
  
}

function updateStatus()
{
	statusText.html( (generating ? "Generating... / " : "") + markerSize + "x" + markerSize + " / " + featureCount + " features");
}

function generate()
{
	generating = true;
}

function setup() {
  // defines canvas size
  p5canvas = createCanvas(markerSize, markerSize)
  p5canvas.parent('markerholder');
    
  // creates the menu
  gui = new dat.GUI();
  
  // creates a folder for the marker
  var guiMarker = gui.addFolder('Marker');
  guiMarker.add(window, 'markerSize', 256, 1024).step(1).onChange(function() {  p5canvas.size(markerSize, markerSize); createMarker(); });
  guiMarker.add(window, 'borderSizePercent').min(0).step(0.05).max(0.5).onChange(createMarker);
  guiMarker.open();
  
  // floating gui
  var guiProcedural = gui.addFolder('Settings');
  guiProcedural.add(window, 'triangleSize', 5, 1024).onChange(createMarker);
  guiProcedural.add(window, 'triangleLimit', 1, 200).onChange(createMarker);
  guiProcedural.add(window, 'triangleStrokeWidth', 0, 30).onChange(createMarker);
  guiProcedural.add(window, 'colorUpperLimit', 0, 255).onChange(createMarker);
  guiProcedural.add(window, 'colorLowerLimit', 0, 255).onChange(createMarker);
  guiProcedural.addColor(window, 'backgroundColor').onChange(createMarker);
  
  
  var guiTracking = gui.addFolder('Feature Tracking');
  guiTracking.add(window, 'minFeatures', 200, 1000);
  
  //gui.add(window, 'markerSizeCm', 5, 25).step(1).onChange();
  gui.add(window, 'generate');
  

  // dom gui
  statusText = select('#status');  
  
  // creates a sample marker
  createMarker();
  
}

function draw() {
  if (generating)
  {
	  createMarker();
	  if (featureCount > minFeatures)
	  {
		  generating = false;
		  latestMarkerImage = p5canvas.canvas.toDataURL("image/jpg");
		  updateStatus();
	  }
  }
  
}

// uses tracking.js to find tracking features
function findFeatures()
{
   var gray = tracking.Image.grayscale(latestMarkerImageData.data, markerSize, markerSize);
   corners = tracking.Fast.findCorners(gray, width, height);
   featureCount = corners.length;

      //  for (var i = 0; i < corners.length; i += 2) {
      //    context.fillStyle = '#f00';
      //    context.fillRect(corners[i], corners[i + 1], 3, 3);
      //  }
}

// author danilo gasques ( danilod100 at gmail.com )
// based on ASPePeX's https://github.com/ASPePeX/AR-Marker-Generator

// ====== Program output configuration  ===========
// Marker size in pixels
window.markerSize = 512;
window.markerSizeMM = 80; // mm
window.markerName = "marker";

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

// user image related settings
window.guiImageControllers = {};
window.backgroundImage = undefined;
window.backgroundImageSet = false;

window.foregroundImage = undefined;
window.foregroundImageSet = false;

// ===== Variables and code below should be modified at your own risk ====
var markerCounter = 0;
var realMarkerSize, borderSize;

// ==== computer vision related ==== //
var featureCount = 0,
  corners = [];
window.minFeatures = 400;

// ==== Canvas related things === //
var p5canvas;
var gui;
var latestMarkerImageData, latestMarkerImage;
var generating = false;

// ==== PDF related things === //

window.savePDF = true;
window.paperSizeName = "letter";
window.paperSizeWidthMM = 215.9;
window.paperSizeHeightMM = 279.4;
window.paperSizesOptions = [
  "letter",
  "a4",
  "government-letter",
  "legal",
  "ledger",
  "credit-card",
  "a3",
  "a5",
  "dl",
  "custom",
];
window.paperSizesMM = {
  a3: [297, 420],
  a4: [210, 297],
  a5: [148, 210],
  dl: [110, 220],
  letter: [215.9, 279.4],
  "government-letter": [203, 267],
  legal: [216, 356],
  ledger: [279, 432],
  "credit-card": [53.975, 85.725],
};

// ==== p5.js dom related ==== //
var statusText;

// ================================================================================================================== //
// ======================== P5js methods for drawing the marker and creating the menus  ============================= //
// ================================================================================================================== //

// Creates a new random marker
function createMarker() {
  // finds border dimensions
  borderSize = borderSizePercent * markerSize;

  // finds out real space for markers
  realMarkerSize = markerSize - 2 * borderSize;

  // cleans the screen
  background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);

  // draws background image
  if (backgroundImageSet) {
    image(backgroundImage, 0, 0, window.markerSize, window.markerSize);
  }

  // draw triangles
  strokeWeight(triangleStrokeWidth);
  for (var i = 0; i < triangleLimit; i++) {
    // Randoming triangle corners, in their own relative coordinate system
    var a = createVector(
      random(-triangleSize / 2, triangleSize / 2),
      random(-triangleSize / 2, triangleSize / 2)
    );
    var b = createVector(
      random(-triangleSize / 2, triangleSize / 2),
      random(-triangleSize / 2, triangleSize / 2)
    );
    var c = createVector(
      random(-triangleSize / 2, triangleSize / 2),
      random(-triangleSize / 2, triangleSize / 2)
    );

    // Randoming the center position on the canvas
    var p = new createVector(
      borderSize + random(realMarkerSize),
      borderSize + random(realMarkerSize)
    );

    // Randoming fill color
    fill(
      random(colorLowerLimit, colorUpperLimit),
      random(colorLowerLimit, colorUpperLimit),
      random(colorLowerLimit, colorUpperLimit)
    );

    // Drawing the triangle
    triangle(a.x + p.x, a.y + p.y, b.x + p.x, b.y + p.y, c.x + p.x, c.y + p.y);
  }

  // draw borders
  strokeWeight(0);
  fill(borderColor);
  rect(0, 0, markerSize, borderSize); // up
  rect(0, markerSize - borderSize, markerSize, borderSize + 1); // down
  rect(0, 0, borderSize, markerSize); // left
  rect(markerSize - borderSize, 0, borderSize + 1, markerSize); // right

  // draws foreground
  if (foregroundImageSet) {
    image(foregroundImage, 0, 0, window.markerSize, window.markerSize);
  }

  // save image in memory
  latestMarkerImageData = p5canvas.drawingContext.getImageData(
    0,
    0,
    width,
    height
  );
  if (!generating)
    latestMarkerImage = p5canvas.canvas.toDataURL("image/jpeg", 1.0);

  findFeatures();

  updateStatus();
}

function onErrorBackgroundImage() {
  backgroundImageSet = false;
  alert("Could not load background image!");
}

function onErrorForegroundImage() {
  foregroundImageSet = false;
  alert("Could not load foreground image!");
}

function onLoadBackgroundImage(backgroundImage) {
  console.log(backgroundImage);
  backgroundImageSet = true;
  createMarker();
  guiImageControllers["background"].name("Remove bground");
}

function onLoadForegroundImage(foregroundImage) {
  console.log(foregroundImage);
  foregroundImageSet = true;
  createMarker();
  guiImageControllers["foreground"].name("Remove fground");
}

function onForegroundImageChange() {
  if (userForegroundFilePicker.files.length > 0) {
    window.foregroundImage = loadImage(
      URL.createObjectURL(userForegroundFilePicker.files[0]),
      onLoadForegroundImage,
      onErrorForegroundImage
    );
  }
}

function onBackgroundImageChange() {
  if (userBackgroundFilePicker.files.length > 0) {
    window.backgroundImage = loadImage(
      URL.createObjectURL(userBackgroundFilePicker.files[0]),
      onLoadBackgroundImage,
      onErrorBackgroundImage
    );
  }
}

function clearBackgroundImage() {
  backgroundImageSet = false;
  createMarker();
  guiImageControllers["background"].name("Add background");
}

function clearForegroundImage() {
  foregroundImageSet = false;
  createMarker();
  guiImageControllers["foreground"].name("Add foreground");
}

function setup() {
  // defines canvas size
  p5canvas = createCanvas(markerSize, markerSize);
  p5canvas.parent("markerholder");

  // creates the menu
  gui = new dat.GUI();

  // images
  var guiImages = gui.addFolder("Images");
  window.userBackgroundFilePicker = document.getElementById(
    "userBackgroundImage"
  );
  window.userForegroundFilePicker = document.getElementById(
    "userForegroundImage"
  );
  window.userBackgroundFilePicker.onchange = onBackgroundImageChange;
  window.userForegroundFilePicker.onchange = onForegroundImageChange;

  guiImageControllers["background"] = guiImages
    .add(
      {
        backgroundImage: function () {
          if (!backgroundImageSet) {
            userBackgroundFilePicker.click();
          } else {
            clearBackgroundImage();
          }
        },
        gui: window.guiImageControllers,
      },
      "backgroundImage"
    )
    .name("Add background");
  guiImageControllers["foreground"] = guiImages
    .add(
      {
        foregroundImage: function () {
          if (!foregroundImageSet) {
            userForegroundFilePicker.click();
          } else {
            clearForegroundImage();
          }
        },
        gui: window.guiImageControllers,
      },
      "foregroundImage"
    )
    .name("Add foreground");
  guiImages.open();

  // creates a folder for the marker
  var guiMarker = gui.addFolder("Marker");
  guiMarker
    .add(window, "markerSize", 256, 1024)
    .step(1)
    .onChange(function () {
      p5canvas.size(markerSize, markerSize);
      createMarker();
    });
  guiMarker
    .add(window, "borderSizePercent")
    .min(0)
    .step(0.025)
    .max(0.5)
    .onChange(createMarker);
  guiMarker.open();

  // floating gui
  var guiProcedural = gui.addFolder("Settings");
  guiProcedural.add(window, "triangleSize", 5, 1024).onChange(createMarker);
  guiProcedural.add(window, "triangleLimit", 1, 200).onChange(createMarker);
  guiProcedural
    .add(window, "triangleStrokeWidth", 0, 30)
    .onChange(createMarker);
  guiProcedural.add(window, "colorUpperLimit", 0, 255).onChange(createMarker);
  guiProcedural.add(window, "colorLowerLimit", 0, 255).onChange(createMarker);
  guiProcedural.addColor(window, "backgroundColor").onChange(createMarker);

  // computer vision side of things
  var guiTracking = gui.addFolder("Feature Tracking");
  guiTracking.add(window, "minFeatures", 200, 1000);

  // pdf
  var guiPDF = gui.addFolder("PDF");
  guiPDF.add(window, "savePDF");
  guiPDF.add(window, "markerSizeMM");
  var paperSizeNameGui = guiPDF.add(window, "paperSizeName", paperSizesOptions);
  var paperSizeWidthMMGui = guiPDF.add(window, "paperSizeWidthMM");
  var paperSizeHeightMMGui = guiPDF.add(window, "paperSizeHeightMM");

  // whenever the paper size name changes, it also changes the dimensions
  paperSizeNameGui.onChange(function () {
    if (paperSizeName != "custom") {
      paperSizeWidthMM = paperSizesMM[paperSizeName][0];
      paperSizeHeightMM = paperSizesMM[paperSizeName][1];

      paperSizeWidthMMGui.updateDisplay();
      paperSizeHeightMMGui.updateDisplay();
    }
  });

  var changeToCustom = function () {
    paperSizeName = "custom";
    paperSizeNameGui.updateDisplay();
  };

  paperSizeHeightMMGui.onChange(changeToCustom);
  paperSizeHeightMMGui.onChange(changeToCustom);

  // download
  window.guiDownload = gui.addFolder("Download");
  //gui.add(window, 'markerSizeCm', 5, 25).step(1).onChange();
  var markerNameGui = guiDownload
    .add(window, "markerName")
    .onChange(function () {
      // remove illegal characters
      markerName = markerName.replace(
        /\<|\>|\:|\"|\/|\\|\||\?|\*|/gi,
        function (x) {
          return "";
        }
      );
      markerNameGui.updateDisplay();
    });

  guiDownload.add(window, "download");

  // generate
  gui.add(window, "generate");

  // dom gui
  statusText = select("#status");

  // creates a sample marker
  createMarker();
}

function draw() {
  if (generating) {
    createMarker();
    if (featureCount > minFeatures) {
      generating = false;
      guiDownload.open();
      latestMarkerImage = p5canvas.canvas.toDataURL("image/jpeg");
      updateStatus();
    }
  }
}

// ================================================================================================================== //
// ==================== Helper methods for updating status, generating pdf, downloading zip ========================= //
// ================================================================================================================== //

// updates status text at the top of the screen
function updateStatus() {
  statusText.html(
    (generating ? "Generating... / " : "") +
      markerSize +
      "x" +
      markerSize +
      " / " +
      featureCount +
      " features"
  );
}

// starts generate animation
function generate() {
  guiDownload.close();
  generating = true;
}

// creates and zips a pdf, patt file, readme.txt
function download() {
  // create zip file
  var zip = new JSZip();

  // image file (hopefully, jpeg)
  var fileRe = /data:image\/(\w+);(\w+),(.*)/;
  var pic = fileRe.exec(latestMarkerImage);
  var picname = markerName + "." + pic[1];
  zip.file(picname, pic[3], { base64: true });

  // generate patt file(s)
  var pattname = markerName + ".patt";
  zip.file(markerName + ".patt", generatePatt());

  // generate pdf
  var pdfname = markerName + ".pdf";
  zip.file(
    markerName + ".pdf",
    generatePDF(latestMarkerImage, pic[1].toUpperCase()),
    { blob: true }
  );

  // readme.txt
  zip.file(
    "ReadMe.txt",
    "Marker from https://danilogr.github.io/AR-Marker-Generator/ on " +
      new Date().toString() +
      "\n\n" +
      picname +
      " - Picture file that can be used on tools like Vuforia " +
      "\n" +
      pattname +
      " - .patt file designed for ARToolkit / AR.js " +
      "\n" +
      pdfname +
      " - Pdf with the proper printing dimensions" +
      "\n"
  );

  // download zip
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, markerName + ".zip");
  });
}

// generates .patt (arjs / artoolkit)
function generatePatt() {
  // gets image without the borders
  var innerMarkerCanvas = document.createElement("canvas");
  innerMarkerCanvas.width = realMarkerSize;
  innerMarkerCanvas.height = realMarkerSize;
  var imgData = p5canvas.drawingContext.getImageData(
    borderSize,
    borderSize,
    realMarkerSize,
    realMarkerSize
  );
  innerMarkerCanvas.getContext("2d").putImageData(imgData, 0, 0);

  // right now I am using what is available in AR.js source code
  return THREEx.ArPatternFile.encodeImage(innerMarkerCanvas);
}

// generates pdf
function generatePDF(pic, picFormat) {
  // paper size
  var pdfSize =
    paperSizeName == "custom"
      ? [paperSizeWidthMM, paperSizeHeightMM]
      : paperSizeName;

  var doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: pdfSize,
  });

  // add picture to it
  doc.addImage(
    pic,
    picFormat,
    Math.round((paperSizeWidthMM - markerSizeMM) / 2),
    Math.round((paperSizeHeightMM - markerSizeMM) / 2),
    markerSizeMM,
    markerSizeMM,
    "marker",
    "NONE"
  );

  return doc.output("blob");
}

// uses tracking.js to find tracking features
function findFeatures() {
  var gray = tracking.Image.grayscale(
    latestMarkerImageData.data,
    markerSize,
    markerSize
  );
  corners = tracking.Fast.findCorners(gray, width, height);
  featureCount = corners.length;

  //  for (var i = 0; i < corners.length; i += 2) {
  //    context.fillStyle = '#f00';
  //    context.fillRect(corners[i], corners[i + 1], 3, 3);
  //  }
}

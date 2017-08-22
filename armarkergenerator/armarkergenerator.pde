float triangleSize = 1;
int triangleLimit;
int colorUpperLimit;
int colorLowerLimit;
int markerCounter;
int borderSize;

String[] names = {"handL", "handR", "cup_intensity", "cup_color", "thermostat", "room_corner", "couch", "painting", "lamp", "button", "gooseneck_lamp1", "gooseneck_lamp2", "gooseneck_lamp3", "message", "door", "wall_1", "wall_2", "cupboard", "tray", "table", "book", "catalogue"}; 
int marker_size = 1000; //width of the marker  //processing 3 requires you to write in line 16 the actual size of your markers, super lame. 
int line_width = 3; //width of the lines
String directory = "markers"; // choose directory where to save your markers
int min_edge = 200;
int min_angle = 30;
int max_tries = 100;

void setup() {
  size(1000, 1000); //processing 3 requires you to write here the actual size of your markers, super lame. 
  strokeWeight(line_width);
  //settings  
  //triangle max size in pixel
  triangleSize = 500;
  //Color limits to control overall color brightness
  colorUpperLimit = 255;
  colorLowerLimit = 50; //224;
  triangleLimit = 40;//250; //Draw number of triangles per marker
  borderSize = 0; //Border in pixels in addition to the canvas size, borders ar blank white
  println("Generating " +  names.length + " markers");
}
 
void draw() {
  if (markerCounter >= names.length)
  {
    println("All markers generated");
    exit();
  }
  else {
    background(255);
    drawMarker();
    SaveMarker();
    clear();
  }
}


void drawMarker() {
 for (int i = 0; i < triangleLimit; i++)
  {
    //Randoming triangle corners, in their own relative coordinate system
    PVector a;
    PVector b;
    PVector c;
    int tris = 1;
    
    do {
      print("generating");
      if (tris > 1) print(" a new");
      println(" triangle no." + tris);
      a = new PVector(random(-triangleSize/2, triangleSize/2), random(-triangleSize/2, triangleSize/2));
      b = new PVector(random(-triangleSize/2, triangleSize/2), random(-triangleSize/2, triangleSize/2));
      c = new PVector(random(-triangleSize/2, triangleSize/2), random(-triangleSize/2, triangleSize/2));
      tris++;
      if (tris > max_tries) break;
    } while (a.dist(b) < min_edge || b.dist(c) < min_edge || c.dist(a) < min_edge || degrees(PVector.angleBetween(a, b)) < min_angle || degrees(PVector.angleBetween(a, c)) < min_angle); 
    
    //Randoming the center position on the canvas
    PVector p = new PVector(random(width), random(height));
    
    //Randoming fill color
    fill(random(colorLowerLimit, colorUpperLimit),random(colorLowerLimit, colorUpperLimit),random(colorLowerLimit, colorUpperLimit));
  
    //Drawing the triangle
    triangle(a.x + p.x, a.y + p.y,
             b.x + p.x, b.y + p.y,
             c.x + p.x, c.y + p.y); 
  } 
}

void SaveMarker() {
  String filename = names[markerCounter] + nf(markerCounter, 3) + ".png";
  
  int newwidth = width + 2*borderSize;
  int newheight = height + 2*borderSize;
  
  PImage oldimg = get();
  clear();
  background(255);
  
  PImage newimg = get();
  newimg.resize(newwidth, newheight);
  newimg.set(borderSize, borderSize, oldimg);
  newimg.save(savePath(directory+"/"+filename));
  
  println("Generated marker id " + markerCounter);
  markerCounter++;
}

// AR generator parameters (tweak at wish)
float triangleSize = 500;                     //triangle max size in pixel
int marker_size = 1000;                       //width of the marker  //processing 3 requires you to write in line 16 the actual size of your markers, super lame. 
int line_width = 3;                           //width of the lines
int min_edge = 200;
int min_angle = 30;
int max_tries = 100;                          //because this is a brute force approach, this affects performance (# of tries => increases time)

//directory for storying your generated AR markers
String directory = "markers";                 // choose directory where to save your markers

//marker names (read TEXT file)
String text_file_name = "data/marker_names.txt";   //change here if you want to load a text file under another name (this file should list all marker names followed by a comma)
String delimiters = " ,.?!;:[]";              //Any punctuation is used as a delimiter.
String[] names;                               //No need to edit this variable

//other variables 
int triangleLimit = 40;                      //Draw number of triangles per marker
int colorUpperLimit = 255;                   //Color limits to control overall color brightness
int colorLowerLimit = 50;                    //Color limits to control overall color brightness
int markerCounter;                           //Depends on how mnay markers you specified names on your TEXT file. 
int borderSize = 0;                          //Border in pixels in addition to the canvas size, borders ar blank white 
 
void setup() {
  size(1000, 1000);                           //processing 3 requires you to write here the actual size of your markers (I think this is super lame.) 
  strokeWeight(line_width);
  
  try{
    String[] rawtext = loadStrings(text_file_name);
    String alltext = join(rawtext, "" );
    names = splitTokens(alltext, delimiters);
  }
  catch (NullPointerException e) {           // if you forgot the text file, will still produce for nice markers and warn you. 
    println("WARNING: no  file found" + e);
    names = new String[4];
    for (int i = 0; i < 4; i++) names[i] = "no_marker_name_textfile_found";  
  }
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
      print("Generating");
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
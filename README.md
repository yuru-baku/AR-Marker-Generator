# AR-Marker-Generator

A processing sketch that generates markers for Augmented Reality applications like Vuforia.
This allows you to create single markers but also named sets of markers (batch processing). 

## How to use

Open the ``armarkergenerator.pde`` sketch in your processing IDE.
Click ``play`` to start compiling markers. These will show up in your ``markers``directory. (Note that you can change this directory by changing the variable ``String directory = "markers";``)

## How to configure to generate N markers with right names

You can generate markers with the names that you want by adding the names to this array:

``String[] names = {"handL", "handR", "cup_intensity", "cup_color", "thermostat", "room_corner", "couch", "painting", "lamp", "button", "gooseneck_lamp1", "gooseneck_lamp2"};``

## Examples of generated markers

* color and low density of triangles (tested in Vuforia and HoloLens with good results)

![Marker example](armarkergenerator/markers/handR001.png)


* color and low density of triangles (tested in Vuforia and HoloLens with good results)

![Marker example](armarkergenerator/markers/handL000.png)


* black and white and high density of triangles (tested in Vuforia and HoloLens with good results)
![Marker example](armarkergenerator/markers/markerexample.png)




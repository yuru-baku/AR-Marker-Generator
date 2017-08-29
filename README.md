# AR-Marker-Generator

A processing sketch that generates markers for Augmented Reality applications like Vuforia.
This allows you to create single markers but also named sets of markers (batch processing). 

## How to use

### Using directly in the Processing IDE

1. Open the ``armarkergenerator.pde`` sketch in your processing IDE.
2. Click ``play`` to start generating your AR markers. These will show up in your ``markers``directory. (Note that you can change this directory by changing the variable ``String directory = "markers";``)

### Using the binary executables (releases)

1. Download the release [from our github](https://github.com/PedroLopes/AR-Marker-Generator/releases) (depends on your operating system and comes bundled with java already)
2. Double click to execute it.
3. It will start generating your AR markers; then wait for it to close automatically (likely takes 10 seconds). The markers will show up in your ``markers``directory.

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

## Testing

This has been successfully tested using Processing 3.0b4 (alpha), which is revision 0242. If you tested on a newer version, feel free to let us know what happened using a issue tracker / pull request. 





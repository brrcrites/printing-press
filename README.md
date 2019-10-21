# Printing Press

[![Build Status](https://travis-ci.com/brrcrites/printing-press.svg?branch=master)](https://travis-ci.com/brrcrites/printing-press)

A web based tool to create Architecture SVGs from the
[Parchmint](https://github.com/CIDARLAB/Parchmint) standard.

## System Flow
Printing Press works in two parts: parsing and drawing. When a Parchmint file
is uploaded to the website, it is first parsed and converted to an
`Architecture` object. Printing press then draws the Architecture and displays
it as a series of SVG images.


## Parsing
Parsing a Parchmint file breaks down into three steps:
1. Schema validation
2. JSON parsing
3. Architecture validation


### Schema Validation
Printing Press validates the Parchmint file against the
[schema](https://github.com/CIDARLAB/Parchmint/blob/master/schema.json)
as defined by the [CIDARLAB/Parchmint repo](https://github.com/CIDARLAB/Parchmint).
A full description of the Parchmint standard can be found there.


### JSON Parsing
Printing Press builds the Architecture using the values from the
Parchmint file. The Parchmint parser starts from the bottom of the data
model and works its way to the top.
1. Parse Component Features from the `features` key.
    * The parser distinguishes Component Features from  Connection Features
        by checking whether the `channel` property exists.
2. Parse Components from the `components` key and add their respective
    Component Features.
    * The parser creates multiple Component objects, one for each layer on
        which it exists.
    * Each Component object only has one associated Component Feature.
3. Parse Connection Features from the `features` key.
4. Parse Connections from the `connections` key and add their respective
    Component Features (channel segments).
5. Parse each Layer from the `layers` key, and add all Components and
    Connections that exist on that layer.
6. Parse the `name` and create an Architecture object that holds
    all the Layers.
    
    
### Architecture Validation
Printing Press calls validate on the Architecture object, which in turn
validates each object in the data model by recursive composition.

If no errors have been encountered thus far, then the Architecture is sent to
be drawn.
    
    
## Drawing
Printing Press uses [Paper.js](http://paperjs.org) to generate the SVG images for
a given Parchmint file. Each `layer` has one image associated with it.
Printing Press passes a `PaperScope` object down through the data model, one for
each `layer`. The `print` function in the layer takes two parameters: `xSpan`
and `ySpan`. define the size of the canvas on which the `components` and
`connections` will be drawn.

Printing Press draws `component`s as bounding boxes of width `xSpan` and height
`ySpan` at `location`. It draws `connection`s (currently) as individual lines
segments, one for each channel segment, starting at `source` and ending at
`sink`. This will be updated to draw a `connection` as one continuous line to
avoid issues while milling.

A user can enter the device height and width on the web page, or leave the
fields blank to allow Printing Press to determine the dimensions.
Printing Press uses the determined dimensions if the user enters a height or
width smaller than the greatest x/y coordinate of a `component`/`connection`.


## Testing
Printing Press uses [Jest](https://jestjs.io) to write and run tests. It is
connected to [Travis CI](https://travis-ci.com) to perform automatic tests. To
perform tests locally, run the command `npm test` in the root directory of the
project.

Currently, there are no tests covering the drawing code of Printing Press.


## Usage

### Parsing
The `ParchmintParser` provides functions to parse Parchmint files without the
use of the website. The `parse` function is the easiest way to parse a file.
Parse can take either a JSON formatted string or an object and will return the
resulting Architecture object. This function requires a Parchmint file that
follows the schema. For example:
```javascript
const ParchmintParser = require('parchmint-parser.js');
var parchmint_file = require('parchmint-file.json');

var parchmint_parser = new ParchmintParser();
var architecture = parchmint_parser.parse(parchmint_file);
```

Parsing can also be done on individual top level Parchmint keys. This way the
schema does not have to be followed directly. The arguments passed to the
`parseComponents`, `parseConnections`, etc. must be objects. For example:
```javascript
const ParchmintParser = require('parchmint-parser.js');
var parchmint_file = require('component-features-only.json');
var parchmint_object = JSON.parse(parchmint_file);

var parchmint_parser = new ParchmintParser();
parchmint_parser.parseComponentFeatures(parchmint_object);
```


### Drawing
Each top level key of the Parchmint file can draw itself. That is, the `print`
method can be called on any object representing a top level key. Only the
`print` function on the `Layer` object returns a string representing the SVG.
The rest merely add the `Path` object to the `PaperScope` object it was passed.
For example:
```javascript
const ParchmintParser = require('parchmint-parser.js');
var paper = require('paper');
var parchmint_file = require('parchmint-file.json');

var parchmint_parser = new ParchmintParser();
var architecture = parchmint_parser.parse(parchmint_file);

// Calling print on each layer and saving the SVG strings
var layer_svgs = [];
architecture.layers.forEach(layer => {
    layer_svgs.push(layer.print(architecture.xSpan, architecture.ySpan));
});

// Drawing a single Component and retrieving its SVG string
var paperScope = new paper.PaperScope();
var component_svg;
paperScope.setup(new paper.Size(100, 100));
architecture.layers.components[0].print(paperScope);
component_svg = paperScope.project.export( { asString:true } );
```

## UML Diagram
![Printing Press UML](https://github.com/brrcrites/printing-press/blob/MichaelJBradley/update-readme/images/pp-uml.png?raw=true)

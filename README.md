# Printing Press

[![Build Status](https://travis-ci.com/brrcrites/printing-press.svg?branch=master)](https://travis-ci.com/brrcrites/printing-press)

A web based tool to create Architecture SVGs from the
[Parchmint](https://github.com/CIDARLAB/Parchmint) standard.

## Parsing
Parsing a Parchmint file breaks down into three steps:
1. Schema validation
2. JSON parsing
3. Architecture validation

### Schema Validation
printing-press validates the Parchmint file against the
[schema](https://github.com/CIDARLAB/Parchmint/blob/master/schema.json)
as defined by the [CIDARLAB/Parchmint repo](https://github.com/CIDARLAB/Parchmint).
A full description of the Parchmint standard can be found there.

### JSON Parsing
printing-press builds the Architecture using the values from the
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
printing-press calls validate on the Architecture object, which in turn
validates each object in the data model by recursive composition.

If no errors have been encountered thus far, then the Architecture is sent to
be drawn.
    
## Drawing
printing-press uses [Paper.js](http://paperjs.org) to generate the SVG images for
a given Parchmint file. Each `layer` has one image associated with it.
printing-press passes a `PaperScope` object down through the data model, one for
each `layer`.

printing-press draws `component`s as bounding boxes of width `xSpan` and height
`ySpan` at `location`. It draws `connection`s (currently) as individual lines,
one for each channel segment, starting at `source` and ending at `sink`. This
will be updated to draw a `connection` as one line to avoid issues while milling.

A user can enter the device height and width, or leave the fields blank to
allow printing-press to determine the dimensions. printing-press uses the
determined dimensions if the user enters a height or width smaller than the
greatest x/y coordinate of a `component`/`connection`.

function generateSvgRectangle(x, y, x_span, y_span) {
    return '<rect x="' + x + '" y="' + y + '" width="' + x_span + '" height="' + y_span + '" style="fill:rgb(0,0,255); stroke-width: 1; stroke:rgb(0,0,0)" />';
}

function generateSvgLine(x1, y1, x2, y2) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="black" />';
}

function parseParchMintJson(json) {
    var component_svgs = "";
    var connection_svgs = "";
    var device_height = 0; var device_width = 0;

    for(var i = 0; i < json.components.length; i++) {
        console.log('component:' + json.components[i].name);
    }
    for(var i = 0; i < json.connections.length; i++) {
        console.log('connection: ' + json.connections[i].name);
    }

    for(var i = 0; i < json.features.length; i++) {
        var c = json.features[i];
        if(c.type == 'component') {

            // Check if any part of the component is outside the bounds we've set so far and update the bounds if necessary 
            if(c['location']['x'] + c['x-span'] > device_width) {
                device_width = c['location']['x'] + c['x-span'];
            }
            if(c['location']['y'] + c['y-span'] > device_height) {
                device_height = c['location']['y'] + c['y-span'];
            }

            // Process the component, generating the correct rectangle
            component_svgs += generateSvgRectangle(c['location']['x'], c['location']['y'], c['x-span'], c['y-span']);
        }
        else if(c.type == 'channel') {

            // Check if any of the channel points are outside the bounds we've set so far and update the bounds if necessary
            if(Math.max(c['source']['x'], c['sink']['x']) > device_width) {
                device_width = Math.max(c['source']['x'], c['sink']['x']);
            }
            if(Math.max(c['source']['y'], c['sink']['y']) > device_height) {
                device_height = Math.max(c['source']['y'], c['sink']['y']);
            }

            // Process the connection, generating the correct line
            connection_svgs += generateSvgLine(c['source']['x'], c['source']['y'], c['sink']['x'], c['sink']['y']);
        }
        else {
            console.log('Error with: ' + JSON.stringify(c));
        }
    }

    // Update the SVG image region with what we've generated
    $('#svg_image').append(
        '<svg width="' + device_width + '" height="' + device_height + '">' + component_svgs +  connection_svgs + '</svg>'
    );
}

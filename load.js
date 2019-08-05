const ParchmintParser = require('./parsing/parchmint-parser.js');

var pp = new ParchmintParser();

$('#drop_zone').on('dragover', dragOverHandler)
               .on('drop', dropHandler);

// Prevent default drop behavior
function dragOverHandler(ev) {
    // Commented out because this function is called over and over as long as a file is dragged over the drop zone
    // console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

// Clean up data after being processed
function removeDragData(ev) {
    // Because we're using jQuery, we must access the dataTransfer like so
    let dataTransfer = ev.originalEvent.dataTransfer;
    console.log('Removing drag data');

    if (dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        dataTransfer.items.clear();
    } else {
        // Use DataTransfer interface to remove the drag data
        dataTransfer.clearData();
    }
}

// Print files being dropped into the dropzone
function dropHandler(ev) {
    // Because we're using jQuery, we must access the dataTransfer like so
    let dataTransfer = ev.originalEvent.dataTransfer;

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    console.log('File(s) dropped');


    // TODO(brrcrites): we want to verify only one file is loaded and then process it directly
    if (dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (dataTransfer.items[i].kind === 'file') {
                var file = dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }

    // Read the file contents and then update the text through a callback
    readFileContents(dataTransfer.items[0].getAsFile(), function(result) {
        $('#drop_zone').text(JSON.parse(result)['name']);
        //parseParchMintJson(JSON.parse(result));
        pp.clear();
        pp.parse(result);

        if (pp.valid) {
            console.log('Success! The Parchmint file is valid.');
        }
    });

    // Pass event to removeDragData for cleanup
    removeDragData(ev)
}

// Function for reading and returning the contents of a file
function readFileContents(raw_file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) { callback(e.target.result); };
    reader.readAsText(raw_file)
}

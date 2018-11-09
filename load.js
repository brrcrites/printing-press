// Prevent default drop behavior
function dragOverHandler(ev) {
    console.log('File(s) in drop zone'); 
    
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

// Clean up data after being processed
function removeDragData(ev) {
    console.log('Removing drag data');

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
    } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
    }
}

// Print files being dropped into the dropzone
function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // TODO(brrcrites): we want to verify only one file is loaded and then process it directly
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    } 

    // Read the file contents and then update the text through a callback
    readFileContents(ev.dataTransfer.items[0].getAsFile(), function(result) {
        $('#drop_zone').text(JSON.parse(result).name);
        parseParchMintJson(JSON.parse(result));
    });
    
    // Pass event to removeDragData for cleanup
    removeDragData(ev)
}

// Function for reading and returning the contents of a file
function readFileContents(raw_file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) { callback(e.target.result); }
    reader.readAsText(raw_file)
}


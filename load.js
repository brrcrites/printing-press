const ParchmintParser = require('./parsing/parchmint-parser.js');
const paper = require('paper');
const Config = require('./utils/config.js');

var pp; // Parchmint Parser
var parchFile;
var nightMode = false;

$('.title_text').on('click', switchMode);
$('#file_button').on('click', fileButtonClickHandler);
$('#file_input').on('change', fileInputHandler);
$('#drop_zone').on('dragover', dragOverHandler)
               .on('drop', dropHandler)
               .on('dragleave', dragLeaveHandler);
$('#parse_button').on('click', parseButtonClickHandler);

// Prevent default drop behavior
function dragOverHandler(ev) {
    // Commented out because this function is called over and over as long as a file is dragged over the drop zone
    // console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    $(ev.target).css('background-color', 'powderblue');
}

function dragLeaveHandler(ev) {
    ev.preventDefault();
    $(ev.target).removeAttr('style');
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

    $(ev.target).removeAttr('style');
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

    // Save the dropped file until the user is ready to parse
    $('p.drop_text').text(dataTransfer.items[0].getAsFile().name);
    parchFile = dataTransfer.items[0].getAsFile();

    // Pass event to removeDragData for cleanup
    removeDragData(ev)
}

function fileButtonClickHandler() {
    $('#file_input').trigger('click');
}

function fileInputHandler(ev) {
    if (ev.target.files.length > 0) {
        $('p.drop_text').text(ev.target.files[0].name);
        parchFile = ev.target.files[0];
    } else {
        alert('No file selected!');
    }
}

function parseButtonClickHandler() {
    //Update the config if the user specified any values
    let x = parseInt($('#input-device-x').val());
    let y = parseInt($('#input-device-y').val());

    console.log('device input (x, y): (' + x + ', ' + y + ')');
    if (x) {
        Config.svg_drawing.maxX = x;
    }
    if (y) {
        Config.svg_drawing.maxY = y;
    }

    // Read the file contents and then update the text through a callback
    readFileContents(parchFile, function(result) {
        parseParchmint(result);
        console.log('device actual (x, y): (' + pp.architecture.xSpan + ', ' + pp.architecture.ySpan + ')');
    });
}

// Function for reading and returning the contents of a file
function readFileContents(raw_file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) { callback(e.target.result); };
    reader.readAsText(raw_file)
}

function parseParchmint(result) {
    // TODO: Clear all previous console and svg datas
    $('p.drop_text').text('Architecture: ' + JSON.parse(result)['name']);
    pp = new ParchmintParser();
    pp.parse(result);

    if (pp.valid) {
        console.log('Success! The Parchmint file is valid.');

        pp.architecture.layers.forEach(value => {
            $('#svg_image').append(value.name + ':<br><img src="data:image/svg+xml;utf8,'
                    + encodeURIComponent(value.print(pp.architecture.xSpan, pp.architecture.ySpan)) + '" alt="svg' +
                    ' image">');
        });
    }
}

function switchMode() {
    if (nightMode) {
        $('body').css({'background-color': 'white'});
        $('p').css({'color': 'black'});
    } else {
        $('body').css({'background-color': '#3A3938'});
        $('p').css({'color': 'white'});
    }

    nightMode = !nightMode;
}


var canvas;  
var ctx;
var encoder;
const size = 200;
var latestCanvas;
var encoder;
function initializeGifCreation(canvas, baseEncoder) {
    
    encoder = baseEncoder;
    encoder.setDelay(500);
    encoder.start(); // starts the encoder
}

function addCanvas(canvas) {
    ctx = canvas.getContext('2d'); // set the height and width of the canvas
    encoder.addFrame(ctx);
    latestCanvas = canvas;
    
}
function finish() {
    encoder.finish();
}
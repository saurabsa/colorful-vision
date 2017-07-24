// Define some variables to keep track of the mouse status 
var mouseX, mouseY, mouseDown = 0;

function sketchpad_mouseDown() {
  mouseDown = 1;
  drawDot(ctx, mouseX, mouseY);
}

function sketchpad_mouseUp() {
  mouseDown = 0;
}

function sketchpad_mouseMove(e) {
  // Update the mouse co-ordinates when moved
  getMousePos(e);

  // Draw a pixel if the mouse button is currently being pressed 
  if (mouseDown == 1) {
    drawDot(ctx, mouseX, mouseY);
  }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
  if (!e)
    var e = event;

  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
  else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
}
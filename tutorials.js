var tutorialMode = false;
var currentTutorial;
var currentTutorialIndex = 0;
var lastKnownCoord;
var tutorials = [];
var unit = 150;

//exports = module.exports;

// start the Tutorial
function startTutorial(canvas, ctx) {
  tutorialMode = true;

  // Initialize only the first time
  if (tutorials.length == 0) {
    initializeTutorials();
  }
  else {
    // Retrieve the most recently failed tutorial
    currentTutorialIndex = getLastFailedTutorial();
    if (currentTutorialIndex == -1) {
      setInstruction("All the tutorials are passed. Yayy!");
    }
  }
  currentTutorial = tutorials[currentTutorialIndex];
  setInstruction('Tutorial ' + (currentTutorialIndex + 1) + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
}

// start the Tutorial
function doTutorial(canvas, ctx, index) {
  tutorialMode = true;

  // Initialize only the first time
  if (tutorials.length == 0) {
    initializeTutorials();
  }
  else {
    if (tutorials.length > index) {
      // Retrieve the most recently failed tutorial
      currentTutorialIndex = index;
      if (currentTutorialIndex == -1) {
        setInstruction("All the tutorials are passed. Yayy!");
      }
    }

  }
  currentTutorial = tutorials[currentTutorialIndex];
  setInstruction('Tutorial ' + (currentTutorialIndex + 1) + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
}

function resetCounters() {
  tutorialMode = false;
  tutorials = [];
  currentTutorialIndex = 0;
  currentTutorial = null;
  lastKnownCoord = { x: -1, y: -1 };
}

// Reset the tutorials
function resetTutorials() {
  resetCounters();
  setInstruction("Tutorials reset. Restart the tutorials by clicking on 'Start Tutorials'.");
}

//exports.initializeTutorials = function initializeTutorials() {
function initializeTutorials() {
  // Horizontal line
  var tutorial = new Tutorial(1, "horizontal line", 1, "0", "h",
    "Move straight one unit from left to right",
    "The angle was not as accepted. Redraw a horizontal line.",
    "The length was not as accepted. Redraw a horizontal line.",
    "The orientation was not as accepted. Redraw a horizontal line.", false, 0);
  tutorials.push(tutorial);

  // Vertical line
  tutorial = new Tutorial(2, "vertical line", 1, "90", "v",
    "Move straight one unit from up to down",
    "The angle was not as accepted. Redraw a vertical line.",
    "The length was not as accepted. Redraw a vertical line.",
    "The orientation was not as accepted. Redraw a vertical line.", false, 0);
  tutorials.push(tutorial);

  // Left to right inclined line
  tutorial = new Tutorial(3, "inclined line", 1, "45", "dr",
    "Move inclined, 45 degrees, one unit from left down to right up",
    "The angle was not as accepted. Redraw an inclined line.",
    "The length was not as accepted. Redraw an inclined line.",
    "The orientation was not as accepted. Redraw an inclined line.", false, 0);
  tutorials.push(tutorial);

  // Right to left inclined line
  tutorial = new Tutorial(4, "inclined line", 1, "45", "dl",
    "Move inclined, 45 degrees, one unit from right down to left up",
    "The angle was not as accepted. Redraw an inclined line.",
    "The length was not as accepted. Redraw an inclined line.",
    "The orientation was not as accepted. Redraw an inclined line.", false, 0);
  tutorials.push(tutorial);

  // Connecting Points
  var con2 = new Tutorial(5.1, "connecting line 2", 1, "90", "v",
    "Move straight one unit from up to down from the connecting point",
    "The angle was not as accepted. Redraw a vertical line from the connecting point.",
    "The length was not as accepted. Redraw a vertical line from the connecting point.",
    "The orientation was not as accepted. Redraw a vertical line.", true, 0);
  var con1 = new Tutorial(5, "connecting line 1", 1, "45", "h",
    "Move straight one unit from left to right",
    "The angle was not as accepted. Redraw a horizontal line.",
    "The length was not as accepted. Redraw a horizontal line.",
    "The orientation was not as accepted. Redraw a horizontal line.", false, 0, con2);
  tutorials.push(con1);

  // Drawing arc with three connecting lines [inclined, straight and declined]
  // Arc - Declined line
  var arc3 = new Tutorial(6.2, "Arc line 3", 1, "45", "dl",
    "Move declined, 45 degrees, one unit from the start to right down",
    "The angle was not as accepted. Redraw a declined line.",
    "The length was not as accepted. Redraw a declined line.",
    "The orientation was not as accepted. Redraw a declined line.", true, 0);
  // Arc - Straight line
  var arc2 = new Tutorial(6.1, "Arc line 2", 1, "0", "h",
    "Move straight one unit from start to right",
    "The angle was not as accepted. Redraw a horizontal line.",
    "The length was not as accepted. Redraw a horizontal line.",
    "The orientation was not as accepted. Redraw a horizontal line.", true, 0, arc3);
  // Arc - Inclined line
  var arc1 = new Tutorial(6, "Arc line 1", 1, "45", "dr",
    "Move inclined, 45 degrees, one unit from left down to right up",
    "The angle was not as accepted. Redraw an inclined line.",
    "The length was not as accepted. Redraw an inclined line.",
    "The orientation was not as accepted. Redraw an inclined line.", false, 0, arc2);
  tutorials.push(arc1);

  //triangle
  var tri3 = new Tutorial(7.2, "Triangle line 3", 1, "45", "h",
    "Move straight one unit from left to right",
    "The angle was not as accepted. Redraw a horizontal line.",
    "The length was not as accepted. Redraw a horizontal line.",
    "The orientation was not as accepted. Redraw a horizontal line.", true, 0);
  var tri2 = new Tutorial(7.1, "Triangle line 2", 1, "45", "dr",
    "Move inclined, 45 degrees, one unit from right up to left down",
    "The angle was not as accepted. Redraw an inclined line from the connecting point.",
    "The length was not as accepted. Redraw an inclined line from the connecting point.",
    "The orientation was not as accepted. Redraw an inclined line.", true, 0, tri3);
  var tri1 = new Tutorial(7, "Triangle line 1", 1, "45", "dl",
    "Move inclined, 45 degrees, one unit from right down to left up",
    "The angle was not as accepted. Redraw an inclined line.",
    "The length was not as accepted. Redraw an inclined line.",
    "The orientation was not as accepted. Redraw an inclined line.", false, 0, tri2);
  tutorials.push(tri1);

  //square
  var sq4 = new Tutorial(8.3, "Square line 4", 1, "90", "v",
    "Move straight one unit from down to up",
    "The angle was not as accepted. Redraw a vertical line from the connecting point.",
    "The length was not as accepted. Redraw a vertical line from the connecting point.",
    "The orientation was not as accepted. Redraw a vertical line.", true, 0);
  var sq3 = new Tutorial(8.2, "Square line 3", 1, "0", "h",
    "Move straight one unit from right to left",
    "The angle was not as accepted. Redraw a horizontal line from the connecting point.",
    "The length was not as accepted. Redraw a horizontal line from the connecting point.",
    "The orientation was not as accepted. Redraw a horizontal line.", true, 0, sq4);
  var sq2 = new Tutorial(8.1, "Square line 2", 1, "90", "v",
    "Move straight one unit from up to down",
    "The angle was not as accepted. Redraw a vertical line from the connecting point.",
    "The length was not as accepted. Redraw a vertical line from the connecting point.",
    "The orientation was not as accepted. Redraw a vertical line.", true, 0, sq3);
  var sq1 = new Tutorial(8, "Square line 1", 1, "0", "h",
    "Move straight one unit from left to right",
    "The angle was not as accepted. Redraw a horizontal line.",
    "The length was not as accepted. Redraw a horizontal line.",
    "The orientation was not as accepted. Redraw a horizontal line.", false, 0, sq2);
  tutorials.push(sq1);

  return tutorials;
}

function getLastFailedTutorial() {
  // Iterate over the tutorials and get the last failed one in the list
  for (i = 0; i < tutorials.length; i++) {
    if (tutorials[i].score == 0) {
      return i;
    }
  }

  // When all the tutorials are already passed
  return -1;
}

function tutorialModeCheck() {
  if (tutorialMode && currentTutorial.score == 0) {
    return true;
  }
}

function getSlope(stack, retAbs = false) {
  denom = stack[stack.length - 1].x - stack[0].x;
  if (denom == 0) {
    throw new Error('Invalid dividend');
  }
  slope = (stack[stack.length - 1].y - stack[0].y) / denom;

  return retAbs ? Math.abs(slope) : slope;
}

function checkOrientation(stack) {
  if (currentTutorial.orientation == "h") {
    if (Math.abs(stack[stack.length - 1].x - stack[0].x) > Math.abs(stack[stack.length - 1].y - stack[0].y)) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (currentTutorial.orientation == "v") {
    if (Math.abs(stack[stack.length - 1].x - stack[0].x) < Math.abs(stack[stack.length - 1].y - stack[0].y)) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (currentTutorial.orientation == "dl") {
    // Returns the absolute slope
    slope = getSlope(stack);

    if (slope < 0) {
      // If negative slope, then wrong direction
      setInstruction("Line should be drawn from right down to left up. ");
      return false;
    }

    if (slope >= 0.75 && slope <= 1.25) {
      return true;
    }
    else {
      if (slope < 0.75) {
        setInstruction("Line too low. Increase the angle of inclination. ");
      }
      else {
        setInstruction("Line too high. Decrease the angle of inclination. ");
      }
      return false;
    }
  }
  else if (currentTutorial.orientation == "dr") {
    // Returns the absolute slope
    slope = getSlope(stack);

    if (slope > 0) {
      // If positive slope, then wrong direction
      setInstruction("Line should be drawn from left down to right up. ");
      return false;
    }

    if (slope >= -1.25 && slope <= -0.75) {
      return true;
    }
    else {
      if (slope < -1.25) {
        setInstruction("Line too high. Increase the angle of inclination. ");
      }
      else {
        setInstruction("Line too low. Decrease the angle of inclination. ");
      }
      return false;
    }
  }
}

function acceptableLength(length) {
  var xunit = currentTutorial.length * unit;
  if (length == xunit) {
    return true;
  }
  var diff = 0
  if (length > xunit) {
    diff = length - xunit;
  }
  else {
    diff = xunit - length;
  }
  var range = 20 / 100 * xunit;
  if (diff > range) {
    return false;
  }
  else {
    return true;
  }
}

function checkForTutorialScore(stack) {
  if (!tutorialModeCheck()) {
    // Return if this is not tutorial
    return;
  }

  if (!acceptableLength(stack.length)) {
    setInstruction(currentTutorial.length_error_instructions + ' Clearing last line');
    currentTutorial.score = 0;
    undo(canvas, ctx);
    return;
  }
  else {
    currentTutorial.score = 1;
  }

  if (!checkOrientation(stack)) {
    setInstruction(currentTutorial.orientation_error_instructions + ' Clearing last line');
    currentTutorial.score = 0;
    undo(canvas, ctx);
    return;
  }
  else {
    currentTutorial.score = 1;
  }

  if (currentTutorial.score == 1) {
    if (currentTutorial.nextTutorial) {
      currentTutorial = currentTutorial.nextTutorial;
      lastKnownCoord = { x: stack[stack.length - 1].x, y: stack[stack.length - 1].y };
      setInstruction('Success! Tutorial ' + currentTutorial.id + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
    }
    else {
      setInstruction('Success!');

      // Smoothen if it's an arc
      if (currentTutorial.name == 'Arc line 3') {
        smoothenArc();
      }

      resetCounters();
    }
  }
  else {
    setInstruction('Again Tutorial ' + currentTutorial.id + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
  }
}

function checkIfCoordInRange(mouseX, mouseY, lastPoint) {
  var xdiff = 0;
  if (mouseX > lastPoint.x) {
    xdiff = mouseX - lastPoint.x;
  }
  else {
    xdiff = lastPoint.x - mouseX;
  }
  var ydiff = 0;
  if (mouseY > lastPoint.y) {
    ydiff = mouseY - lastPoint.y;
  }
  else {
    ydiff = lastPoint.y - mouseY;
  }
  if (xdiff <= 10 && ydiff <= 10) {
    setInstruction('');
    return true;
  }
  else {
    if ((mouseX - lastPoint.x) > 10) {
      setInstruction('Move Left for the connecting point');
      return false;
    }
    else if ((lastPoint.x - mouseX) > 10) {
      setInstruction('Move Right for the connecting point');
      return false;
    }
    if ((mouseY - lastPoint.y) > 10) {
      setInstruction('Move Up for the connecting point');
      return false;
    }
    else if ((lastPoint.y - mouseY) > 10) {
      setInstruction('Move Down for the connecting point');
      return false;
    }
  }
}

function checkForLineLength(stack) {
  var xunit = currentTutorial.length * unit;
  if (tutorialModeCheck() && stack.length === xunit) {
    setInstruction('stop');
  }
}

function checkForContinuePointMode(mouseX, mouseY) {
  if (tutorialModeCheck() && currentTutorial.continueFromLast) {
    drawMode = false;
    document.getElementById("mode").innerText = "Current Mode: Placement";
    if (checkIfCoordInRange(mouseX, mouseY, lastKnownCoord)) {
      drawMode = true;
      document.getElementById("mode").innerText = "Current Mode: Draw";
    }
  }
}

class Tutorial {
  constructor(id, name, length, angle, orientation, draw_instructions, angle_error_instructions,
    length_error_instructions, orientation_error_instructions, continueFromLast, score, nextTutorial) {
    this.id = id;
    this.name = name;
    this.length = length;
    this.angle = angle;
    this.orientation = orientation;
    this.draw_instructions = draw_instructions;
    this.angle_error_instructions = angle_error_instructions;
    this.length_error_instructions = length_error_instructions;
    this.orientation_error_instructions = orientation_error_instructions;
    this.continueFromLast = continueFromLast;
    this.score = score;
    this.nextTutorial = nextTutorial;
  }
}
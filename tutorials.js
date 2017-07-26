var tutorialMode = false;
var currentTutorial;
var currentTutorialIndex = 0;
var tutorials = [];
var unit = 150;

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
      setInstruction("All the tutorials are passed. Yayy.. :-)");
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
}

// Reset the tutorials
function resetTutorials() {
  resetCounters();
  setInstruction("Tutorials reset. Restart the tutorials by clicking on 'Start Tutorials'.");
}

function initializeTutorials() {

  // Horizontal line
  var tutorial = new Tutorial("horizontal line", "1", "0", "h",
    "Move straight one unit from left to right on start",
    "The angle was not as accepted. Redraw a horizontal line.",
    "The length was not as accepted. Redraw a horizontal line.",
    "The orientation was not as accepted. Redraw a horizontal line.", 0);
  tutorials.push(tutorial);

  // Vertical line
  tutorial = new Tutorial("vertical line", "1", "90", "v",
    "Move straight one unit from up to down on start",
    "The angle was not as accepted. Redraw a vertical line.",
    "The length was not as accepted. Redraw a vertical line.",
    "The orientation was not as accepted. Redraw a vertical line.", 0);
  tutorials.push(tutorial);

  // Left to right inclined line
  tutorial = new Tutorial("inclined line", "1", "45", "dr",
    "Move inclined, 45 degrees, one unit from left down to right up on start",
    "The angle was not as accepted. Redraw an inclined line.",
    "The length was not as accepted. Redraw an inclined line.",
    "The orientation was not as accepted. Redraw an inclined line.", 0);
  tutorials.push(tutorial);

  // Right to left inclined line
  tutorial = new Tutorial("inclined line", "1", "45", "dl",
    "Move inclined, 45 degrees, one unit from right down to left up on start",
    "The angle was not as accepted. Redraw an inclined line.",
    "The length was not as accepted. Redraw an inclined line.",
    "The orientation was not as accepted. Redraw an inclined line.", 0);
  tutorials.push(tutorial);
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
    if ((stack[stack.length - 1].x - stack[0].x) > (stack[stack.length - 1].y - stack[0].y)) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (currentTutorial.orientation == "v") {
    if ((stack[stack.length - 1].x - stack[0].x) < (stack[stack.length - 1].y - stack[0].y)) {
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
  if (length == unit) {
    return true;
  }
  var diff = 0
  if (length > unit) {
    diff = length - unit;
  }
  else {
    diff = unit - length;
  }
  var range = 20 / 100 * unit;
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
    setInstruction(currentTutorial.length_error_instructions);
    currentTutorial.score = 0;
    return;
  }
  else {
    currentTutorial.score = 1;
  }

  if (!checkOrientation(stack)) {
    appendInstruction(currentTutorial.orientation_error_instructions);
    currentTutorial.score = 0;
    return;
  }
  else {
    currentTutorial.score = 1;
  }

  if (currentTutorial.score == 1) {
    if (tutorials.length > currentTutorialIndex + 1) {
      currentTutorial = tutorials[++currentTutorialIndex];
      setInstruction('Success! Tutorial ' + (currentTutorialIndex + 1) + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
    }
    else {
      setInstruction('Success!');
      resetCounters();
    }
  }
  else {
    setInstruction('Again Tutorial ' + (currentTutorialIndex + 1) + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
  }

}

function checkForLineLength(stack) {
  if (tutorialModeCheck() && stack.length >= unit) {
    setInstruction('stop');
  }
}

class Tutorial {
  constructor(name, length, angle, orientation, draw_instructions, angle_error_instructions, length_error_instructions, orientation_error_instructions, score) {
    this.name = name;
    this.length = length;
    this.angle = angle;
    this.orientation = orientation;
    this.draw_instructions = draw_instructions;
    this.angle_error_instructions = angle_error_instructions;
    this.length_error_instructions = length_error_instructions;
    this.orientation_error_instructions = orientation_error_instructions;
    this.score = score;
  }
}
var tutorialMode = false;
var currentTutorial;
var currentTutorialIndex = 0;
var tutorials = [];
var unit = 100;

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
  var tutorial = new Tutorial("horizontal line", "1", "0", "h",
    "Move straight one unit from left to right on start",
    "The angle was not as accepted. Draw a horizontal line.",
    "The length was not as accepted. Draw a horizontal line.",
    "The orientation was not as accepted. Draw a horizontal line.", 0);
  tutorials.push(tutorial);

  tutorial = new Tutorial("vertical line", "1", "90", "v",
    "Move straight one unit from up to down on start",
    "The angle was not as accepted. Draw a vertical line.",
    "The length was not as accepted. Draw a vertical line.",
    "The orientation was not as accepted. Draw a vertical line.", 0);
  tutorials.push(tutorial);

  tutorial = new Tutorial("inclined line", "1", "45", "d",
    "Move inclined (~45 degrees) one unit from left down to right up on start",
    "The angle was not as accepted. Draw an inclined line.",
    "The length was not as accepted. Draw an inclined line.",
    "The orientation was not as accepted. Draw an inclined line.", 0);
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
  else if (currentTutorial.orientation == "d") {
    // Returns the absolute slope
    slope = getSlope(stack, true);
    if (slope >= 0.75 && slope <= 1.25) {
      return true;
    }
    else {
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
    setInstruction(currentTutorial.orientation_error_instructions);
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
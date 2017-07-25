var tutorialMode = false;
var currentTutorial;
var currentTutorialIndex = 0;
var tutorials = [];
var unit = 100;

// start the Tutorial
function startTutorial(canvas, ctx) {
  tutorialMode = true;
  initializeTutorials();
  if (tutorials.length > 0) {
    currentTutorial = tutorials[currentTutorialIndex++];
  }
  setInstruction('Tutorial ' + currentTutorialIndex + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
}

function initializeTutorials() {
  var tutorial = new Tutorial("horizontal line", "1", "0", "h", "Move straight one unit from left to right on start", "The angle was not as accepted. Draw a horizontal line.", "The length was not as accepted. Draw a horizontal line.", "The orientation was not as accepted. Draw a horizontal line.", 0);
  tutorials.push(tutorial);
  tutorial = new Tutorial("vertical line", "1", "90", "v", "Move straight one unit from up to down on start", "The angle was not as accepted. Draw a vertical line.", "The length was not as accepted. Draw a vertical line.", "The orientation was not as accepted. Draw a vertical line.", 0);
  tutorials.push(tutorial);
}

function tutorialModeCheck() {
  if (tutorialMode && currentTutorial.score == 0) {
    return true;
  }
}

function showTutorialList(evt) {
  //var tutorials = ["./tutorials/horizontalLine.json"];
  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }
  var file = new File([""], "./tutorials/horizontalLine.json");
  var fr = new FileReader();
  var newArr = '';
  fr.onload = function (event) {
    // The file's text will be printed here
    console.log(event.target.result)
    var lines = event.target.result;
    newArr = JSON.parse(lines);
  };
  fr.readAsText(file);
  return newArr;
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
  if (tutorialModeCheck()) {
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
      if (tutorials.length > currentTutorialIndex) {
        currentTutorial = tutorials[currentTutorialIndex++];
        setInstruction('Success! Tutorial ' + currentTutorialIndex + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
      }
      else {
        setInstruction('Success!');
        tutorialMode = false;
      }
    }
    else {
      setInstruction('Again Tutorial ' + currentTutorialIndex + " " + currentTutorial.name + " " + currentTutorial.draw_instructions);
    }
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
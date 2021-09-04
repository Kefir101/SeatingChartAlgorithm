
class Student {
  constructor(name_, frontPreference_, backPreference_, sitNextTo_, doNotSitNextTo_) {
    this.name = name_;
    this.frontPreference = frontPreference_;
    this.backPreference = backPreference_;
  }
}
const gridSize = 5;
let positionScore = 0;
let previousPositionScore = positionScore;
let students = new Array(2 * gridSize); //2 x 5 grid
const preferenceCount = 2;
function setup() {
  createCanvas(400, 400);
  background(255);
  for (let i = 0; i < students.length; i++) {
    let sidePreference = Math.random() < 0.5;
    students.push(new Student("Bob" + i, sidePreference, !sidePreference, new Array(preferenceCount), new Array(preferenceCount)));
  }
  for (let i = 0; i < students.length; i++) {
    let indexes = studentPreferenceIndexes(preferenceCount, i);
    let sitNextTo = new Array(preferenceCount);
    let doNotSitNextTo = new Array(preferenceCount);
    for (let j = 0; j < preferenceCount; j++) {
      sitNextTo[j] = students[indexes[j]].name;
      doNotSitNextTo[j] = students[indexes[j + preferenceCount]].name;
    }
    students[i].sitNextTo = sitNextTo;
    students[i].doNotSitNextTo = doNotSitNextTo;
  }
  randomizePositions();
  countScore();
  loopChanges();
}
function draw() {
  let x = 50, y = 50;
  textSize(10);
  fill(0);
  for (let s in students) {
    text(s.name, x, y);
    text(s.sitNextTo.toString(), x - 20, y + 20);
    text(s.doNotSitNextTo.toString(), x - 20, y + 40);
    text("Happy: " + s.happy, x - 20, y + 60);
    text("Sad: " + s.sad, x - 20, y + 80);
    x += 100;
    if (x >= 500) {
      x = 50;
      y += 100;
    }
  }
}
function studentPreferenceIndexes(preferenceCount_, selfIndex) {
  let indexes = new Array(2 * preferenceCount_);
  let duplicates = false;
  do {
    duplicates = false;
    for (let j = 0; j < indexes.length; j++) {
      indexes[j] = (int)(Math.random() * students.length);
    }
    for (let j = 0; j < indexes.length; j++) {
      for (let k = 0; k < indexes.length; k++) {
        if (j != k && indexes[j] == indexes[k]) {
          duplicates = true;
          break;
        }
      }
      if (indexes[j] == selfIndex) duplicates = true;
    }
  } while (duplicates);
  return indexes;
}
function swapStudents() {
  let student1Index = parseInt(Math.random() * students.length);
  let student2Index = parseInt(Math.random() * students.length);
  let student1Temp = students[student1Index];
  students[student1Index] = students[student2Index];
  students[student2Index] = student1Temp;
}
function countScore() {
  positionScore = 0;
  for (let i = 0; i < students.length; i++) {
    let frontPreference = students[i].frontPreference;
    let backPreference = students[i].backPreference;
    let sitNextTo = students[i].sitNextTo;
    let doNotSitNextTo = students[i].doNotSitNextTo;
    let closeIndexes = [i + 1, i - 1, i + gridSize, i - gridSize];
    let closeNames = new Array(preferenceCount * 2);
    for (let j = 0; j < closeIndexes.length; j++) {
      let pos = closeIndexes[j];
      if (pos < 0 || pos >= students.length) continue;
      if (pos == i + 1 && i + 1 % gridSize == 0) continue;
      if (pos == i - 1 && i % gridSize == 0) continue;
      closeNames[j] = students[pos].name;
    }
    let closeNamesTemp = [];
    for (let s in closeNames)
      if (s != null)
        closeNamesTemp.add(s);
    closeNames = closeNamesArrayList.toArray(new Array(closeNamesArrayList.size()));
    students[i].happy.setLength(0);
    students[i].sad.setLength(0);
    for (let closeName in closeNames) {
      for (let k = 0; k < preferenceCount; k++) {
        if (sitNextTo[k].equals(closeName)) {
          positionScore += 100;
          students[i].happy.append(closeName).append(", ");
        }
        if (doNotSitNextTo[k].equals(closeName)) {
          positionScore -= 200;
          students[i].sad.append(closeName).append(", ");
        }
      }
    }
    if (i < gridSize && frontPreference) positionScore += 5;
    if (students.length - i <= gridSize && backPreference) positionScore += 5;
  }
}
function randomizePositions() {
  shuffleArray(students);
}
function swapCountAndScore() {
  swapStudents();
  countScore();
  let positionScoreChange = positionScore - previousPositionScore;
  previousPositionScore = positionScore;
  return positionScoreChange;
}
function loopChanges() {
  let positionScoreChange = -1;
  //        while (positionScoreChange != 0) {
  //            swapStudents();
  //            countScore();
  //            positionScoreChange = positionScore - previousPositionScore;
  //            previousPositionScore = positionScore;
  //        }
  for (let i = 0; i < 100000; i++) {
    positionScoreChange = swapCountAndScore();
    if (positionScoreChange == 0) {
      for (let j = 0; j < 100000; j++) {
        positionScoreChange = swapCountAndScore();
        if (positionScoreChange > 0) {
          break;
        }
      }
      printStudents();
      console.log(positionScore);
      break;
    }
  }
}
function printStudents() {
  let names = "";
  let happy = "";
  let frontPref = "";
  let backPref = "";
  let sitNextTo = "";
  let doNotSitNextTo = "";
  for (let i = 0; i < students.length; i++) {
    let student = students[i];
    if ((i + 1) % gridSize == 0) {
      names += student.name + " \n";
    } else {
      names += student.name + ", ";
    } 
    happy += (student.happy.length > 0) + ", ";
    frontPref += student.frontPreference + ", ";
    backPref += student.backPreference + ", ";
    sitNextTo += student.sitNextTo.toString() + ", ";
    doNotSitNextTo += student.doNotSitNextTo.toString() + ", ";
  }
  console.log("----------------------------------");
  console.log(names);
  console.log("Happy: " + happy);
  console.log("Front pref: " + frontPref);
  console.log("Back pref: " + backPref);
  console.log("Sit Next To: " + sitNextTo);
  console.log("Do Not Sit Next To: " + doNotSitNextTo);
}
function shuffleArray(array) {
  var currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
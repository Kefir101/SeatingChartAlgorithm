const gridSize = 5;
let positionScore = 0;
let previousPositionScore = positionScore;
let students = []; //2 x 5 grid
let studentCount = 2 * gridSize;
const preferenceCount = 2;
class Student {
  constructor(name_, frontPreference_, backPreference_, sitNextTo_, doNotSitNextTo_) {
    this.name = name_;
    this.frontPreference = frontPreference_;
    this.backPreference = backPreference_;
    this.sitNextTo = sitNextTo_;
    this.doNotSitNextTo = doNotSitNextTo_;
    this.happy = "";
    this.sad = "";
  }
}
function setup() {
  createCanvas(1000, 1000);
  for (let i = 0; i < studentCount; i++) {
    let sidePreference = Math.random() < 0.5;
    students.push(new Student("Bob" + i, sidePreference, !sidePreference, new Array(preferenceCount), new Array(preferenceCount)));
  }
  for (let i = 0; i < studentCount; i++) {
    let student = students[i];
    let indexes = studentPreferenceIndexes(preferenceCount, i);
    for (let j = 0; j < preferenceCount; j++) {
      student.sitNextTo[j] = students[indexes[j]].name;
      student.doNotSitNextTo[j] = students[indexes[j + preferenceCount]].name;
    }
  }
  shuffleStudents();
  countScore();
  loopChanges();
}
function draw() {
  let x = 50, y = 50;
  fill(255, 0, 0);
  rect(0, 0, 500, 300);
  textSize(10);
  stroke(0);
  fill(0)
  for (let i = 0; i < students.length; i++) {
    let student = students[i]
    text(student.name, x, y);
    text(student.sitNextTo, x - 20, y + 20);
    text(student.doNotSitNextTo, x - 20, y + 40);
    text("Happy: " + student.happy, x - 20, y + 60);
    text("Sad: " + student.sad, x - 20, y + 80);
    x += 100;
    if (x >= 500) {
      x = 50;
      y += 100;
    }
  }
  noLoop();
}
function studentPreferenceIndexes(preferenceCount_, selfIndex) {
  let indexes = [];
  let indexesLengh = 2 * preferenceCount_;
  let duplicates = false;
  do {
    duplicates = false;
    indexes = [];
    for (let j = 0; j < indexesLengh; j++) {
      indexes.push(Math.trunc(Math.random() * students.length));
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
    let s = students[i];
    let frontPreference = s.frontPreference;
    let backPreference = s.backPreference;
    let sitNextTo = s.sitNextTo;
    let doNotSitNextTo = s.doNotSitNextTo;
    let closeIndexes = [i + 1, i - 1, i + gridSize, i - gridSize];
    let closeNames = [];
    let nameCount = preferenceCount * 2;
    for (let j = 0; j < closeIndexes.length; j++) {
      let pos = closeIndexes[j];
      if (pos < 0 || pos >= students.length) continue;
      if (pos == i + 1 && i + 1 % gridSize == 0) continue;
      if (pos == i - 1 && i % gridSize == 0) continue;
      closeNames.push(students[pos].name);
      if (closeNames.length == 2) break;
    }
    // let closeNamesTemp = [];
    // for (let j = 0; j < nameCount; j++)
    //   if (closeNames[j] != null)
    //     closeNamesTemp.push(closeNames[j]);
    // closeNames = closeNamesTemp;
    s.happy = "";
    s.sad = "";
    for (let j = 0; j < closeNames.length; j++) {
      let closeName = closeNames[j];
      if (sitNextTo.includes(closeName)) {
        positionScore += 100;
        s.happy += closeName + ", ";
      } else if (doNotSitNextTo.includes(closeName)) {
        positionScore -= 200;
        s.sad += closeName + ", ";
      }
    }
    if (i < gridSize && frontPreference) positionScore += 5;
    if (students.length - i <= gridSize && backPreference) positionScore += 5;
  }
}
function swapCountAndScore() {
  swapStudents();
  countScore();
  let positionScoreChange = positionScore - previousPositionScore;
  previousPositionScore = positionScore;
  return positionScoreChange;
}
function loopChanges() {

  let storeStudents = [];
  let storeScores = [];

  for (let i = 0; i < 100000; i++) {
    shuffleStudents();
    countScore();
    let studentKey = [];
    for (let j = 0; j < students.length; j++) studentKey.push(Object.assign({}, students[j]))
    storeStudents.push(studentKey);
    storeScores.push(positionScore);
  }
  var indexOfMaxValue = storeScores.reduce((iMax, x, i, storeScores) => x > storeScores[iMax] ? i : iMax, 0); //google
  students = storeStudents[indexOfMaxValue];
  console.log(storeScores[indexOfMaxValue])
  printStudents(storeStudents[indexOfMaxValue])

}
function printStudents(students_) {
  let names = "", happy = "", frontPref = "", backPref = "", sitNextTo = "", doNotSitNextTo = "";
  for (let i = 0; i < students_.length; i++) {
    let student = students_[i];
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
function shuffleStudents() {
  var currentIndex = students.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [students[currentIndex], students[randomIndex]] = [
      students[randomIndex], students[currentIndex]];
  }
}
// let positionScoreChange = -1;

// while (positionScoreChange != 0) {
//   swapStudents();
//   countScore();
//   positionScoreChange = positionScore - previousPositionScore;
//   previousPositionScore = positionScore;
// }
// let storeStudents = [];
// let iterations = 1000;
// for (let i = 0; i < 100000; i++) {
//   positionScoreChange = swapCountAndScore();
//   for (let j = 0; j < iterations; j++) { //run loop again
//     positionScoreChange = swapCountAndScore();
//     if (positionScoreChange > 0) { //if for that entire loop not a single arrangment is better
//       storeStudents = students;
//       break; //restart if isn't the best
//     }
//     if (j == iterations - 1) {
//       printStudents(storeStudents);
//       console.log(positionScore);
//       break;
//     }
//   }
// }
// let studentsAndScoresDist = {};
// let testing = [[]];
// for (let i = 0; i < 5; i++) {
//   shuffleStudents();
//   countScore();
//   let studentKey = [];
//   for (let j = 0; j < students.length; j++) studentKey.push(Object.assign({}, students[j]))
//   studentsAndScoresDist[studentKey] = positionScore;
//   testing.push(studentKey);
// }
// console.log(testing)
// console.log(Object.values(studentsAndScoresDist))
// console.log(Object.keys(studentsAndScoresDist).length)
// let maxStudent = students, maxScore = 0;
// for (const [key, value] of Object.entries(studentsAndScoresDist)) {
//   if (value > maxScore) {
//     maxStudent = key;
//     maxScore = value;
//   }
// }
// console.log(maxStudent)
// console.log(maxScore)
// printStudents(maxStudent)
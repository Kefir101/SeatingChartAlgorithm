const gridSize = 8;
const width = 4;
const studentCount = width * gridSize;
const preferenceCount = 2;
let students = []; 
let seatingChartScore = 0;
// let previousPositionScore = seatingChartScore;
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
  createCanvas(window.innerWidth, window.innerHeight);
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
  countSeatingChartScore();
  findOptimalSeatingChart();
}
function draw() {
  let scale = 2;
  let x = window.innerWidth-gridSize*100*scale - 3*50, y = 25;
  let xReset = x;
  let spacing = 20 * scale;
  fill(255, 0, 0);
  rect(0, 0, window.innerWidth*0.99, window.innerHeight*0.99);
  stroke(0);
  fill(0)
  for (let i = 0; i < students.length; i++) {
    let student = students[i]
    textSize(12 * scale);
    text(student.name, x, y);
    textSize(8 * scale);
    text("Likes: " + student.sitNextTo, x - spacing, y + spacing);
    text("Hates: " + student.doNotSitNextTo, x - spacing, y + spacing * 2);
    text("Happy: " + student.happy, x - spacing, y + spacing * 3);
    text("Sad: " + student.sad, x - spacing, y + spacing * 4);
    // console.log("x: " + x + ", y: " + y + ", name: " + student.name);
    x += 100 * scale;
    if ((i + 1) % gridSize == 0) {
      x = xReset;
      y += 100 * scale;
    }
  }
  let frontYPos = 100*scale;
  let backYPos = 100*scale*(width-1);
  stroke(0, 255, 0)
  strokeWeight(3);
  line(0, frontYPos, window.innerWidth*0.99, frontYPos);
  stroke(0, 0, 255)
  line(0, backYPos, window.innerWidth*0.99, backYPos);
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
function countSeatingChartScore() {
  seatingChartScore = 0;
  for (let i = 0; i < students.length; i++) {
    let s = students[i];
    let closeIndexes = [i + 1, i - 1, i + gridSize, i - gridSize];
    let closeNames = [];
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
      if (s.sitNextTo.includes(closeName)) {
        seatingChartScore += 100;
        s.happy += closeName + ", ";
      } else if (s.doNotSitNextTo.includes(closeName)) {
        seatingChartScore -= 200;
        s.sad += closeName + ", ";
      }
    }
    if (i < gridSize && s.frontPreference) seatingChartScore += 5;
    if (students.length - i <= gridSize && s.backPreference) seatingChartScore += 5;
  }
}
function findOptimalSeatingChart() {
  var t0 = performance.now()

  let bestSeatingChart = students;
  let bestSeatingChartScore = 0;
  for (let i = 0; i < 100000; i++) {
    shuffleStudents();
    countSeatingChartScore();
    let currentSeatingChart = [];
    for (let j = 0; j < students.length; j++) currentSeatingChart.push(Object.assign({}, students[j]))
    if(seatingChartScore > bestSeatingChartScore){
      bestSeatingChart = currentSeatingChart;
      bestSeatingChartScore = seatingChartScore;
    }
  }
  students = bestSeatingChart;
  console.log(bestSeatingChartScore)
  printStudents(students)

  var t1 = performance.now()
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
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
  // console.log("Happy: " + happy);
  // console.log("Front pref: " + frontPref);
  // console.log("Back pref: " + backPref);
  // console.log("Sit Next To: " + sitNextTo);
  // console.log("Do Not Sit Next To: " + doNotSitNextTo);
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
//   positionScoreChange = seatingChartScore - previousPositionScore;
//   previousPositionScore = seatingChartScore;
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
//       console.log(seatingChartScore);
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
//   studentsAndScoresDist[studentKey] = seatingChartScore;
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
  // let studentsAndScoresMap = new Map(); 
  // for (let i = 0; i < 100000; i++) {
  //   shuffleStudents();
  //   countScore();
  //   let studentKey = [];
  //   for (let j = 0; j < students.length; j++) studentKey.push(Object.assign({}, students[j]))
  //   studentsAndScoresMap.set(studentKey, seatingChartScore);
  // }
  // console.log(studentsAndScoresMap)
  // let max = [...studentsAndScoresMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a);
  // students = max[0];
  // let maxScore = max[1];
  // console.log(maxScore)
  // printStudents(students)
  // function swapStudentsAndCountSeatingChartScore() {
//   swapStudents();
//   countSeatingChartScore();
//   let positionScoreChange = seatingChartScore - previousPositionScore;
//   previousPositionScore = seatingChartScore;
//   return positionScoreChange;
// }
// function swapStudents() {
//   let student1Index = parseInt(Math.random() * students.length);
//   let student2Index = parseInt(Math.random() * students.length);
//   let student1Temp = students[student1Index];
//   students[student1Index] = students[student2Index];
//   students[student2Index] = student1Temp;
// }
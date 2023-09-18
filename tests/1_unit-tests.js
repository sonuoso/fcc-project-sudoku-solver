const chai = require("chai");
const assert = chai.assert;

const puzzleList = require("../controllers/puzzle-strings.js");
const puzzlesAndSolutions = puzzleList.puzzlesAndSolutions;
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  //#1
  test("Logic handles a valid puzzle string of 81 characters", function () {
    assert.equal(solver.validate(puzzlesAndSolutions[0][0]), "validPuzzle");
  });

  //#2
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
    assert.equal(
      solver.validate(
        "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      ),
      "invalidChar"
    );
  });

  //#3
  test("Logic handles a puzzle string that is not 81 characters in length", function () {
    assert.equal(
      solver.validate(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37"
      ),
      "invalidLength"
    );
  });

  //#4
  test("Logic handles a valid row placement", function () {
    assert.notEqual(
      solver.checkRowPlacement(puzzlesAndSolutions[0][0], "A", 4, "7"),
      "conflict"
    );
  });

  //#5
  test("Logic handles an invalid row placement", function () {
    assert.equal(
      solver.checkRowPlacement(puzzlesAndSolutions[0][0], "A", 4, "2"),
      "conflict"
    );
  });

  //#6
  test("Logic handles a valid column placement", function () {
    assert.notEqual(
      solver.checkColPlacement(puzzlesAndSolutions[0][0], "B", 2, "4"),
      "conflict"
    );
  });

  //#7
  test("Logic handles an invalid column placement", function () {
    assert.equal(
      solver.checkColPlacement(puzzlesAndSolutions[0][0], "B", 2, "2"),
      "conflict"
    );
  });

  //#8
  test("Logic handles a valid region (3x3 grid) placement", function () {
    assert.equal(
      solver.checkRegionPlacement(puzzlesAndSolutions[0][0], "B", 1, "8"),
      "validReg"
    );
  });

  //#9
  test("Logic handles an invalid region (3x3 grid) placement", function () {
    assert.equal(
      solver.checkRegionPlacement(puzzlesAndSolutions[0][0], "B", 1, "6"),
      "conflict"
    );
  });

  //#10
  test("Valid puzzle strings pass the solver", function () {
    assert.equal(solver.solve(puzzlesAndSolutions[0][0]).length, 81);
  });

  //#11
  test("Invalid puzzle strings fail the solver", function () {
    assert.equal(
      solver.solve(
        "b.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      ),
      "invalidChar"
    );
  });

  //#12
  test("Solver returns the expected solution for an incomplete puzzle", function () {
    assert.equal(
      solver.solve(puzzlesAndSolutions[0][0]),
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
    );
  });
});

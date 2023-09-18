"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let regexPattern = /^[A-I][1-9]$/;
    let regexValue = /[1-9]/;

    if (req.body.puzzle && req.body.coordinate && req.body.value) {
      if (solver.validate(req.body.puzzle) == "invalidLength") {
        res.send({ error: "Expected puzzle to be 81 characters long" });
      } else {
        if (solver.validate(req.body.puzzle) == "invalidChar") {
          res.send({ error: "Invalid characters in puzzle" });
        } else {
          let coordinate = req.body.coordinate;

          //Check if coordinate includes characters from A to I and digits from 1 to 9
          if (regexPattern.test(coordinate)) {
            //Check if req.body.value is equal to any digit from 1 to 9
            if (regexValue.test(req.body.value)) {
              let rowRes = solver.checkRowPlacement(
                req.body.puzzle,
                coordinate[0],
                coordinate[1],
                req.body.value
              );
              let colRes = solver.checkColPlacement(
                req.body.puzzle,
                coordinate[0],
                coordinate[1],
                req.body.value
              );
              let regRes = solver.checkRegionPlacement(
                req.body.puzzle,
                coordinate[0],
                coordinate[1],
                req.body.value
              );

              let rowColReg = [rowRes, colRes, regRes];
              let conflictPlace = ["row", "column", "region"];
              let conflict = [];

              //Push values from conflictPlace array respectively to returned conflict value in rowColReg array
              if (rowColReg.includes("conflict")) {
                for (let i = 0; i < rowColReg.length; i++) {
                  if (rowColReg[i] == "conflict") {
                    conflict.push(conflictPlace[i]);
                  }
                }
                res.send({ valid: false, conflict: conflict });
              } else {
                res.send({ valid: true });
              }
            } else {
              res.send({ error: "Invalid value" });
            }
          } else {
            res.send({ error: "Invalid coordinate" });
          }
        }
      }
    } else {
      res.send({ error: "Required field(s) missing" });
    }
  });

  app.route("/api/solve").post((req, res) => {
    if (req.body.puzzle) {
      let solution = solver.solve(req.body.puzzle);
      if (solution == "conflict") {
        res.send({ error: "Puzzle cannot be solved" });
      } else {
        if (solution == "invalidChar") {
          res.send({ error: "Invalid characters in puzzle" });
        } else {
          if (solution == "invalidLength") {
            res.send({ error: "Expected puzzle to be 81 characters long" });
          } else {
            if (solution.length == 81) {
              res.send({ solution: solution });
            }
          }
        }
      }
    } else {
      res.send({ error: "Required field missing" });
    }
  });
};

const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzle = require("../controllers/puzzle-strings.js");
const puzzlesAndSolutions = puzzle.puzzlesAndSolutions;

chai.use(chaiHttp);

suite("Functional Tests", () => {
  //#1
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzle.puzzlesAndSolutions[0][1]);
        done();
      });
  });

  //#2
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({ puzzle: null })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  //#3
  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  //#4
  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          ".5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  //#5
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          "125..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  //#6
  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A4", value: "7" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  //#7
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A4", value: "4" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });

  //#8
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "1" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  //#9
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "B1", value: "1" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  //#10
  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: null,
        values: null,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  //#11
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "1.a..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "B1",
        value: "9",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  //#12
  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "125..2.84..63.12.7.2..5....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37",
        coordinate: "A7",
        value: "9",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  //#13
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "Z1", value: "1" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  //#14
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A1", value: "0" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});

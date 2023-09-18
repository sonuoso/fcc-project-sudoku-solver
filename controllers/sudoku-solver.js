class SudokuSolver {
  validate(puzzleString) {
    let puzzleValid;

    //Check if puzzleString includes letters, spaces or digit 0 and its length is 81 and again if it includes other than digits from 1 to 9 or period (.)
    let regexPattern = /[a-zA-Z\" "0]/g;
    if (regexPattern.test(puzzleString)) {
      return "invalidChar";
    } else {
      if (puzzleString.length == 81) {
        let regexValid = /[^1-9][^.]/g;
        puzzleValid = regexValid.test(puzzleString);
        if (puzzleValid == true) {
          return "validPuzzle";
        } else {
          return "invalidChar";
        }
      } else {
        return "invalidLength";
      }
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //Create rows from puzzleString with different ranges of index as an object with properties from A to I
    let rowList = {
      A: Array.from(puzzleString.slice(0, 9)),
      B: Array.from(puzzleString.slice(9, 18)),
      C: Array.from(puzzleString.slice(18, 27)),
      D: Array.from(puzzleString.slice(27, 36)),
      E: Array.from(puzzleString.slice(36, 45)),
      F: Array.from(puzzleString.slice(45, 54)),
      G: Array.from(puzzleString.slice(54, 63)),
      H: Array.from(puzzleString.slice(63, 72)),
      I: Array.from(puzzleString.slice(72, 81)),
    };

    //Select the array from rowList object with row proerty
    let validRow = rowList[row];

    //Check if the validRow only includes one instance of digits from 1 to 9 and or periods (.)
    let regexPattern = /[1-9]?\./g;
    if (regexPattern.test(validRow)) {
      if (validRow.includes(value) == false) {
        if (validRow[column - 1] == value) {
          return "validRow";
        }
      } else {
        return "conflict";
      }
    } else {
      return "conflict";
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    //Create an object with rows as properties and indexes as values corresponding to their position
    let rowIndex = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8 };
    //Create an object with columns as lists and populate them from puzzleString according to their position
    let colList = {
      Col1: [],
      Col2: [],
      Col3: [],
      Col4: [],
      Col5: [],
      Col6: [],
      Col7: [],
      Col8: [],
      Col9: [],
    };
    for (let i = 0; i < puzzleString.length; i += 9) {
      colList.Col1.push(puzzleString[i]);
      colList.Col2.push(puzzleString[i + 1]);
      colList.Col3.push(puzzleString[i + 2]);
      colList.Col4.push(puzzleString[i + 3]);
      colList.Col5.push(puzzleString[i + 4]);
      colList.Col6.push(puzzleString[i + 5]);
      colList.Col7.push(puzzleString[i + 6]);
      colList.Col8.push(puzzleString[i + 7]);
      colList.Col9.push(puzzleString[i + 8]);
    }

    //Select the array from colList object with column property
    let validCol = colList["Col" + column];

    //Check if validCol includes only one instance of digits from 1 to 9 or periods (.)
    let regexPattern = /[1-9]?\./g;
    if (regexPattern.test(validCol)) {
      if (validCol.includes(value) == false) {
        if (validCol[rowIndex[row]] == value) {
          return "validCol";
        }
      } else {
        return "conflict";
      }
    } else {
      return "conflict";
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let p = puzzleString;
    //Create an array of objects that represent regions with coordinates in the puzzle as properties corresponding to their position
    let regList = [
      {
        A1: p[0],
        A2: p[1],
        A3: p[2],
        B1: p[9],
        B2: p[10],
        B3: p[11],
        C1: p[18],
        C2: p[19],
        C3: p[20],
      },
      {
        A4: p[3],
        A5: p[4],
        A6: p[5],
        B4: p[12],
        B5: p[13],
        B6: p[14],
        C4: p[21],
        C5: p[22],
        C6: p[23],
      },
      {
        A7: p[6],
        A8: p[7],
        A9: p[8],
        B7: p[15],
        B8: p[16],
        B9: p[17],
        C7: p[24],
        C8: p[25],
        C9: p[26],
      },
      {
        D1: p[27],
        D2: p[28],
        D3: p[29],
        E1: p[36],
        E2: p[37],
        E3: p[38],
        F1: p[45],
        F2: p[46],
        F3: p[47],
      },
      {
        D4: p[30],
        D5: p[31],
        D6: p[32],
        E4: p[39],
        E5: p[40],
        E6: p[41],
        F4: p[48],
        F5: p[49],
        F6: p[50],
      },
      {
        D7: p[33],
        D8: p[34],
        D9: p[35],
        E7: p[42],
        E8: p[43],
        E9: p[44],
        F7: p[51],
        F8: p[52],
        F9: p[53],
      },
      {
        G1: p[54],
        G2: p[55],
        G3: p[56],
        H1: p[63],
        H2: p[64],
        H3: p[65],
        I1: p[72],
        I2: p[73],
        I3: p[74],
      },
      {
        G4: p[57],
        G5: p[58],
        G6: p[59],
        H4: p[66],
        H5: p[67],
        H6: p[68],
        I4: p[75],
        I5: p[76],
        I6: p[77],
      },
      {
        G7: p[60],
        G8: p[61],
        G9: p[62],
        H7: p[69],
        H8: p[70],
        H9: p[71],
        I7: p[78],
        I8: p[79],
        I9: p[80],
      },
    ];

    //Check if regList includes only one instance of digits from 1 to 9 or periods (.)
    let regexPattern = /[1-9]?\./g;
    for (let i = 0; i < regList.length; i++) {
      if (row + column in regList[i]) {
        let regVal = Object.values(regList[i]);
        console.log(regVal);
        if (regexPattern.test(regVal)) {
          if (regVal.includes(value) == false) {
            return "validReg";
          } else {
            return "conflict";
          }
        } else {
          return "conflict";
        }
      }
    }
  }

  solve(puzzleString) {
    //Run validate function above with puzzleString as parameter and assign its result to validPuzzle variable
    let validPuzzle = this.validate(puzzleString);
    let emptyList = [];

    if (validPuzzle == "validPuzzle") {
      //Push the index of each period (.) found in the puzzleString into emptyList
      for (let i = 0; i < puzzleString.length; i++) {
        if (puzzleString[i] == ".") {
          emptyList.push(i);
        }
      }

      //Declare checkDup function to check if the given array includes any duplicate values
      function checkDup(puzzle) {
        let dupList = [];
        for (let char of puzzle) {
          if (dupList.includes(char)) {
            return false;
          } else {
            dupList.push(char);
          }
        }
        return true;
      }

      let regIndex = [
        [0, 1, 2, 9, 10, 11, 18, 19, 20],
        [3, 4, 5, 12, 13, 14, 21, 22, 23],
        [6, 7, 8, 15, 16, 17, 24, 25, 26],
        [27, 28, 29, 36, 37, 38, 45, 46, 47],
        [30, 31, 32, 39, 40, 41, 48, 49, 50],
        [33, 34, 35, 42, 43, 44, 51, 52, 53],
        [54, 55, 56, 63, 64, 65, 72, 73, 74],
        [57, 58, 59, 66, 67, 68, 75, 76, 77],
        [60, 61, 62, 69, 70, 71, 78, 79, 80],
      ];

      //Declare findExclusiveNums function to create an array populated with digits from 1 to 9 that are not present in the given array as the parameter
      function findExclusiveNums(array) {
        let validNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let arr = [];
        for (let i of validNum) {
          if (array.includes(i) == false) {
            arr.push(i);
          }
        }
        return arr;
      }

      //Declare solvePuzzle function to return a completed puzzleString as the solution
      function solvePuzzle(puzzleString) {
        //Convert puzzleString to a List from String
        puzzleString = puzzleString.split("");
        //Declare getObj function to create an object with increment value as property and character in puzzleString from value of the property as index
        function getObj(start, end, inc) {
          let obj = {};
          for (let i = start - 1; i < end; i += inc) {
            obj[i] = puzzleString[i];
          }
          return obj;
        }

        //Create an array of rows and columns from puzzleString with getObj function with given parameters (inc = increment value to select chracters as per their different positions in row, column and region)
        let rowCol = [
          getObj(1, 9, 1),
          getObj(10, 18, 1),
          getObj(19, 27, 1),
          getObj(28, 36, 1),
          getObj(37, 45, 1),
          getObj(46, 54, 1),
          getObj(55, 63, 1),
          getObj(64, 72, 1),
          getObj(73, 81, 1),
        ];

        let colRow = [
          getObj(1, 73, 9),
          getObj(2, 74, 9),
          getObj(3, 75, 9),
          getObj(4, 76, 9),
          getObj(5, 77, 9),
          getObj(6, 78, 9),
          getObj(7, 79, 9),
          getObj(8, 80, 9),
          getObj(9, 81, 9),
        ];

        let region = [];

        //Populate region array with objects as different regions from puzzleString
        for (let i = 0; i < regIndex.length; i++) {
          let regObj = {};
          for (let y = 0; y < regIndex[i].length; y++) {
            regObj[regIndex[i][y]] = puzzleString[regIndex[i][y]];
          }
          region.push(regObj);
        }

        //Loop over emptyList selecting one index at a time and check its availability corresponding to the index properties in every row, col and reg
        for (let emptyIndex of emptyList) {
          for (let row of rowCol) {
            if (emptyIndex in row) {
              for (let col of colRow) {
                if (emptyIndex in col) {
                  for (let reg of region) {
                    if (emptyIndex in reg) {
                      //Create strings from values of row, col and reg objects
                      let strRow = Object.values(row).join("");
                      let strCol = Object.values(col).join("");
                      let strReg = Object.values(reg).join("");

                      //Create lists from strRow, strCol and strReg after removing periods (.)
                      let listRow = strRow.replace(/\./g, "").split("");
                      let listCol = strCol.replace(/\./g, "").split("");
                      let listReg = strReg.replace(/\./g, "").split("");

                      //Check for any duplicate digits in listRow, listCol and listReg
                      let regexRow = checkDup(listRow);
                      let regexCol = checkDup(listCol);
                      let regexReg = checkDup(listReg);

                      if (regexRow && regexCol && regexReg) {
                        //Create lists of exclusive digits found in each listRow, listCol and listReg array if no duplicate digits are found
                        let exRow = findExclusiveNums(listRow);
                        let exCol = findExclusiveNums(listCol);
                        let exReg = findExclusiveNums(listReg);

                        let commonList = [];
                        //Populate commonList with common digits found in exRow, exCol and exReg
                        for (let num of exRow) {
                          if (exCol.includes(num) && exReg.includes(num)) {
                            commonList.push(num);
                          }
                        }

                        //Replace the value at emptyIndex in puzzleString, row, col and reg with common digit from commonList if length of commonList is 1
                        if (commonList.length == 1) {
                          puzzleString[emptyIndex] = commonList[0];
                          row[emptyIndex] = commonList[0];
                          col[emptyIndex] = commonList[0];
                          reg[emptyIndex] = commonList[0];
                        }
                      } else {
                        return "conflict";
                      }
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
        }
        return puzzleString.join("");
      }

      //Initialize solvePuzzle function with provided puzzleString
      let solution = solvePuzzle(puzzleString);
      if (solution != "conflict") {
        let puzzleLength = solution.replace(/\./g, "").length;

        //Run solvePuzzle function with previously returned puzzleString as the argument until its length without period (.) character is equal to 81
        while (puzzleLength < 81) {
          solution = solvePuzzle(solution);
          puzzleLength = solution.replace(/\./g, "").length;
        }
      }

      return solution;
    } else {
      return validPuzzle;
    }
  }
}

module.exports = SudokuSolver;

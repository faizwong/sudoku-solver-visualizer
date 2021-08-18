import React, { useState } from 'react';
import './App.css';

import definedBoards from './Boards';

function App() {

  const [boards] = useState(definedBoards);
  const [boardIndex, setBoardIndex] = useState(0);
  const [showNew, setShowNew] = useState(false);

  const changeBoard = () => {
    // https://stackoverflow.com/questions/8860188/javascript-clear-all-timeouts
    let id = window.setTimeout(function() {}, 0);
    while (id--) {
      window.clearTimeout(id);
    }

    const nextBoardIndex = boardIndex + 1 === 4 ? 0 : boardIndex + 1;

    const elements = []
    boards[nextBoardIndex].forEach((row) => {
      row.forEach(item => {
        elements.push(item);
      })
    });

    for (let i = 0; i < 81; i++) {
      document.getElementById(`${i}`).style.background = 'white';
      document.getElementById(`${i}`).innerText = elements[i] === 0 ? '' : elements[i];
    }

    setBoardIndex(nextBoardIndex);
    setShowNew(false);
  }

  const createRow = (rowNumber) => {
    const range = [];
    for (let i = 0; i < 9; i++) {
      range.push(i);
    }
    return range.map(item => {
      return <td id={`${(rowNumber * 9) + item}`} key={`${(rowNumber * 9) + item}`}>
        {
          boards[boardIndex][rowNumber][item] === 0 ?
          '' :
          boards[boardIndex][rowNumber][item]
        }
      </td>
    })
  }

  return (
    <div>
      <div style={ buttonContainerStyle }>
        {
          showNew ?
          <button style={ buttonStyle } onClick={ changeBoard }>New</button> :
          <button style={ buttonStyle } onClick={ () => { animateSolution(boards[boardIndex].slice()); setShowNew(true); } }>Solve</button>
        }
      </div>
      <div style={ tableContainerStyle }>
        <table>
          <colgroup><col></col><col></col><col></col></colgroup>
          <colgroup><col></col><col></col><col></col></colgroup>
          <colgroup><col></col><col></col><col></col></colgroup>
          <tbody>
           <tr>
             { createRow(0) }
            </tr>
           <tr>
             { createRow(1) }
            </tr>
           <tr>
             { createRow(2) }
            </tr>
          </tbody>
          <tbody>
           <tr>
             { createRow(3) }
            </tr>
           <tr>
             { createRow(4) }
            </tr>
           <tr>
             { createRow(5) }
            </tr>
          </tbody>
          <tbody>
           <tr>
             { createRow(6) }
            </tr>
           <tr>
             { createRow(7) }
            </tr>
           <tr>
             { createRow(8) }
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const getEmptyCells = (board) => {

  const empty_cells = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === 0) {
        empty_cells.push([i, j]);
      }
    }
  }

  return empty_cells;
}

const checkRow = (board, row, number) => {
  return board[row].includes(number);
}

const checkColumn = (board, column, number) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i][column] === number) {
      return true;
    }
  }
  return false;
}

const checkBox = (board, box, number) => {
  let row;
  let col;
  switch (box) {
    case 0:
      row = 0;
      col = 0;
      break;
    case 1:
      row = 0;
      col = 3;
      break;
    case 2:
      row = 0;
      col = 6;
      break;
    case 3:
      row = 3;
      col = 0;
      break;
    case 4:
      row = 3;
      col = 3;
      break;
    case 5:
      row = 3;
      col = 6;
      break;
    case 6:
      row = 6;
      col = 0;
      break;
    case 7:
      row = 6;
      col = 3;
      break;
    case 8:
      row = 6;
      col = 6;
      break;
    default:
      row = -1;
      col = -1;
      break;
  }
  for (let i = row; i < row + 3; i++) {
    for (let j = col; j < col + 3; j++) {
      if (board[i][j] === number)
        return true;
    }
  }
  return false;
}

const getBox = (cell) => {
  const i = cell[0];
  const j = cell[1];
  if (i >= 0 && i <= 2) {
    if (j >= 0 && j <= 2)
      return 0;
    else if (j >= 3 && j <= 5)
      return 1;
    else if (j >= 6 && j <= 8)
      return 2;
  } else if (i >= 3 && i <= 5) {
    if (j >= 0 && j <= 2)
      return 3;
    else if (j >= 3 && j <= 5)
      return 4;
    else if (j >= 6 && j <= 8)
      return 5;
  } else if (i >= 6 && i <= 8) {
    if (j >= 0 && j <= 2)
      return 6;
    else if (j >= 3 && j <= 5)
      return 7;
    else if (j >= 6 && j <= 8)
      return 8;
  }
  return -1;
}


const animateSolution = (board) => {


  const temp = [];
  board.forEach(row => {
    temp.push([...row])
  });
  const emptyCells = getEmptyCells(temp);
  const solution = emptyCells.map(item => 0);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const animation = [];

  let cellIndex = 0;
  for (;;) {
    animation.push([1, emptyCells[cellIndex][0] * 9 + emptyCells[cellIndex][1]]);
    const isInRow = checkRow(temp, emptyCells[cellIndex][0], numbers[solution[cellIndex]]);
    const isInColumn = checkColumn(temp, emptyCells[cellIndex][1], numbers[solution[cellIndex]]);
    const isInBox = checkBox(temp, getBox(emptyCells[cellIndex]), numbers[solution[cellIndex]]);

    if (!isInRow && !isInColumn && !isInBox) {
      temp[emptyCells[cellIndex][0]][emptyCells[cellIndex][1]] = numbers[solution[cellIndex]];
      animation.push([3, emptyCells[cellIndex][0] * 9 + emptyCells[cellIndex][1], numbers[solution[cellIndex]]]);
      animation.push([2, emptyCells[cellIndex][0] * 9 + emptyCells[cellIndex][1]]);
      cellIndex += 1;
      if (cellIndex === emptyCells.length) {
        break;
      }
    } else {
      solution[cellIndex] += 1;
      if (solution[cellIndex] === 9) {
        solution[cellIndex] = 0;
        temp[emptyCells[cellIndex][0]][emptyCells[cellIndex][1]] = 0;
        animation.push([2, emptyCells[cellIndex][0] * 9 + emptyCells[cellIndex][1]]);
        cellIndex -= 1;
      }
    }
  }

  animate(animation);
}

const animate = (a) => {
  a.forEach((item, index) => {
    setTimeout(() => {
      let category = item[0];
      if (category === 1) {
        document.getElementById(`${item[1]}`).style.background = 'pink';
      } else if (category === 2) {
        document.getElementById(`${item[1]}`).style.background = 'white';
      } else if (category === 3) {
        document.getElementById(`${item[1]}`).innerText = `${item[2]}`;
      }
    }, index * 50)
  });
}


const buttonContainerStyle = {
  minHeight: '20vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const tableContainerStyle = {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const buttonStyle = {
  height: '30px',
  width: '80px',
  fontSize: '0.8rem',
  background: 'lightgray'
}


export default App;

import React from "react";
import ReactDOM from "react-dom";

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return <div>Cell</div>;
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: this.initialiseBoard(
        this.props.height,
        this.props.width,
        this.props.mines
      ),
      gameWon: false,
    };
  }

  initialiseBoard(height, width, mines) {
    let boardData = [];

    for (let i = 0; i < height; i++) {
      boardData.push([]);
      for (let j = 0; j < width; j++) {
        boardData[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbouringMines: 0,
          isFlagged: false,
          isRevealed: false,
        };
      }
    }

    // set the mines in the board
    boardData = this.setMines(boardData, mines);

    // set the value for non-mine cells, how many neighbouring mines?
    boardData = this.findNeighbouringMines(boardData);

    console.log(boardData);
    // return the initalised boardData to Board's state
    return boardData;
  }

  setMines(boardData, mines) {
    let randomX = 0;
    let randomY = 0;
    let minesSet = 0;

    while (minesSet < mines) {
      randomX = Math.floor(Math.random() * this.props.width);
      randomY = Math.floor(Math.random() * this.props.height);

      if (!boardData[randomY][randomX].isMine) {
        boardData[randomY][randomX].isMine = true;
        minesSet++;
      }
    }
    return boardData;
  }

  findNeighbouringMines(boardData) {
    for (let i = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        if (!boardData[i][j].isMine) {
          let neighbouringMines = 0;
          const neighbouringCells = this.neighbouringCells(
            boardData[i][j].x,
            boardData[i][j].y,
            boardData
          );

          for (let x = 0; x < neighbouringCells.length; x++) {
            if (neighbouringCells[x].isMine) {
              neighbouringMines++;
            }
          }

          boardData[i][j].neighbouringMines = neighbouringMines;
        }
      }
    }

    return boardData;
  }

  neighbouringCells(x, y, boardData) {
    let cells = [];

    const height = this.props.height;
    const width = this.props.width;

    // to the left
    if (x > 0) {
      cells.push(boardData[x - 1][y]);
    }

    // to the top-left
    if (x > 0 && y > 0) {
      cells.push(boardData[x - 1][y - 1]);
    }

    // to the top
    if (y > 0) {
      cells.push(boardData[x][y - 1]);
    }

    // to the top-right
    if (x < width - 1 && y > 0) {
      cells.push(boardData[x + 1][y - 1]);
    }

    // to the right
    if (x < width - 1) {
      cells.push(boardData[x + 1][y]);
    }

    // to the bottom-right
    if (x < width - 1 && y < height - 1) {
      cells.push(boardData[x + 1][y + 1]);
    }

    // to the bottom
    if (y < height - 1) {
      cells.push(boardData[x][y + 1]);
    }

    // to the bottom-left
    if (x > 0 && y < height - 1) {
      cells.push(boardData[x - 1][y + 1]);
    }

    return cells;
  }

  render() {
    return <div>Board</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 20,
      width: 20,
      mines: 25,
    };
  }

  render() {
    const { height, width, mines } = this.state;
    return (
      <div className="game">
        <h1>Minesweeper Game</h1>
        <p>Number of mines in the board: {mines}</p>
        <div className="game-board">
          <Board height={height} width={width} mines={mines} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

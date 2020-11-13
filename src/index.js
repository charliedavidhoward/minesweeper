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
    // boardData = this.findNeighbouringMines(boardData);

    // return the initalised boardData to Board's state
    return boardData;
  }

  setMines(boardData, mines) {
    let randomX = 0;
    let randomY = 0;
    let minesSet = 0;

    let height = boardData.length;
    let width = boardData[0].length;

    while (minesSet < mines) {
      randomX = Math.floor(Math.random() * width);
      randomY = Math.floor(Math.random() * height);

      if (!boardData[randomY][randomX].isMine) {
        boardData[randomY][randomX].isMine = true;
        minesSet++;
      }
    }
    return boardData;
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
      width: 10,
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

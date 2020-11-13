import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Cell extends React.Component {
  cellValue() {
    if (!this.props.value.isRevealed) {
      return this.props.value.isFlagged ? "🏁" : null;
    }

    if (this.props.value.isMine) {
      return "💣";
    }

    if (this.props.value.neighbouringMines === 0) {
      return null;
    }

    return this.props.value.neighbouringMines;
  }

  render() {
    console.log(this.props.value);
    return (
      <button className="cell" onClick={this.props.onClick}>
        {this.cellValue()}
      </button>
    );
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
          isRevealed: true,
        };
      }
    }

    // set the mines in the board
    boardData = this.setMines(boardData, mines);

    // set the value for non-mine cells, how many neighbouring mines?
    boardData = this.findNeighbouringMines(boardData);

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

  renderBoard(boardData) {
    return boardData.map((row) => {
      return row.map((cell) => {
        return (
          <div>
            <Cell
              value={cell}
              onClick={() => this.handleClick(cell.x, cell.y)}
            />
            {row[row.length - 1] === cell ? <div className="board-row" /> : ""}
          </div>
        );
      });
    });
  }

  render() {
    return <div>{this.renderBoard(this.state.boardData)}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 20,
      width: 20,
      mines: 50,
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

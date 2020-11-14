import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Cell extends React.Component {
  cellValue() {
    if (!this.props.value.isRevealed) {
      return this.props.value.isFlagged ? "🏁" : null;
    }

    if (this.props.value.isMine) {
      return "💥";
    }

    if (this.props.value.neighbouringMines === 0) {
      return null;
    }

    return this.props.value.neighbouringMines;
  }

  render() {
    let cellClassName = "cell" + (this.props.value.isRevealed ? "" : "-hidden");

    return (
      <button
        className={cellClassName}
        onClick={this.props.onClick}
        onContextMenu={this.props.rightClick}
      >
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

    //  initialise the state for each cell
    //  x, y are the coordinates of the cell in the board
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

      // if the cell does not already contain a mine, place
      // a mine, otherwise skip and continue to loop
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
        // if the cell is not a mine, identify how many neighbours
        // are mines
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

    // the following statements ensure that we do
    // not look outside the array

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

  revealBoard() {
    let updatedData = this.state.boardData;

    for (let i = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        if (!updatedData[i][j].isRevealed) {
          updatedData[i][j].isRevealed = true;
        }
      }
    }

    this.setState({
      boardData: updatedData,
    });
  }

  revealNeighbours(x, y, boardData) {
    // recursive function to reveal surrounding cells until finding a cell with
    // at least one adjacent mine

    let neighbours = this.neighbouringCells(x, y, boardData);

    neighbours.map((cell) => {
      if (!cell.isRevealed && !cell.isMine) {
        boardData[cell.x][cell.y].isRevealed = true;
        if (cell.neighbouringMines === 0) {
          this.revealNeighbours(cell.x, cell.y, boardData);
        }
      }
    });

    return boardData;
  }

  countHiddenCells(boardData) {
    let hiddenCells = 0;
    for (let i = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        if (!boardData[i][j].isRevealed) {
          hiddenCells++;
        }
      }
    }
    return hiddenCells;
  }

  handleClick(x, y) {
    // if the square is already revealed, a click does nothing
    if (this.state.boardData[x][y].isRevealed) {
      return null;
    }

    // if the player clicks on a mine, the game is over and the board is revealed
    if (this.state.boardData[x][y].isMine) {
      this.revealBoard();
    }

    let updatedData = this.state.boardData;

    // if there is at least one neighbouring mine, reveal the cell
    // (this will show a number in the cell)
    if (this.state.boardData[x][y].neighbouringMines !== 0) {
      updatedData[x][y].isRevealed = true;
    }

    // if the cell has no neighbouring cells, call the recursive
    // function to reveal cells until mines are hit
    if (this.state.boardData[x][y].neighbouringMines === 0) {
      updatedData = this.revealNeighbours(x, y, updatedData);
    }

    let winningState = false;

    // if the only hidden cells are mines, the game is won
    if (this.countHiddenCells(updatedData) === this.props.mines) {
      this.revealBoard();
      winningState = true;
    }

    this.setState({
      boardData: updatedData,
      gameWon: winningState,
    });

    // if right click, flag the cell
  }

  handleRightClick(e, x, y) {
    e.preventDefault();

    let updatedData = this.state.boardData;

    if (updatedData[x][y].isRevealed) {
      return;
    }

    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
    } else {
      updatedData[x][y].isFlagged = true;
    }

    this.setState({
      boardData: updatedData,
    });
  }

  renderBoard(boardData) {
    return boardData.map((row) => {
      return row.map((cell) => {
        return (
          <div>
            <Cell
              value={cell}
              onClick={() => this.handleClick(cell.x, cell.y)}
              onRightClick={(e) => this.handleRightClick(e, cell.x, cell.y)}
            />
            {row[row.length - 1] === cell ? <div className="board-row" /> : ""}
          </div>
        );
      });
    });
  }

  render() {
    return (
      <div className="board">
        <div className="status-info">
          <p>{this.state.gameWon ? "You won!" : "Keep searching...."}</p>
        </div>
        <div>{this.renderBoard(this.state.boardData)}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 11,
      width: 11,
      mines: 15,
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

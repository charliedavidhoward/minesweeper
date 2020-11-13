import React from "react";
import ReactDOM from "react-dom";
import "index.css";

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
      value: null,
    };
  }

  render() {
    return <div>Board</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return <div>Game</div>;
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

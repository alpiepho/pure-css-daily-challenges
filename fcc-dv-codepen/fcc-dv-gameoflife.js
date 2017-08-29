// NOTES: This is the solution for the freeCodeCamp project at:
// https://www.freecodecamp.com/challenges/build-the-game-of-life
//

/*
NOTES:
Game of Life

User Story: 
  When I first arrive at the game, it will randomly generate a board and start playing.
User Story: 
  I can start and stop the board.
User Story: 
  I can set up the board.
User Story: 
  I can clear the board.
User Story: 
  When I press start, the game will play out.
User Story: 
  Each time the board changes, I can see how many generations have gone by.
*/

// components from ReactBootstrap (https://react-bootstrap.github.io/components.html)
var Button       = ReactBootstrap.Button;
var ControlLabel = ReactBootstrap.ControlLabel;


const CELL_SIZE=(10+1+1);  // must match CSS
const BOARD_SIZE=240;
const INTERVAL=1000;
const INTERVAL_MIN=125;
const INTERVAL_MAX=16000;
const RAMDOM_LEVEL=0.2;


//////////////////////////////////////////////////////////////////////////////////
// Footer - my standard footer with link to LinkedIn
//////////////////////////////////////////////////////////////////////////////////
class Footer extends React.Component {
	render() {
		return (
        <div className="footer">
          <hr/>
          <p>
           Page built by <a rel="nofollow" href="https://www.linkedin.com/in/al-piepho-fw-sw-engineer/"     target="_blank">Al Piepho</a> <em> (SW | FW | Embedded | Web) 2017</em></p>
          </div>
    );
  }
}

///////////////////////////////////////////////////////////
// Cell
///////////////////////////////////////////////////////////
class Cell extends React.Component {
  handleChange(e) {
    this.props.cellClick(this.props.cell);
  }

	render() {
    var classStr = "cell cell-level" + this.props.cell.level;
		return (
        <div className={classStr} onClick={this.handleChange.bind(this)}></div>
    );
  }
}

///////////////////////////////////////////////////////////
// Row
///////////////////////////////////////////////////////////
class Row extends React.Component {
	render() {
    var count = this.props.cells.length;
    var cells = [];
    for (let col=0; col < count; col++) {
      cells.push(<Cell cell={this.props.cells[col]} cellClick={this.props.cellClick} key={col}/>);
    }
		return (
        <div className="row">
          {cells}
        </div>
    );
  }
}

///////////////////////////////////////////////////////////
// Board
///////////////////////////////////////////////////////////
class Board extends React.Component {
	render() {
    var count = this.props.arr.length;
    var rows  = [];
    for (var row=0; row<count; row++) {
      rows.push(<Row cells={this.props.arr[row]} cellClick={this.props.cellClick} key={row}/>); 
    }
		return (
        <div className="board">
          {rows}
        </div>
    );
  }
}


///////////////////////////////////////////////////////////
// Controls
///////////////////////////////////////////////////////////
class Controls extends React.Component {
	render() {
		return (
        <div className="controls">
          <Button
            bsStyle="primary"
            onClick={this.props.slowerClick}>
            -
          </Button>       
          <Button
            bsStyle="primary"
            onClick={this.props.playClick}>
            Play
          </Button>       
          <Button
            bsStyle="primary"
            onClick={this.props.fasterClick}>
            +
          </Button>       
          <Button
            bsStyle="primary"
            onClick={this.props.pauseClick}>
            Pause
          </Button>       
          <Button
            bsStyle="primary"
            onClick={this.props.resetClick}>
            Reset
          </Button>       
        <div><ControlLabel>Iterations: {this.props.iterations}</ControlLabel></div>
        </div>
    );
  }
}

///////////////////////////////////////////////////////////
// MapKey
///////////////////////////////////////////////////////////
class MapKey extends React.Component {
	render() {
		return (
        <div className="mapkey">
          <div>
            <Cell cell={ {row:0, col:0, level: -1} } />
            <ControlLabel>Cell just off {this.props.iterations}</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 0} } />
            <ControlLabel>Cell Off {this.props.iterations}</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 1} } />
            <ControlLabel>Cell just on {this.props.iterations}</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 2} } />
            <ControlLabel>Cell On {this.props.iterations}</ControlLabel>
          </div>
        </div>
    );
  }
}

///////////////////////////////////////////////////////////
// Engine
///////////////////////////////////////////////////////////
class Engine {
  constructor() {
    this.rows  = 0;
    this.cols  = 0;
  }
  
  run(arr) {
    if (this.rows == 0) {
      this.rows = arr.length;
      this.cols = arr[0].length;      
    }
    
    var newArr = arr.slice();
   
    // for each cell, check neighbors count to
    // determine new level for this cell
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        var rBefore = (row == 0 ? (this.rows-1) : (row-1));
        var rAfter  = ((row+1) == this.rows ? 0 : (row+1));
        var cBefore = (col == 0 ? (this.cols-1) : (col-1));
        var cAfter  = ((col+1) == this.cols ? 0 : (col+1));

        var count = 0;
        if (arr[rBefore][cBefore].level > 0) count += 1;
        if (arr[row    ][cBefore].level > 0) count += 1;
        if (arr[rAfter ][cBefore].level > 0) count += 1;
      
        if (arr[rBefore][col    ].level > 0) count += 1;
        if (arr[rAfter ][col    ].level > 0) count += 1;

        if (arr[rBefore][cAfter ].level > 0) count += 1;
        if (arr[row    ][cAfter ].level > 0) count += 1;
        if (arr[rAfter ][cAfter ].level > 0) count += 1;
      
        /*
        Rules
        8 neighbors
        can wrap from top row to bottom row
        can wrap from left column to right column
        on + 2 neighbors -> on
        on + 3 neighbors -> on
        on + (1,4,5,6,7,8 neighbors) -> off
        off + 3 neighbors -> on
        */
        var level = arr[row][col].level;
        if (level == -1)
          level = 0;
        if (level == 0) {
          if (count === 3)
            level  = 1;
        } else if (level > 0) {
          if (count == 2 || count == 3)
            level = 2;
          else
            level = -1; // show newly killed
        }
        newArr[row][col].level = level;
      }
    }
    
    return newArr;
  }
}

//////////////////////////////////////////////////////////
class GameOfLifeApp extends React.Component {
	constructor() {
    super();
    
    var arr          = this.defaultCells(true);
    this.state       = { arr: arr, iterations: 0 };
    
    this.timer       = 0;
    this.interval    = INTERVAL;
    this.engine      = new Engine();
 
    this.cellClick   = this.cellClick.bind(this);
    this.playClick   = this.playClick.bind(this);
    this.fasterClick = this.fasterClick.bind(this);
    this.slowerClick = this.slowerClick.bind(this);
    this.pauseClick  = this.pauseClick.bind(this);
    this.resetClick  = this.resetClick.bind(this);
    this.timerUpdate = this.timerUpdate.bind(this);
  }
  
  defaultCells(fillRandom) {
    var row_count = BOARD_SIZE / CELL_SIZE;
    var col_count = row_count;
    var arr = [];
    for (let row=0; row < row_count; row++) {
      var cols = [];
      for (let col=0; col < col_count; col++) {
        var level = 0;
        if (fillRandom) {
          var randomize = Math.random();
          if (randomize < RAMDOM_LEVEL) {
            level = Math.floor(Math.random() * 4);
          }
        }
        var cell = {row: row, col: col, level: level};
        cols.push(cell);
      }
      arr.push(cols);
    }
    return arr;
  }

  cellClick(cell) {
    var arr   = this.state.arr;
    var level = arr[cell.row][cell.col].level;
    if (level) level = 0;
    else       level = 2;
    arr[cell.row][cell.col].level = level;
    this.setState( { arr: arr } );
  }
  
  timerUpdate() {
    var arr = this.engine.run(this.state.arr);
    var iterations = this.state.iterations;
    iterations += 1;
    this.setState( { arr: arr, iterations: iterations} );
 }
  
  playClick() {
    this.timer = setInterval(this.timerUpdate, this.interval);
  }

  fasterClick() {
    this.interval /=2;
    if (this.interval < INTERVAL_MIN) this.interval = INTERVAL_MIN;
    clearInterval(this.timer);
    this.timer = setInterval(this.timerUpdate, this.interval);
  }

  slowerClick() {
    this.interval *=2;
    if (this.interval > INTERVAL_MAX) this.interval = INTERVAL_MAX;
    clearInterval(this.timer);
    this.timer = setInterval(this.timerUpdate, this.interval);
  }

  pauseClick() {
    clearInterval(this.timer);
  }
  
  resetClick() {
    clearInterval(this.timer);
    
    var arr = this.defaultCells(false);
    this.setState( { arr: arr, iterations: 0} );    
  }
  
  ////
  //// render
  ////
	render() {
		return (
      <div>
        <h1 className="app-header">freeCodeCamp DV - Game of Life</h1>
        <Controls 
          iterations={this.state.iterations} 
          playClick={this.playClick}
          fasterClick={this.fasterClick}
          slowerClick={this.slowerClick}
          pauseClick={this.pauseClick}
          resetClick={this.resetClick}
        />
        <Board arr={this.state.arr} cellClick={this.cellClick}/>
        <MapKey />
        <Footer />
      </div>
		);
	}
}

///////////////////////////////////////////////////////////
ReactDOM.render(<GameOfLifeApp />, document.getElementById('gameoflife'));


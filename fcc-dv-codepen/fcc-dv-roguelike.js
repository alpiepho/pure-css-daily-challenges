// NOTES: This is the solution for the freeCodeCamp project at:
// https://www.freecodecamp.com/challenges/build-a-roguelike-dungeon-crawler-game
//

/*
NOTES:
Roguelike Dungeon Game

User Story: 
  I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.

User Story: 
  All the items and enemies on the map are arranged at random.

User Story: 
  I can move throughout a map, discovering items.

User Story: 
  I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.

User Story: 
  Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.

User Story: 
  When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.

User Story: 
  When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.

User Story: 
 When I find and beat the boss, I win.

User Story:
  The game should be challenging, but theoretically winnable.
  
  
TODO:
        - comment old code
- more cells, 100x100?
- labels for score parameter levels
   health skill game-level game-score overall-score
- buttons for:
   darkness reset-game reset-overall
- mapkey for:
   symbols
   game rules (I really need this...don't get these type of games)
- darkness overlay (can this be a css layer?)
- Cell type with level
   wall, health, skill, enemy, boss, dude
   0-1   1-n,    1-n,   1-n
- track keys for navigation
- BoardEngine
   - generate (given) number of random size (range) rooms
   - generate (given) number of tunnels between rooms
- GameEngine
   - update health
   - update skills
   - update enemy etc.
- cleanup and remove commented-out code


FUTURE:
- improve performance for cell selection/move, seems slow.  rendering?
- fix row collaspe when window is too narrow (should go to scrollbar)
*/

// components from ReactBootstrap (https://react-bootstrap.github.io/components.html)
var Button       = ReactBootstrap.Button;
var ControlLabel = ReactBootstrap.ControlLabel;


const CELL_SIZE=(5+1+1);  // must match CSS
const BOARD_SIZE=400;
//const INTERVAL=1000;
//const INTERVAL_MIN=125;
//const INTERVAL_MAX=16000;
//const RAMDOM_LEVEL=0.15;


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
        <div className="board-wrapper">
          <div className="board">
            {rows}
          </div>
          <div className="darkness"></div>
        </div>
    );
  }
}


///////////////////////////////////////////////////////////
// Controls
///////////////////////////////////////////////////////////
class Controls extends React.Component {
	render() {
    var extra = [];
    extra.push(
          <Button
            //bsStyle="primary"
            key={1}
            onClick={this.props.dumpClick}>
            Dump
          </Button>       
    );
    extra.push(
          <Button
            //bsStyle="primary"
            key={2}
            onClick={this.props.resetClick}>
            Reset
          </Button>       
    );
    // DEBUG
    //extra = "";
		return (
        <div className="controls">
          {extra}
          <Button
            //bsStyle="primary"
            onClick={this.props.lightClick}>
            Light
          </Button>       
          <ControlLabel>Details:</ControlLabel>
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

//DEBUG: generated using cellClick and dumpClick
const spotRing0 = ["10,10"];
const spotRing1 = ["6,9", "6,10", "6,11", "7,8", "7,9", "7,10", "7,11", "7,12", "8,7", "8,8", "8,9", "8,10", "8,11", "8,12", "8,13", "9,6", "9,7", "9,8", "9,9", "9,10", "9,11", "9,12", "9,13", "9,14", "10,6", "10,7", "10,8", "10,9", "10,10", "10,11", "10,12", "10,13", "10,14", "11,6", "11,7", "11,8", "11,9", "11,10", "11,11", "11,12", "11,13", "11,14", "12,7", "12,8", "12,9", "12,10", "12,11", "12,12", "12,13", "13,8", "13,9", "13,10", "13,11", "13,12", "14,9", "14,10", "14,11"];
const spotRing2 = ["4,7", "4,8", "4,9", "4,10", "4,11", "4,12", "4,13", "5,6", "5,7", "5,8", "5,9", "5,10", "5,11", "5,12", "5,13", "5,14", "6,5", "6,6", "6,7", "6,13", "6,14", "6,15", "7,4", "7,5", "7,6", "7,14", "7,15", "7,16", "8,4", "8,5", "8,15", "8,16", "9,4", "9,5", "9,15", "9,16", "10,4", "10,5", "10,15", "10,16", "11,4", "11,5", "11,15", "11,16", "12,4", "12,5", "12,15", "12,16", "13,4", "13,5", "13,6", "13,14", "13,15", "13,16", "14,5", "14,6", "14,7", "14,13", "14,14", "14,15", "15,6", "15,7", "15,8", "15,9", "15,10", "15,11", "15,12", "15,13", "15,14", "16,7", "16,8", "16,9", "16,10", "16,11", "16,12", "16,13"];


///////////////////////////////////////////////////////////
// BoardEngine
///////////////////////////////////////////////////////////
const MIN_W        =  5;
const MAX_W        = 20;
const MIN_H        =  5;
const MAX_H        = 20;
const ROOMS_MAX    = 20;
const ROOM_RETRIES = 10;

class BoardEngine {
  constructor() {
    this.rows  = 0;
    this.cols  = 0;
  }
  
  walls() {
    var row_count = BOARD_SIZE / CELL_SIZE;
    var col_count = row_count;
    var arr = [];
    for (let row=0; row < row_count; row++) {
      var cols = [];
      for (let col=0; col < col_count; col++) {
        var cell = {row: row, col: col, level: 0}; // level = 0 : wall
        cols.push(cell);
      }
      arr.push(cols);
    }
    return arr;
  }
  
  contains(rect, X,Y) {
    var result = false;
    if (X >= rect.x && X <=(rect.x+rect.w-1) &&
        Y >= rect.y && Y <=(rect.y+rect.h-1))
      result = true;
    return result;
  }
  
  overlaps(rect1, rect2) {
    var result = false;
    for (let X=rect2.x-1; !result && X < (rect2.x+rect2.w+1); X++) {
      for (let Y=rect2.y-1; !result && Y < (rect2.y+rect2.h+1); Y++) {
        if (this.contains(rect1, X,Y)) result = true;
      }  
    }
    console.log(rect1);
    console.log(rect2);
    console.log(result);
    return result;
  }
  
  rooms(arr) {
    // get dimentions
    if (this.rows == 0) {
      this.rows = arr.length;
      this.cols = arr[0].length;      
    }
    
    // clone the arr
    var newArr = arr.slice();
    
    // generate rooms
    var rooms = [];
    for (let count = 0; count < ROOMS_MAX; count++) {
      // may need retries to get rooms that dont overlap
      var retries = ROOM_RETRIES;
      while( retries > 0) {
        var w = MIN_W + Math.floor(Math.random() * (MAX_W - MIN_W));
        var h = MIN_H + Math.floor(Math.random() * (MAX_H - MIN_H));
        var x = 0     + Math.floor(Math.random() * (this.cols - w));
        var y = 0     + Math.floor(Math.random() * (this.rows - h));
        var rect = {x:x, y:y, w:w, h:h};
        var ok = true;
        for (let i=0; i<rooms.length; i++) {
          if (this.overlaps(rooms[i], rect)) ok = false;
        }
        if (ok) {
          rooms.push(rect);
          retries = 0;
        }
        retries -= 1;
      }
      
      // update the cells
      for (let i=0; i<rooms.length; i++) {
        var room = rooms[i];
        for (let X=room.x; X < (room.x+room.w); X++) {
          for (let Y=room.y; Y < (room.y+room.h); Y++) {
            if (X < this.cols && Y < this.rows) {
             newArr[Y][X].level = 1; // floor             
            }
          }  
        }
      }
      
    }
    return newArr;
  }
}



///////////////////////////////////////////////////////////
// Engine
///////////////////////////////////////////////////////////
/*
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
      
        //Rules
        //8 neighbors
        //can wrap from top row to bottom row
        //can wrap from left column to right column
        //on + 2 neighbors -> on
        //on + 3 neighbors -> on
        //on + (1,4,5,6,7,8 neighbors) -> off
        //off + 3 neighbors -> on
        
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
*/

//////////////////////////////////////////////////////////
class App extends React.Component {
	constructor() {
    super();    
  
    this.boardEngine = new BoardEngine();
    var arr;
    arr              = this.boardEngine.walls();
    arr              = this.boardEngine.rooms(arr);

    this.state       = { arr: arr, iterations: 0 };

    this.cellClick   = this.cellClick.bind(this);
    this.dumpClick   = this.dumpClick.bind(this);   // dumps  selected cells, for building rooms
    this.resetClick  = this.resetClick.bind(this);  // clears selected cells
    this.lightClick  = this.lightClick.bind(this);
  }

  cellClick(cell) {
    var arr   = this.state.arr;
    var level = arr[cell.row][cell.col].level;
    level += 1;
    if (level == 3) level = 0;
    arr[cell.row][cell.col].level = level;
    this.setState( { arr: arr } );
  }

  dumpClick() {
    var arr   = this.state.arr;
    var list = [];
    var row_count = arr.length;
    var col_count = arr[0].length;
    for (let row=0; row < row_count; row++) {
      for (let col=0; col < col_count; col++) {
        if (arr[row][col].level > 0) {
          list.push(row + "," + col);
        }
      }
    }
    console.log(list);
  }

  resetClick() {
    var arr = this.boardEngine.walls();
    this.setState( { arr: arr, iterations: 0} );    
  }

  lightClick() {
    console.log("light click");
  }

  ////
  //// render
  ////
  render() {
		return (
      <div>
        <h1 className="app-header">freeCodeCamp DV - Roguelike Game</h1>
        <Controls 
          dumpClick={this.dumpClick}
          resetClick={this.resetClick}
          lightClick={this.lightClick}
        />
       <Board arr={this.state.arr} cellClick={this.cellClick}/>
        <Footer />
      </div>
		);
	}

}

///////////////////////////////////////////////////////////
ReactDOM.render(<App />, document.getElementById('roguelikegame'));

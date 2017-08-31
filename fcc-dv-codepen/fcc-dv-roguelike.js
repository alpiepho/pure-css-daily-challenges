// NOTES: This is the solution for the freeCodeCamp project at:
// https://www.freecodecamp.com/challenges/build-a-roguelike-dungeon-crawler-game
//

/*
NOTES:
Roguelike Dungeon Game

User Story: 
  I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.

User Story: 
  All the items and enemies on the map are arranged at random .

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
   - generate tunnels between rooms
- GameEngine
   - update health
   - update skills
   - update enemy etc.
- cleanup and remove commented-out code


FUTURE:
- fix row collaspe when window is too narrow (should go to scrollbar)
*/

// components from ReactBootstrap (https://react-bootstrap.github.io/components.html)
var Button       = ReactBootstrap.Button;
var ControlLabel = ReactBootstrap.ControlLabel;


const CELL_SIZE=(5+1+1); // TODO match CSS?
const BOARD_SIZE=400;


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
} //// end Footer

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
        <div className={classStr}></div>
    );
  }
} //// end Cell

///////////////////////////////////////////////////////////
// Row
///////////////////////////////////////////////////////////
class Row extends React.Component {
	render() {
    var count = this.props.cells.length;
    var cells = [];
    for (let col=0; col < count; col++) {
      cells.push(<Cell cell={this.props.cells[col]} key={col}/>);
    }
		return (
        <div className="row">
          {cells}
        </div>
    );
  }
} //// end Row

///////////////////////////////////////////////////////////
// Board
///////////////////////////////////////////////////////////
class Board extends React.Component {
	render() {
    var count = this.props.arr.length;
    var rows  = [];
    for (var row=0; row<count; row++) {
      rows.push(<Row cells={this.props.arr[row]} key={row}/>); 
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
} //// end Board


///////////////////////////////////////////////////////////
// Controls
///////////////////////////////////////////////////////////
class Controls extends React.Component {
	render() {
		return (
        <div className="controls">
          <Button
            //bsStyle="primary"
            onClick={this.props.lightClick}>
            Light
          </Button>       
          <ControlLabel>Details:</ControlLabel>
        </div>
    );
  }
} //// end Controls

///////////////////////////////////////////////////////////
// MapKey
///////////////////////////////////////////////////////////
/*
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
}  //// end MapKey
*/

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
    this.rows    = 0;
    this.cols    = 0;
    this.rooms   = [];
    this.tunnels = [];
  }
  
  ////////////////////////////////////////////////////////
  contains(rect, X,Y) {
    var result = false;
    if (X >= rect.x && X <=(rect.x+rect.w-1) &&
        Y >= rect.y && Y <=(rect.y+rect.h-1))
      result = true;
    return result;
  }
  
  ////////////////////////////////////////////////////////
  overlaps(rect1, rect2) {
    var result = false;
    for (let X=rect2.x-1; !result && X < (rect2.x+rect2.w+1); X++) {
      for (let Y=rect2.y-1; !result && Y < (rect2.y+rect2.h+1); Y++) {
        if (this.contains(rect1, X,Y)) result = true;
      }  
    }
    return result;
  }
  
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  buildWalls() {
    this.rows = BOARD_SIZE / CELL_SIZE;
    this.cols = this.rows;
    var arr = [];
    for (let row=0; row < this.rows; row++) {
      var cols = [];
      for (let col=0; col < this.cols; col++) {
        var cell = {row: row, col: col, level: 0}; // level = 0 : wall
        cols.push(cell);
      }
      arr.push(cols);
    }
    return arr;
  }
  
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  buildRooms(arr, rooms_max) {
    // clone the arr
    var newArr = arr.slice();
    
    // generate rooms
    var rooms = [];
    for (let count = 0; count < rooms_max; count++) {
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
          rect["id"] = rooms.length;
          rooms.push(rect);
          retries = 0;
        }
        retries -= 1;
      }
      
      // update the cells
      this.rooms = rooms;
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
  
  
  ////////////////////////////////////////////////////////
  tunnel_up(A, B, id1) {
    var result = undefined;
    var found  = false;
    // check up from given (A, B-1), stop at edge (0)
    for (let Y=(B-1); !found && Y >= 0; Y--) {
      // check if any room contains this point
      for (let i=0; i<this.rooms.length; i++) {
        var room = this.rooms[i];
        if (this.contains(room, A,Y)) {
          found = true;
          result = {x:A, y:Y, w:1, h:(B-Y+1), id1:id1, id2:room.id}; // tunnel will run into both rooms
        }
      }
    }    
    // return the tunnel
    return result;
  }
  
  ////////////////////////////////////////////////////////
  tunnel_down(A, B, id1) {
    var result = undefined;
    var found  = false;
    // check up from given (A, B+1), stop at edge (this.rows)
    for (let Y=(B+1); !found && Y < this.rows; Y++) {
      // check if any room contains this point
      for (let i=0; i<this.rooms.length; i++) {
        var room = this.rooms[i];
        if (this.contains(room, A,Y)) {
          found = true;
          result = {x:A, y:B, w:1, h:(Y-B+1), id1:id1, id2:room.id}; // tunnel will run into both rooms
        }
      }
    }    
    // return the tunnel
    return result;
  }

  ////////////////////////////////////////////////////////
  tunnel_left(A, B, id1) {
    var result = undefined;
    var found  = false;
    // check up from given (A-1, B), stop at edge (0)
    for (let X=(A-1); !found && X >= 0; X--) {
      // check if any room contains this point
      for (let i=0; i<this.rooms.length; i++) {
        var room = this.rooms[i];
        if (this.contains(room, X,B)) {
          found = true;
          result = {x:X, y:B, w:(A-X+1), h:1, id1:id1, id2:room.id}; // tunnel will run into both rooms
        }
      }
    }    
    // return the tunnel
    return result;
  }

  ////////////////////////////////////////////////////////
  tunnel_right(A, B, id1) {
    var result = undefined;
    var found  = false;
    // check up from given (A+1, B), stop at edge (this.cols)
    for (let X=(A+1); !found && X < this.cols; X++) {
      // check if any room contains this point
      for (let i=0; i<this.rooms.length; i++) {
        var room = this.rooms[i];
        if (this.contains(room, X,B)) {
          found = true;
          result = {x:A, y:B, w:(X-A+1), h:1, id1:id1, id2:room.id}; // tunnel will run into both rooms
        }
      }
    }    
    // return the tunnel
    return result;
  }
  
  tunnelById1(id) {
    var tunnel;
    for (let i = 0; i < this.tunnels.length; i++) {
      if (this.tunnels[i].id1 == id) {
        tunnel = this.tunnels[i];
        break;
      }
    }
    return tunnel; 
  }

  tunnelById2(id) {
    var tunnel;
    for (let i = 0; i < this.tunnels.length; i++) {
      if (this.tunnels[i].id2 == id) {
        tunnel = this.tunnels[i];
        break;
      }
    }
    return tunnel; 
  }

  /*
  Partially working algorithm.  Going to add jump instead
  validateTunnels() {
    var result = false;
    
    // setup master array
    var masterAccessed = [];
    for (let i = 0; i< this.rooms.length; i++) {
      masterAccessed.push(false);
    }
    
    // for each room
    //   find tunnel leading out
    //   follow tunnel and count rooms
    //   if any path touches all rooms, return true
    
    var found = false;
    for (let i = 0; !found && i< this.rooms.length; i++) {
      var room = this.rooms[i];
      var tunnel = this.tunnelById1(room.id);
      var accessed = masterAccessed.splice();
      var count = 0;
      var tries = 1000;
      while (tries > 0 && !found && !accessed[tunnel.id1]) {
        accessed[tunnel.id1] = true;
        count += 1;
        tries -= 1;
        if (count == this.rooms.length) found = true;
        tunnel = this.tunnelById1(tunnel.id2);  
      }
    }
    return found;
  }
  */

  
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  buildTunnels(arr) {
    // clone the arr
    var newArr = arr.slice();
    
    // generate tunnels for each room
    //   start top, check for clear path up to another room, stop at edge
    //   start right, check for clear path right to another room, stop at edge
    //   start bottom, check for clear path down to another room, stop at edge
    //   start left, check for clear path left to another room, stop at edge
    //   stop if a path found
    // TODO: collect list of start points with direction and randomly pick
    //       so tunnels are not all the same direction
    // TODO: add path validation, can all rooms be accessed
    
    var tunnels = [];
    
    
    for (let i=0; i<this.rooms.length; i++) {
      var room = this.rooms[i];
      
      // build list of points around this room
      var testPoints = [];
      // start top, check for clear path up to another room, stop at edge
      for (let X=room.x; X < (room.x + room.w); X++) {
        testPoints.push({ A: X, B: room.y, dir: 0 });
      }
      // start bottom, check for clear path down to another room, stop at edge
      for (let X=room.x; X < (room.x + room.w); X++) {
        testPoints.push({ A: X, B: (room.y+room.h-1), dir: 1 });
      }
      // start left, check for clear path left to another room, stop at edge
      for (let Y=room.y; Y < (room.y + room.h); Y++) {
       testPoints.push({ A: room.x, B: Y, dir: 2 });
      }
      // start right, check for clear path right to another room, stop at edge
      for (let Y=room.y; Y < (room.y + room.h); Y++) {
       testPoints.push({ A: (room.x+room.w-1), B: Y, dir: 3 });
      }
  
      // build list of indexes to track what was tested
      var indexes = [];
      for (let j=0; j < testPoints.length; j++) {
        indexes.push(false);
      }

      // randomly check all test points
      var found = false;
      var count = 0; // just in case
      while (!found && count < 100) {
        // randomly pick an index
        var index = Math.floor(Math.random() * (testPoints.length));
        if (!indexes[index]) {
          indexes[index] = true;                                            // mark tested
          var point = testPoints[index];                                    // grab this point
          var tunnel;
          if (point.dir == 0) tunnel = this.tunnel_up(point.A,    point.B, room.id); // test up
          if (point.dir == 1) tunnel = this.tunnel_down(point.A,  point.B, room.id); // test down
          if (point.dir == 2) tunnel = this.tunnel_left(point.A,  point.B, room.id); // test left
          if (point.dir == 3) tunnel = this.tunnel_right(point.A, point.B, room.id); // test right
          if (tunnel != undefined) {
            found = true;
            tunnels.push(tunnel);                                           // save it
          }      
        }
      }
 
    }        
    
    // update the cells
    for (let i=0; i<tunnels.length; i++) {
      var tunnel = tunnels[i];
      for (let X=tunnel.x; X < (tunnel.x+tunnel.w); X++) {
        for (let Y=tunnel.y; Y < (tunnel.y+tunnel.h); Y++) {
          if (X < this.cols && Y < this.rows) {
            newArr[Y][X].level = 2; // tunnel             
          }
        }  
      }
    }
      

    return newArr;
  }
  
  
} //// end BuildEngine


//////////////////////////////////////////////////////////
class App extends React.Component {
	constructor() {
    super();    
  
    this.boardEngine = new BoardEngine();
    var arr;
    arr = this.boardEngine.buildWalls();
    arr = this.boardEngine.buildRooms(arr, ROOMS_MAX);
    arr = this.boardEngine.buildTunnels(arr);

    //this.gameEngine = new GameEngine();
    //this.gameEngine.setLevel(1);
    //arr = this.gameEngine.objects(arr); // (health, weapons)
    //arr = this.gameEngine.players(arr); // (enemies, boss, you)
    //arr = this.gameEngine.move(dir, jmp, light);
    
    
    this.state       = { arr: arr };

    this.lightClick   = this.lightClick.bind(this);
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
          lightClick={this.lightClick}
        />
       <Board arr={this.state.arr} />
        <Footer />
      </div>
		);
	}

} //// end App

///////////////////////////////////////////////////////////
ReactDOM.render(<App />, document.getElementById('roguelikegame'));
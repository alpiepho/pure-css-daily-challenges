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
- finish move boss
- hoist const to top for easier tuning
- review for re-factor
- set boss back to darkred
- more const for levels etc

FUTURE:
- save/restore state to local storage
- fix row collaspe when window is too narrow (should go to scrollbar)
*/

// components from ReactBootstrap (https://react-bootstrap.github.io/components.html)
var Button       = ReactBootstrap.Button;
var ControlLabel = ReactBootstrap.ControlLabel;


const CELL_SIZE           =(5+1+1); // TODO match CSS?
const BOARD_SIZE          =400;

const MIN_W               =  5;
const MAX_W               = 20;
const MIN_H               =  5;
const MAX_H               = 20;
const ROOMS_MAX           = 20;
const ROOM_RETRIES        = 10;

const HEALTH_COUNT_MAX    = 20;
const HEALTH_RANGE_MAX    =  4;
const WEAPON_COUNT_MAX    = 10;
const WEAPON_RANGE_MAX    =  4;
const ENEMY_COUNT_MAX     =  5;
const ENEMY_RANGE_MAX     =  4;
const DARKNESS_RADIUS     = 10;
const ENEMY_HEALTH_COST   = 10;
const ENEMY_WEAPON_FACTOR = 10;
const BOSS_HEALTH_COST    = 20;
const BOSS_WEAPON_FACTOR  = 100;


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
    var classStr = "cell cell-level" + this.props.cell.level + " darkness"  + this.props.cell.darkness;
      
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
    var details = "";
    details += "Health: " + this.props.details.health;
    details += " ..... Weapon: " + this.props.details.weapon;
    details += " ..... Level: " + this.props.details.level;
    details += " ..... Overall Score: " + this.props.details.score;
    /*
          <Button
            bsStyle="warning"
            onClick={this.props.restartClick}>
            Restart
          </Button>    
    */

		return (
        <div className="controls">
          <Button
            //bsStyle="primary"
            onClick={this.props.lightClick}>
            Light
          </Button>       
          <ControlLabel className="details">{details}</ControlLabel>
          <Button
            bsStyle="danger"
            className="reset-button"
            onClick={this.props.resetClick}>
            RESET!!!
          </Button>       
        </div>
    );
  }
} //// end Controls

///////////////////////////////////////////////////////////
// GameMessage
///////////////////////////////////////////////////////////
class GameMessage extends React.Component {
	render() {
    var messages = [];
    if (this.props.message == -1) {
      messages.push(
        <div className="game-message-lost" key={1}>
          <ControlLabel>Game Over</ControlLabel>
        </div>
      );
    } else if (this.props.message <= 10) {
      var classStr = "game-message-level" + this.props.message;
      messages.push(
        <div className={classStr} key={2}>
          <ControlLabel>Level {this.props.message}</ControlLabel>
        </div>
      );
    }
    else if (this.props.message == 11) {
      messages.push(
        <div className="game-message-win" key={3}>
          <ControlLabel>You Win!</ControlLabel>
        </div>
     );
    }
		return (
        <div>
          {messages}
        </div>
    );
  }
}  //// end GameMessage


///////////////////////////////////////////////////////////
// MapKey
///////////////////////////////////////////////////////////
class MapKey extends React.Component {
	render() {
    /*
          <div>
            <ControlLabel>"Restart" button start over on this level</ControlLabel>
          </div>
    */
		return (
        <div className="mapkey">
          <div>
            <Cell cell={ {row:0, col:0, level: 0} } />
            <ControlLabel>Wall</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 1} } />
            <ControlLabel>Floor</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 2} } />
            <ControlLabel>Tunnel</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 10} } />
            <ControlLabel>Health objects</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 100} } />
            <ControlLabel>Weapon objects</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 1000} } />
            <ControlLabel>Enemies</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 10000} } />
            <ControlLabel>Boss</ControlLabel>
          </div>
          <div>
            <Cell cell={ {row:0, col:0, level: 100000} } />
            <ControlLabel>You</ControlLabel>
          </div>
          <div>
            <ControlLabel>"Light" button to show whole board</ControlLabel>
          </div>
          <div>
            <ControlLabel>"RESET!!!" button to clear whole game</ControlLabel>
          </div>
          <div>
            <ControlLabel>=== careful, this is your only warning ===</ControlLabel>
          </div>
          <div>
            <ControlLabel>Mouse click anywehere in board to start</ControlLabel>
          </div>
          <div>
            <ControlLabel>Arrows to move up, down, left, right</ControlLabel>
          </div>
          <div>
            <ControlLabel>J for jump on next move</ControlLabel>
          </div>
          <div>
            <ControlLabel>Double the points if you play in the dark</ControlLabel>
          </div>
          <div>
            <ControlLabel>Battle the enemies to find the boss</ControlLabel>
          </div>
          <div>
            <ControlLabel>Bind the Boss and move to next level</ControlLabel>
          </div>
          <div>
            <ControlLabel>10 Levels and you WIN!!!</ControlLabel>
          </div>
          <div>
            <ControlLabel>*** Good Luck ***</ControlLabel>
          </div>
        </div>
    );
  }
}  //// end MapKey


///////////////////////////////////////////////////////////
// BoardEngine
///////////////////////////////////////////////////////////
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
        var cell = {row: row, col: col, level: 0, darkness: 0}; // level = 0 : wall
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
  
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  buildTunnels(arr) {
    // clone the arr
    var newArr = arr.slice();
    
    // build tunnels
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
            newArr[Y][X].level = 1; // TODO: do we need to show tunnel differently?? 2; // tunnel             
          }
        }  
      }
    }
      

    return newArr;
  }
  
  
} //// end BuildEngine


///////////////////////////////////////////////////////////
// GameEngine
///////////////////////////////////////////////////////////
class GameEngine {
  constructor() {
    this.rows        = 0;
    this.cols        = 0;
    
    this.health      = 100;
    this.weapon      = 100;
    this.level       = 1;
    this.score       = 0;
    this.msgLevel    = 1;  // show Level 1
    
    this.healthItems = [];
    this.weaponItems = [];
    this.enemies     = [];
    this.boss        = {};
    this.you         = {};
    this.light       = 0;
    this.jump        = 0;
    this.levelSettings = [];
    
    this.nextLevelFlag = false;
  }

  ////////////////////////////////////////////////////////
  findFloorLocations(total, arr) {
    var locations = [];
    var count = 0;
    
    while (count < total) {
      var x = Math.floor(Math.random() * (this.cols));
      var y = Math.floor(Math.random() * (this.rows));
      if (arr[y][x].level == 1) { // floor
        locations.push({x: x, y: y});
        count += 1;
      }
    }
    return locations;
  }
  
  nextLevel() {
    var result = this.nextLevelFlag;
    this.nextLevelFlag = false;
    return result;
  }
  
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  setLevel(level) {
    this.level = level;
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  setJump() {
    this.jump = 1;
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  toggleLight() {
    this.light = !this.light;
    console.log(this.you);
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  restartLevel() {
    this.light = 0;
    this.jump  = 0;
    
    this.healthItems = this.levelSettings.healthItems.slice();
    this.weaponItems = this.levelSettings.weaponItems.slice();
    this.enemies     = this.levelSettings.enemies.slice();
    this.boss        = this.levelSettings.boss;
    this.you         = this.levelSettings.you;
    this.health      = this.levelSettings.health;
    this.weapon      = this.levelSettings.weapon ;
    this.level       = this.levelSettings.level;
    this.score       = this.levelSettings.score;
  }
  
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  details() {
    return {health: this.health, weapon: this.weapon, level: this.level, score: this.score };
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  message() {
     return this.msgLevel;
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  buildObjects(arr) {
    this.rows = arr.length;
    this.cols = arr[0].length;
    
    var newArr = arr.slice();
    
    this.healthItems = this.findFloorLocations((HEALTH_COUNT_MAX - this.level), newArr);
    for (let i = 0; i < this.healthItems.length; i++) {
      var item = this.healthItems[i];
      item["level"] = 1 + Math.floor(Math.random() * (HEALTH_RANGE_MAX));
      newArr[item.y][item.x].level = (10 * item.level);
    }
    
    this.weaponItems = this.findFloorLocations((WEAPON_COUNT_MAX - this.level), newArr);
    for (let i = 0; i < this.weaponItems.length; i++) {
      var item = this.weaponItems[i];
      item["level"] = 1 + Math.floor(Math.random() * (WEAPON_RANGE_MAX));
      newArr[item.y][item.x].level = (100 * item.level);
    }

    this.levelSettings["healthItems"] = this.healthItems.slice();
    this.levelSettings["weaponItems"] = this.weaponItems.slice();

    return newArr;
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  buildPlayers(arr) {
    this.rows = arr.length;
    this.cols = arr[0].length;
    
    var newArr = arr.slice();
    
    this.enemies = this.findFloorLocations((ENEMY_COUNT_MAX + this.level), newArr);
    for (let i = 0; i < this.enemies.length; i++) {
      var item = this.enemies[i];
      item["level"] = 1 + Math.floor(Math.random() * (ENEMY_RANGE_MAX));
      newArr[item.y][item.x].level = (1000 * item.level);
    }
 
    this.boss = this.findFloorLocations(1, newArr)[0];
    newArr[this.boss.y][this.boss.x].level = (40000);

    this.you = this.findFloorLocations(1, newArr)[0];
    newArr[this.you.y][this.you.x].level = (100000);
    
    this.levelSettings["enemies"] = this.enemies.slice();
    this.levelSettings["boss"]    = this.boss;
    this.levelSettings["you"]     = this.you;

    this.levelSettings["health"]  = this.health;
    this.levelSettings["weapon"]  = this.weapon;
    this.levelSettings["level"]   = this.level;
    this.levelSettings["score"]   = this.score;

    return newArr;
  }
 
  ////////////////////////////////////////////////////////
  isFloorOrTunnel(level) {
    return (level == 1 || level == 2);
  }

  ////////////////////////////////////////////////////////
  isHealth(level) {
    return (level >= 10 && level <= 40);
  }

  ////////////////////////////////////////////////////////
  isWeapon(level) {
    return (level >= 100 && level <= 400);
  }

  ////////////////////////////////////////////////////////
  isEnemy(level) {
    return (level >= 1000 && level <= 4000);
  }

  ////////////////////////////////////////////////////////
  isBoss(level) {
    return (level >= 10000 && level <= 40000);
  }

  ////////////////////////////////////////////////////////
  moveJump(arr, direction) {
    this.msgLevel = 0;  // clear msg
    var X = this.you.x;
    var Y = this.you.y;
    var found = false;
    // Can only jump to open floor, can't jump in tunnels

    if (direction == "up") {
      while (!found) {
        Y -= 1;
        if (Y < 0) Y = this.rows - 1; // wrap
        if (this.isFloorOrTunnel(arr[Y][X].level)) found = true;
      }
    }
    if (direction == "down") {
      while (!found) {
         Y += 1;
        if (Y >= this.rows) Y = 0; // wrap
        if (this.isFloorOrTunnel(arr[Y][X].level)) found = true;
      }
    }
    if (direction == "left") {
      while (!found) {
        X -= 1;
        if (X < 0) X = this.cols - 1; // wrap
        if (this.isFloorOrTunnel(arr[Y][X].level)) found = true;
      }
    }
    if (direction == "right") {
      while (!found) {
        X += 1;
        if (X >= this.cols) X = 0; // wrap
        if (this.isFloorOrTunnel(arr[Y][X].level)) found = true;
      }
    }
   
    // update
    this.jump = 0;
    arr[this.you.y][this.you.x].level = 1;
    arr[Y][X].level = 100000;
    this.you = { x:X, y:Y };
    return found;
  }

  ////////////////////////////////////////////////////////
  moveFloor(arr, direction) {
    var X = this.you.x;
    var Y = this.you.y;
    var found = false;

   if (direction == "up") {
      Y -= 1;
      if (Y >= 0 && this.isFloorOrTunnel(arr[Y][X].level)) found = true;
    }
    if (direction == "down") {
      Y += 1;
      if (Y < this.rows && this.isFloorOrTunnel(arr[Y][X].level)) found = true;
    }
    if (direction == "left") {
      X -= 1;
      if (X >= 0 && this.isFloorOrTunnel(arr[Y][X].level)) found = true;
    }
    if (direction == "right") {
      X += 1;
      if (X < this.cols && this.isFloorOrTunnel(arr[Y][X].level)) found = true;
    }
   
    // update
    this.jump = 0;
    if (found) {
      arr[this.you.y][this.you.x].level = 1;
      arr[Y][X].level = 100000;
      this.you = { x:X, y:Y };  
    }

    return found;
  }

  ////////////////////////////////////////////////////////
  moveHealth(arr, direction) {
    var X = this.you.x;
    var Y = this.you.y;
    var found = false;

    if (direction == "up") {
      Y -= 1;
      if (Y >= 0 && this.isHealth(arr[Y][X].level)) found = true;
    }
    if (direction == "down") {
      Y += 1;
      if (Y < this.rows && this.isHealth(arr[Y][X].level)) found = true;
    }
    if (direction == "left") {
      X -= 1;
      if (X >= 0 && this.isHealth(arr[Y][X].level)) found = true;
    }
    if (direction == "right") {
      X += 1;
      if (X < this.cols && this.isHealth(arr[Y][X].level)) found = true;
    }
   
    // update
    this.jump = 0;
    if (found) {
      this.health += (arr[Y][X].level) / 10;
      arr[this.you.y][this.you.x].level = 1;
      arr[Y][X].level = 100000;
      this.you = { x:X, y:Y };  
    }

    return found;
  }

  ////////////////////////////////////////////////////////
  moveWeapon(arr, direction) {
    var X = this.you.x;
    var Y = this.you.y;
    var found = false;

    if (direction == "up") {
      Y -= 1;
      if (Y >= 0 && this.isWeapon(arr[Y][X].level)) found = true;
    }
    if (direction == "down") {
      Y += 1;
      if (Y < this.rows && this.isWeapon(arr[Y][X].level)) found = true;
    }
    if (direction == "left") {
      X -= 1;
      if (X >= 0 && this.isWeapon(arr[Y][X].level)) found = true;
    }
    if (direction == "right") {
      X += 1;
      if (X < this.cols && this.isWeapon(arr[Y][X].level)) found = true;
    }
   
    // update
    this.jump = 0;
    if (found) {
      this.weapon = (arr[Y][X].level);
      arr[this.you.y][this.you.x].level = 1;
      arr[Y][X].level = 100000;
      this.you = { x:X, y:Y };  
    }

    return found;
  }

  ////////////////////////////////////////////////////////
  moveEnemy(arr, direction) {
    var X = this.you.x;
    var Y = this.you.y;
    var found = false;

    if (direction == "up") {
      Y -= 1;
      if (Y >= 0 && this.isEnemy(arr[Y][X].level)) found = true;
    }
    if (direction == "down") {
      Y += 1;
      if (Y < this.rows && this.isEnemy(arr[Y][X].level)) found = true;
    }
    if (direction == "left") {
      X -= 1;
      if (X >= 0 && this.isEnemy(arr[Y][X].level)) found = true;
    }
    if (direction == "right") {
      X += 1;
      if (X < this.cols && this.isEnemy(arr[Y][X].level)) found = true;
    }
   
    // update
    this.jump = 0;
    if (found) {
      var yourHealth  = this.health;
      var enemyPoints = (arr[Y][X].level);
      
      yourHealth  -= ENEMY_HEALTH_COST;
      enemyPoints -= (this.weapon * ENEMY_WEAPON_FACTOR);
     
      if (yourHealth < 0) {
        // you lose
        this.msgLevel = -1;
        return true;
      } else {
        // adjust health and enemy points
        this.health     = yourHealth;
        arr[Y][X].level = enemyPoints;
        if (enemyPoints <= 0) {
         this.health += 100;
         // move to enemy cell
          arr[this.you.y][this.you.x].level = 1;
          arr[Y][X].level = 100000;
         this.you = { x:X, y:Y };  
        } else {
          // enemy still alive, no move
          return true;
        }
      }
    }

    return found;
  }

  ////////////////////////////////////////////////////////
  moveBoss(arr, direction) {
      // TODO:
      // boss     ok if attempts === enemy points, sub points on attempt, next level if ok
    var X = this.you.x;
    var Y = this.you.y;
    var found = false;

    if (direction == "up") {
      Y -= 1;
      if (Y >= 0 && this.isBoss(arr[Y][X].level)) found = true;
    }
    if (direction == "down") {
      Y += 1;
      if (Y < this.rows && this.isBoss(arr[Y][X].level)) found = true;
    }
    if (direction == "left") {
      X -= 1;
      if (X >= 0 && this.isBoss(arr[Y][X].level)) found = true;
    }
    if (direction == "right") {
      X += 1;
      if (X < this.cols && this.isBoss(arr[Y][X].level)) found = true;
    }
   
    // update
    this.jump = 0;
    if (found) {
      var yourHealth  = this.health;
      var bossPoints = (arr[Y][X].level);
      
      yourHealth -= BOSS_HEALTH_COST;
      bossPoints -= (this.weapon * BOSS_WEAPON_FACTOR);
     
      if (yourHealth < 0) {
        // you lose
        this.msgLevel = -1;
        return true;
      } else {
        // adjust health and enemy points
        this.health     = yourHealth;
        arr[Y][X].level = bossPoints;
        if (bossPoints <= 0) {
          
          if (this.level == 10) {
            // you win
            this.msgLevel = 11;
            return true;
          } else {
            this.level += 1;
            this.score += (this.health + this.weapon); // arbitrarty?
            if (!this.light) this.score += (this.health + this.weapon); // arbitrarty?
            this.msgLevel = this.level;
            this.nextLevelFlag = true;
            return true; 
          }
        } else {
          // boss still alive, no move
          return true;
        }
      }
    }

    return found;
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  move(arr, direction) {
    var newArr = arr.slice();
    
    if (direction.length > 0) {
      if (this.msgLevel == -1 || this.msgLevel == 11)
        return arr;
      
      this.msgLevel = 0;  // clear msg
      if (this.jump) this.moveJump(newArr, direction);
      else {
        var done= false;
        if (!done) done = this.moveFloor(newArr, direction);
        if (!done) done = this.moveHealth(newArr, direction);
        if (!done) done = this.moveWeapon(newArr, direction);
        if (!done) done = this.moveEnemy(newArr, direction);
        if (!done) done = this.moveBoss(newArr, direction);
      }
    }
    
    // add darkness
     for (let row = 0; row < this.rows; row++) {
       for (let col = 0; col < this.cols; col++) {
         var cell = newArr[row][col];
         cell.darkness = 0;
         if (this.light == 0) {
           cell.darkness = 1; // black
           // determine if current location within RADIUS2
           var deltaX = Math.abs(this.you.x - col);
           var deltaY = Math.abs(this.you.y - row);
           if (deltaX < DARKNESS_RADIUS && deltaY < DARKNESS_RADIUS) {
             var radius = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
             if (radius < DARKNESS_RADIUS) {
               cell.darkness = 0; // off
            }
           }
         }

       }
     }
   
    return newArr;
  }

} //// end GameEngine


//////////////////////////////////////////////////////////
class App extends React.Component {
	constructor() {
    super();    

    
    // TODO move this to a common function for resetClick
    this.boardEngine = new BoardEngine();
    var arr;
    arr = this.boardEngine.buildWalls();
    arr = this.boardEngine.buildRooms(arr, ROOMS_MAX);
    arr = this.boardEngine.buildTunnels(arr);

    this.gameEngine = new GameEngine();
    arr = this.gameEngine.buildObjects(arr); // (health, weapons)
    arr = this.gameEngine.buildPlayers(arr); // (enemies, boss, you)
    arr = this.gameEngine.move(arr, "");
    this.levelArr = JSON.stringify(arr);     // deep copy for restart
    var details = this.gameEngine.details();
    var message = this.gameEngine.message();
    this.state  = { arr: arr, details: details, message: message };

    
    this.lightClick    = this.lightClick.bind(this);
    this.restartClick  = this.restartClick.bind(this);
    this.resetClick    = this.resetClick.bind(this);
    this.keys          = this.keys.bind(this);
    document.onkeydown = this.keys;
  }
  
  lightClick() {
    this.gameEngine.toggleLight();
    var arr = this.gameEngine.move(this.state.arr, "");
    this.setState( { arr: arr });
  }

  restartClick() {
    this.gameEngine.restartLevel();
    var arr = JSON.parse(this.levelArr);
    var arr = this.gameEngine.move(arr, "");
    var details = this.gameEngine.details();
    var message = this.gameEngine.message();
    this.setState( { arr: arr, details: details, message: message });
  }

  resetClick() {
    this.boardEngine = new BoardEngine();
    var arr;
    arr = this.boardEngine.buildWalls();
    arr = this.boardEngine.buildRooms(arr, ROOMS_MAX); // TODO base on level
    arr = this.boardEngine.buildTunnels(arr);

    this.gameEngine = new GameEngine();
    arr = this.gameEngine.buildObjects(arr); // (health, weapons)
    arr = this.gameEngine.buildPlayers(arr); // (enemies, boss, you)
    arr = this.gameEngine.move(arr, "");
    this.levelArr = JSON.stringify(arr);
    var details = this.gameEngine.details();
    var message = this.gameEngine.message();
    this.setState( { arr: arr, details: details, message: message });
  }

  keys(e) {
    if (e.key === "j")  this.gameEngine.setJump();
    if (e.key.includes("Arrow")) {
      var code = e.key.replace("Arrow", "").toLowerCase();
      var arr = this.gameEngine.move(this.state.arr, code);
      var details = this.gameEngine.details();
      var message = this.gameEngine.message();
      
      // TODO look for level change, message in [1,10], rebuild board etc>
      if (this.gameEngine.nextLevel()) {
        this.boardEngine = new BoardEngine();
        arr = this.boardEngine.buildWalls();
        arr = this.boardEngine.buildRooms(arr, ROOMS_MAX); // TODO base on level
        arr = this.boardEngine.buildTunnels(arr);

        arr = this.gameEngine.buildObjects(arr); // (health, weapons)
        arr = this.gameEngine.buildPlayers(arr); // (enemies, boss, you)
        details = this.gameEngine.details();
        message = this.gameEngine.message();
      }
      
      
      this.setState( { arr: arr, details: details, message: message });
      return false; // don't want whole window to move
    }
  }

  ////
  //// render
  ////
  render() {
		return (
      <div>
        <h1 className="app-header">freeCodeCamp DV - Roguelike Game</h1>
        <Controls 
          details={this.state.details}
          lightClick={this.lightClick}
          restartClick={this.restartClick}
          resetClick={this.resetClick}
        />
        <Board arr={this.state.arr} />
        <GameMessage message={this.state.message} />
        <MapKey />
        <Footer />
      </div>
		);
	}

} //// end App

///////////////////////////////////////////////////////////
ReactDOM.render(<App />, document.getElementById('roguelikegame'));
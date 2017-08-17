
const URL_RECENT  = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
const URL_ALLTIME = "https://fcctop100.herokuapp.com/api/fccusers/top/alltime";

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

class CamperRow extends React.Component {
	render() {
    var href = "https://freecodecamp.com/" + this.props.camper.username;
    var img  = this.props.camper.img;
    return (
       <tr>
        <td className="col-xs-2">{this.props.rank}</td>
        <td className="col-xs-6">
           <a href={href} target="_blank">
            <img src={img} />
           {this.props.camper.username}
          </a>
        </td>
        <td className="col-xs-2">{this.props.camper.recent}</td>
        <td className="col-xs-2">{this.props.camper.alltime}</td>
      </tr>
    );
  }
}

class Board extends React.Component {
  
	constructor() {
    super();
    this.state             = { campers: [], recent: true };  
    this.setStateRecent    = this.setStateRecent.bind(this);
    this.setStateAllTime   = this.setStateAllTime.bind(this);
    this.handleToggleList  = this.handleToggleList.bind(this);

    $.getJSON(URL_RECENT,  this.setStateRecent);
  }
  
  setStateRecent(data) {
    this.setState( { campers: data, recent: true } );
  }

  setStateAllTime(data) {
    this.setState( { campers: data, recent: false } );
  }

  handleToggleList(e) {
    if (this.state.recent)
      $.getJSON(URL_ALLTIME,  this.setStateAllTime);
    else
      $.getJSON(URL_RECENT,  this.setStateRecent)
    }
 
	render() {
    var rows = [];
    var lastCategory = null;
    this.state.campers.forEach((camper, i) => {
      rows.push(<CamperRow camper={camper} rank={i+1} key={camper.username}/>);
    });
    var recentClassName =  "col-xs-2 " + (this.state.recent ? "sorted" : "notsorted");
    var alltimeClassName = "col-xs-2 " + (this.state.recent ? "notsorted" : "sorted");

		return (
      <div>
        <h1 className="board-header">freeCodeCamp DV - Camper Leaderboard</h1>
        <div className="container">
          <table className="table table-fixed ">
            <thead>
              <tr>
                <th className="col-xs-2">Rank</th>
                <th className="col-xs-6">FCC Camper</th>
                <th className={recentClassName}
                    onClick={this.handleToggleList}>
                      Recent Points
               </th>
                <th className={alltimeClassName}
                    onClick={this.handleToggleList}>
                      All-Time Points
               </th>
               </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table> {/* table */}
        </div> {/* container */}
        
        <Footer />
      </div>
		);
	}
}

ReactDOM.render(<Board />, document.getElementById('board'));

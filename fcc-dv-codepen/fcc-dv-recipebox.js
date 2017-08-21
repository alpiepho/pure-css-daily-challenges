var Button       = ReactBootstrap.Button;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl  = ReactBootstrap.FormControl;
var FormGroup    = ReactBootstrap.FormGroup;
var HelpBlock    = ReactBootstrap.HelpBlock;
var Modal        = ReactBootstrap.Modal;

// TODO

// - button for add new recipe
// - modal for adding new recipe
// - logic behind for adding new recipe

// - buttons for delete and edit
// - modal for delete confirm
// - logic behind for delete
// - modal for edit
// - logic behind for edit

// - better format of parts list
// - format add modal
// - format edit modal
// - format delete confirm modal

// list how this could be ported for Terms5 and steps needed
// can local storage (google) sync to othe browsers and avoid MongoDB?


const DATA_KEY = "recipes";

/*
var mockData = [
  { name: "Chicken Soup",
    parts: ["Chicken",
            "Water",
            "Noodles"]
  },
  { name: "Pumpkin Pie",
    parts: ["Pumpkin Puree",
            "Sweetened Condensed Milk",
            "Eggs",
            "Pumpkin Pie Spice",
            "Pie Crust"
           ]
  }
];
*/

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

/*
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

class CamperTable extends React.Component {
	render() {
    var rows = [];
    var lastCategory = null;
    this.props.campers.forEach((camper, i) => {
      rows.push(<CamperRow camper={camper} rank={i+1} key={camper.username}/>);
    });
    var recentClassName =  "col-xs-2 " + (this.props.recent ? "sorted" : "notsorted");
    var alltimeClassName = "col-xs-2 " + (this.props.recent ? "notsorted" : "sorted");
    return (
        <div className="container">
          <table className="table table-fixed ">
            <thead>
              <tr>
                <th className="col-xs-2">Rank</th>
                <th className="col-xs-6">FCC Camper</th>
                <th className={recentClassName}
                    onClick={this.props.handleToggleList}>
                      Recent Points
               </th>
                <th className={alltimeClassName}
                    onClick={this.props.handleToggleList}>
                      All-Time Points
               </th>
               </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
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
		return (
      <div>
        <h1 className="board-header">freeCodeCamp DV - Recipe Box</h1>
        <CamperTable
          campers={this.state.campers}
          recent={this.state.recent}
          handleToggleList={this.handleToggleList}
        />
        <Footer />
      </div>
		);
	}
}


*/

class RecipePanel extends React.Component {
	render() {
    var id   = "collapse" + this.props.id;
    var href = "#" + id;
    var parts = [];
    var ingredients = this.props.recipe.parts.sort(function(a, b) {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    });
    ingredients.forEach((part, i) => {
      parts.push(<li className="list-group-item" key={i}>{part}</li>);
    });

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href={href}>
              {this.props.recipe.name}</a>
          </h4>
        </div>
        <div id={id} className="panel-collapse collapse">
          <ul className="list-group">
            {parts}
          </ul>
        </div>
      </div>
    );
  }
}

class RecipePanels extends React.Component {
	render() {
    var panels = [];
    var recipes = this.props.recipes.sort(function(a, b) {
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });
    recipes.forEach((recipe, i) => {
      panels.push(<RecipePanel recipe={recipe} id={i+1} key={i}/>);
    });
    return (

        <div className="panel-group" id="accordion">
           {panels}
        </div>
    );
  }
}

class AddRecipeModal extends React.Component {
	constructor() {
    super();

    this.getValid          = this.getValid.bind(this);
    this.handleNameChange  = this.handleNameChange.bind(this);
    this.handlePartsChange = this.handlePartsChange.bind(this);
    this.handleSave        = this.handleSave.bind(this);

    this.state = { name: '', parts: '' };
  }


  getValid() {
    const length = this.state.name.length;
    if (length > 0) return true;
    return false;
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handlePartsChange(e) {
    this.setState({ parts: e.target.value });
  }

  handleSave(e) {
    var data = {};
    data["name"] = this.state.name;
    data["parts"] = this.state.parts.split(",").map(function(e) {return e.trim()});
    this.props.saveAdd(data);
    this.setState({ name: '', parts: '' });
  }

	render() {
    return (
        <Modal show={this.props.showAdd} onHide={this.props.closeAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <form>
              <FormGroup
                controlId="formBasicText"
              >
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  placeholder="Enter name"
                  onChange={this.handleNameChange}
                />
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl
                  type="textarea"
                  value={this.state.value}
                  placeholder="Enter ingredients (comma separated)"
                  onChange={this.handlePartsChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </form>

          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={this.handleSave}
              disabled={this.getValid() == false}>
              Add Recipe
            </Button>
            <Button
              bsStyle="primary"
              onClick={this.props.closeAdd}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}


class RecipeBox extends React.Component {
	constructor() {
    super();

    this.getData  = this.getData.bind(this);
    this.saveData = this.saveData.bind(this);

    this.openAdd  = this.openAdd.bind(this);
    this.closeAdd = this.closeAdd.bind(this);
    this.saveAdd  = this.saveAdd.bind(this);

    // DEBUG: override with mock data
    //this.saveData(mockData);
    //this.saveData([]);

    this.state = { recipes: this.getData(), showAdd: false };
  }

  getData() {
    var data = [];
    if (typeof(Storage) !== "undefined") {
      data = localStorage.getItem(DATA_KEY);
      if (data !== undefined) {
        data = JSON.parse(data);
      }
    } else {
      console.log("WARNING: no local storage, cannot save recipes.");
    }
    return data;
  }

  saveData(data) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } else {
      console.log("WARNING: no local storage, cannot save recipes.");
    }
  }

  openAdd() {
    this.setState( { showAdd: true } );
  }

  closeAdd() {
    this.setState( { showAdd: false } );
  }

  saveAdd(newRecipe) {
    this.setState( { showAdd: false } );

    var recipes = this.state.recipes;
    recipes.push(newRecipe);
    this.saveData(recipes);
  }

	render() {
		return (
      <div>
        <h1 className="app-header">freeCodeCamp DV - Recipe Box</h1>
        <RecipePanels recipes={this.state.recipes} />
        <Button
          bsStyle="primary"
          onClick={this.openAdd}>
          Add New Recipe
        </Button>
        <AddRecipeModal
          showAdd={this.state.showAdd}
          saveAdd={this.saveAdd}
          closeAdd={this.closeAdd}
        />

        <Footer />
      </div>
		);
	}
}

ReactDOM.render(<RecipeBox />, document.getElementById('recipebox'));

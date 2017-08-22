// NOTES: This is the solution for the freeCodeCamp project at:
// https://www.freecodecamp.com/challenges/build-a-recipe-box
//
// This was implemented the "React way"...no jQuery (I peaked at the example
// application when I was nearly done with this...it useds jQuery to re-use
// the single Modal dialog.  And it doesn't ask for confirmation in delete.)
//
// One area of question is the use of 3 separate Modal dialogs.  On one
// hand it makes it clear that they are used independently.  On the other
// there is wasted code (HTML and JS).  I'm also not sure how best to
// combine them: 1) add props to condition on in render? 2) implement with
// sub-class?


// components from ReactBootstrap (https://react-bootstrap.github.io/components.html)
var Button       = ReactBootstrap.Button;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl  = ReactBootstrap.FormControl;
var FormGroup    = ReactBootstrap.FormGroup;
var HelpBlock    = ReactBootstrap.HelpBlock;
var Modal        = ReactBootstrap.Modal;


//////////////////////////////////////////////////////////////////////////////////
// Mock Data
//////////////////////////////////////////////////////////////////////////////////
var mockData = [
  { name: "Chicken Soup",
    id: 0,
    parts: ["Chicken",
            "Water",
            "Noodles"]
  },
  { name: "Pumpkin Pie",
    id: 1,
    parts: ["Pumpkin Puree",
            "Sweetened Condensed Milk",
            "Eggs",
            "Pumpkin Pie Spice",
            "Pie Crust"
           ]
  }
];

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


//////////////////////////////////////////////////////////////////////////////////
// RecipePanel - panel for recipe name and ingredients (parts)
//////////////////////////////////////////////////////////////////////////////////
class RecipePanel extends React.Component {
	constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit   = this.handleEdit.bind(this);
  }

  handleDelete() { this.props.openDelete(this.props.recipe); }

  handleEdit()   { this.props.openEdit(this.props.recipe); }

	render() {
    var id   = "collapse" + this.props.id;
    var href = "#" + id;
    var listItems = [];
    var ingredients = this.props.recipe.parts.sort(function(a, b) {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    });
    ingredients.forEach((part, i) => {
      listItems.push(<li className="list-group-item" key={i}>{part}</li>);
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
            {listItems}
          </ul>
          <Button
            bsStyle="danger"
            onClick={this.handleDelete}>
            Delete
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.handleEdit}>
            Edit
          </Button>
        </div>
      </div>
    );
  }
}

//////////////////////////////////////////////////////////////////////////////////
// RecipePanels - component for all panels
//////////////////////////////////////////////////////////////////////////////////
class RecipePanels extends React.Component {
	render() {
    var panels = [];
    var recipes = this.props.recipes.sort(function(a, b) {
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });
    recipes.forEach((recipe, i) => {
      panels.push(<RecipePanel
                    openDelete={this.props.openDelete}
                    openEdit={this.props.openEdit}
                    recipe={recipe}
                    id={i+1}
                    key={i}/>);
    });
    return (
        <div className="panel-group" id="accordion">
           {panels}
        </div>
    );
  }
}


//////////////////////////////////////////////////////////////////////////////////
// AddRecipeModal - Modal specific to adding a new recipe
//////////////////////////////////////////////////////////////////////////////////
class AddRecipeModal extends React.Component {
	constructor() {
    super();

    this.getValid          = this.getValid.bind(this);
    this.handleNameChange  = this.handleNameChange.bind(this);
    this.handlePartsChange = this.handlePartsChange.bind(this);
    this.handleSave        = this.handleSave.bind(this);

    this.state = { name: '', parts: '' };
  }

  getValid()           { return (this.state.name.length > 0); }
  handleNameChange(e)  { this.setState({ name: e.target.value }); }
  handlePartsChange(e) { this.setState({ parts: e.target.value }); }

  handleSave(e) {
    var data = {};
    data["name"]  = this.state.name;
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
                controlId="formBasicText">
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
              bsStyle="success"
              onClick={this.handleSave}
              disabled={this.getValid() == false}>
              Add
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

//////////////////////////////////////////////////////////////////////////////////
// DeleteRecipeModal - Modal specific to deleting a recipe
//////////////////////////////////////////////////////////////////////////////////
class DeleteRecipeModal extends React.Component {
	constructor(props) {
    super(props);

    this.getValid          = this.getValid.bind(this);
    this.handleNameChange  = this.handleNameChange.bind(this);
    this.handlePartsChange = this.handlePartsChange.bind(this);
    this.handleUpdate      = this.handleUpdate.bind(this);

    this.state = { recipe: this.props.recipe };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ recipe: nextProps.recipe });
  }

  getValid() {
    const length = this.state.recipe.name.length;
    if (length > 0) return true;
    return false;
  }

  handleNameChange(e) {
    let recipe = this.state.recipe;
    recipe.name = e.target.value;
    this.setState({ recipe: recipe });
  }

  handlePartsChange(e) {
    let recipe = this.state.recipe;
    recipe.parts = e.target.value.split(",").map(function(e) {return e.trim()});
    this.setState({ recipe: recipe });
  }

  handleUpdate(e) {
    this.props.saveDelete(this.state.recipe);
    let recipe = { name: "", parts: []};
    this.setState({ recipe: recipe });
  }

	render() {
    let name     = this.state.recipe.name;
    let partsStr = this.state.recipe.parts.join(', ');

    return (
        <Modal show={this.props.showDelete} onHide={this.props.closeDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <form>
              <FormGroup
                controlId="formBasicText">
                <ControlLabel>Are you sure you want to delete '{name}'?</ControlLabel>
              </FormGroup>
            </form>

          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="danger"
              onClick={this.handleUpdate}>
              Delete
            </Button>
            <Button
              bsStyle="primary"
              onClick={this.props.closeDelete}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}


//////////////////////////////////////////////////////////////////////////////////
// EditRecipeModal - Modal specific to editing a recipe
//////////////////////////////////////////////////////////////////////////////////
class EditRecipeModal extends React.Component {
	constructor(props) {
    super(props);

    this.getValid          = this.getValid.bind(this);
    this.handleNameChange  = this.handleNameChange.bind(this);
    this.handlePartsChange = this.handlePartsChange.bind(this);
    this.handleUpdate      = this.handleUpdate.bind(this);

    this.state = { recipe: this.props.recipe };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ recipe: nextProps.recipe });
  }

  getValid() {
    const length = this.state.recipe.name.length;
    if (length > 0) return true;
    return false;
  }

  handleNameChange(e) {
    let recipe = this.state.recipe;
    recipe.name = e.target.value;
    this.setState({ recipe: recipe });
  }

  handlePartsChange(e) {
    let recipe = this.state.recipe;
    recipe.parts = e.target.value.split(",").map(function(e) {return e.trim()});
    this.setState({ recipe: recipe });
  }

  handleUpdate(e) {
    this.props.saveEdit(this.state.recipe);
    let recipe = { name: "", parts: []};
    this.setState({ recipe: recipe });
  }

	render() {
    let name     = this.state.recipe.name;
    let partsStr = this.state.recipe.parts.join(', ');

    return (
        <Modal show={this.props.showEdit} onHide={this.props.closeEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <form>
              <FormGroup
                controlId="formBasicText">
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  value={name}
                  placeholder="Enter name"
                  onChange={this.handleNameChange}
                />
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl
                  type="textarea"
                  value={partsStr}
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
              onClick={this.handleUpdate}
              disabled={this.getValid() == false}>
              Update
            </Button>
            <Button
              bsStyle="primary"
              onClick={this.props.closeEdit}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}


//////////////////////////////////////////////////////////////////////////////////
class RecipeBox extends React.Component {
	constructor() {
    super();

    this.getData    = this.getData.bind(this);
    this.saveData   = this.saveData.bind(this);

    this.openAdd    = this.openAdd.bind(this);
    this.closeAdd   = this.closeAdd.bind(this);
    this.saveAdd    = this.saveAdd.bind(this);

    this.openDelete   = this.openDelete.bind(this);
    this.closeDelete  = this.closeDelete.bind(this);
    this.saveDelete   = this.saveDelete.bind(this);

    this.openEdit   = this.openEdit.bind(this);
    this.closeEdit  = this.closeEdit.bind(this);
    this.saveEdit   = this.saveEdit.bind(this);

    // DEBUG: override to clear all
    //localStorage.clear();

    this.state = { recipes:      this.getData(),
                   showAdd:      false,
                   deleteRecipe: { name: "", parts: [] },
                   showDelete:   false,
                   editRecipe:   { name: "", parts: [] },
                   showEdit:     false
                 };
  }

  ////
  //// get/set using Local Storage
  ////
  getData() {
    var data = [];
    if (typeof(Storage) !== "undefined") {
      data = localStorage.getItem("recipes");
      if (data !== null) {
        data = JSON.parse(data);
      } else {
        data = mockData;
      }
    } else {
      console.log("WARNING: no local storage, cannot save recipes.");
    }
// DEBUG: dump the contents of localStorage
//console.log(data);
    return data;
  }

  saveData(data) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("recipes", JSON.stringify(data));
    } else {
      console.log("WARNING: no local storage, cannot save recipes.");
    }
  }

  ////
  //// utility to find index of a given recipe
  ////
  findRecipeIndex(given) {
    var index = -1;
    for (let i=0; i < this.state.recipes.length; i++) {
      let recipe = this.state.recipes[i];
      if (given.id === recipe.id) index = i;
    }
    return index;
  }

  ////
  //// support for AddRecipeModal
  ////
  openAdd() {
    this.setState( { showAdd: true } );
  }

  closeAdd() {
    this.setState( { showAdd: false } );
  }

  saveAdd(newRecipe) {
    this.setState( { showAdd: false } );

    var recipes = this.state.recipes;
    newRecipe.id = recipes.length;
    recipes.push(newRecipe);
    this.saveData(recipes);
  }

  ////
  //// support for DeleteRecipeModal
  ////
  openDelete(deleteRecipe) {
    this.setState( { showDelete: true, deleteRecipe: deleteRecipe } );
  }

  closeDelete() {
    this.setState( { showDelete: false } );
  }

  saveDelete(newRecipe) {
    this.setState( { showDelete: false } );

    var index = this.findRecipeIndex(newRecipe);
    var recipes = this.state.recipes;
    recipes.splice(index, 1); // remove
    this.saveData(recipes);
  }

  ////
  //// support for EditRecipeModal
  ////
  openEdit(editRecipe) {
    this.setState( { showEdit: true, editRecipe: editRecipe } );
  }

  closeEdit() {
    this.setState( { showEdit: false } );
  }

  saveEdit(newRecipe) {
    this.setState( { showEdit: false } );

    var index = this.findRecipeIndex(newRecipe);
    var recipes = this.state.recipes;
    recipes.splice(index, 1); // remove
    recipes.push(newRecipe);  // replace
    this.saveData(recipes);
  }


  ////
  //// render
  ////
	render() {
		return (
      <div>
        <h1 className="app-header">freeCodeCamp DV - Recipe Box</h1>
        <RecipePanels
          recipes={this.state.recipes}
          openDelete={this.openDelete}
          openEdit={this.openEdit}
        />
        <Button
          bsStyle="primary"
          onClick={this.openAdd}>
          New
        </Button>
        <AddRecipeModal
          showAdd={this.state.showAdd}
          saveAdd={this.saveAdd}
          closeAdd={this.closeAdd}
        />
        <DeleteRecipeModal
          showDelete={this.state.showDelete}
          saveDelete={this.saveDelete}
          closeDelete={this.closeDelete}
          recipe={this.state.deleteRecipe}
        />
        <EditRecipeModal
          showEdit={this.state.showEdit}
          saveEdit={this.saveEdit}
          closeEdit={this.closeEdit}
          recipe={this.state.editRecipe}
        />
        <Footer />
      </div>
		);
	}
}

//////////////////////////////////////////////////////////////////////////////////
ReactDOM.render(<RecipeBox />, document.getElementById('recipebox'));

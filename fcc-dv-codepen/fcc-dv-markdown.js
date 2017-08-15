

const defaultMarkdown = `# Markdown Previewer
This is the result of the freeCodeCamp project to build a Markdown Previewer application with SASS and React.js. Details can be found [here](https://www.freecodecamp.com/challenges/build-a-markdown-previewer).

Markdown is the language used for the familar README.md file that is shown as the documentation for all Github and Bitbucket repositories.

## from Wikipedia
Wikipedia has a really good description of the history of Markdown and samples of how ig used: [here](https://en.wikipedia.org/wiki/Markdown).

### example-markdown (from Wikipedia)
    # Heading
    ## Sub-heading

    ### Another deeper heading

    Paragraphs are separated
    by a blank line.

    Two spaces at the end of a line leave a
    line break.

    Text attributes _italic_, *italic*, __bold__, **bold**, \`monospace\`.

    Horizontal rule:

    ---

    Bullet list:

      * apples
      * oranges
      * pears

    Numbered list:

      1. apples
      2. oranges
      3. pears

    A [link](http://example.com).

### example-result (from Wikipedia)
# Heading
## Sub-heading

### Another deeper heading

Paragraphs are separated
by a blank line.

Two spaces at the end of a line leave a
line break.

Text attributes _italic_, *italic*, __bold__, **bold**, \`monospace\`.

Horizontal rule:

---

Bullet list:

* apples
* oranges
* pears

Numbered list:

1. apples
2. oranges
3. pears

A [link](http://example.com).


`;

class Footer  extends React.Component {
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

// using the ES6 class form since FB is deprecation the React.createClass technique
class Previewer extends React.Component {

	constructor() {
    super();

    // hold onto a single instance of 'marked'
    this.marked = marked.setOptions({
      renderer: new marked.Renderer(),
      sanitize: true
    });

    // keeping both raw and cooked versions of the text in state
    // could use a function from the preview pane and convert on
    // the fly and save state, but I think that is less clear and
    // someone reading code would need to look into that function
    // to see that the rendered preview would change when state
    // changes.
    this.state = { raw: defaultMarkdown, cooked: this.marked(defaultMarkdown) }

    // explicit bindings once time in constructor
    this.handleTextChange  = this.handleTextChange.bind(this);
    this.handleTextDefault = this.handleTextDefault.bind(this);
    this.handleTextClear   = this.handleTextClear.bind(this);
  }

  handleTextChange(e) {
    let str = e.target.value;
    this.setState( { raw: str, cooked: this.marked(str) } );
  }

  handleTextDefault(e) {
    this.setState( { raw: defaultMarkdown, cooked: this.marked(defaultMarkdown) } );
  }

  handleTextClear(e) {
    let str = "";
    this.setState( { raw: str, cooked: this.marked(str) } );
  }

	render() {
		return (
      <div>
        <h1 className="previewer-header">freeCodeCamp DV - Markdown Previewer</h1>
        <div className="container">
          <div class="row">

          <div className="col-md-6">
              <div className="form-group">
                <h2 className="previewer-component">Raw</h2>
                <textarea
                  className="raw"
                  value={this.state.raw}
                  onChange={this.handleTextChange}/>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <h2 className="previewer-component">Cooked</h2>
                <div className="cooked"
                  dangerouslySetInnerHTML={{__html: this.state.cooked}}>
                </div>
              </div>
           </div>

          <div className="col-md-12">
           <button
             type="button"
             className="btn btn-primary"
             onClick={this.handleTextDefault}>
               restore default
            </button>
           <button
             type="button"
             className="btn btn-primary"
             onClick={this.handleTextClear}>
               clear raw input
            </button>
          </div>

          </div> {/* row */}
        </div>
        <Footer />
      </div>
		);
	}
}

ReactDOM.render(<Previewer />, document.getElementById('previewer'));

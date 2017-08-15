

const defaultMarkdown = `
This seems to be a common example:



GitHub Flavored Markdown
================================

----
## Markdown quick reference
# headers

*View the [source of this content](http://github.github.com/github-flavored-markdown/sample_content.html).*

Let's get the whole "linebreak" thing out of the way. The next paragraph contains two phrases separated by a single newline character:

Roses are red
Violets are blue

The next paragraph has the same phrases, but now they are separated by two spaces and a newline character:

Roses are red
Violets are blue

Oh, and one thing I cannot stand is the mangling of words with multiple underscores in them like perform_complicated_task or do_this_and_do_that_and_another_thing.



...see the link for more...
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

class Previewer extends React.Component {

	constructor() {
    super();
    this.marked = marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });

    let processed = this.marked(defaultMarkdown);
    this.state = { raw: defaultMarkdown, processed: processed }
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    let str = e.target.value;
    let processed = this.marked(str);
    this.setState( { raw: str, processed: processed } );
  }

	render() {
		return (
			<div>
				<h1>freeCodeCamp DV Markdown Previewer</h1>
 				<div className="form-group">
          <h2>Raw</h2>
          <textarea className="raw"
            value={this.state.raw}
            onChange={this.handleTextChange}/>
				</div>
 				<div className="form-group">
          <h2>Preview</h2>
          <div className="processed"
            dangerouslySetInnerHTML={{__html: this.state.processed}}>
          </div>
				</div>

        <Footer />
			</div>
		);
	}
}

ReactDOM.render(<Previewer />, document.getElementById('previewer'));

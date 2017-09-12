
var url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");
var radius = 100;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-10))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(function(d) {
      return 20
    }));

d3.json(url, function(graph) {

  for (let i = 0; i < graph.nodes.length; i++) {
    var entry = graph.nodes[i];
    entry["id"] = i;
  }

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke", 'grey')
      .attr("stroke-width", '1');
 
  var node = d3.select(".box").append("div")
      .attr("class", "nodes")
    .selectAll("img")
    .data(graph.nodes)
    .enter().append("img")
      .attr("class",  function(d) { return ("flag flag-" + d.code); })
      .style("position", "absolute")
      .attr("width", 24)
      .attr("height", 16)
      //.attr("width", 5)
      //.attr("height", 5)
      //.attr("fill", function(d) { return color(d.group); })
      //.attr("fill", 'blue')
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  //node.append("title")
  //    .text(function(d) { return d.country; });



  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    //node
       //.attr("cx", function(d) { return d.x; })
        //.attr("cy", function(d) { return d.y; });
       // .attr("x", function(d) { return d.x; })
       // .attr("y", function(d) { return d.y; });
    node
      .style("top", function(d) { return  (d.y + 105) +"px";})
      .style("left", function(d) { return (d.x + 45) +"px";})
      .attr("x", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
      .attr("y", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

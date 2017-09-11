//var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Helper function
/*
function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day + ', ' + year;
}
*/

// MAIN
d3.json(url, function(jsonData) {
  // DEBUG
  //jsonData = jsonData.slice(0, 4);
  
  var margin   = { top: 0, right: 0, bottom: 30, left: 20 };
  var height   = 500 - margin.top - margin.bottom;
  var width    = 600 - margin.left - margin.right;
  var rankings = [];
  var times    = [];
  var points   = []; // TODO remove duplication with dollars/dates

  // gather values and dates, so we can properly scale axis
  var maxXData = 0;
  var maxYData = 0;
  var minXData = 10000000;
  var minYData = 10000000;
  for (let i = 0; i < jsonData.length; i++) {
    var entry = jsonData[i];

    maxXData = (entry.Seconds > maxXData ? entry.Seconds: maxXData);
    maxYData = (entry.Place   > maxYData ? entry.Place  : maxXData);
    minXData = (entry.Seconds < minXData ? entry.Seconds: minXData);
    minYData = (entry.Place   < minYData ? entry.Place  : minYData);
    points.push(entry);
  }

  
  
  // map y domain to y range
  var yScale = d3.scaleLinear()
    .domain([0, maxYData])
    .range([0,height]);

  // map y axis values to range
  var yAxisValues = d3.scaleLinear()
    .domain([0, maxYData])
    .range([height,0]);

  /*
  // build y axis with 10 ticks over the range
  var yAxisTicks = d3.axisLeft(yAxisValues)
  .ticks(10)
  */

//  // map x domain to x range and set bar padding
// var xScale = d3.scaleBand()
//    .domain([0, maxXData])
//    .paddingInner(.1)
//    .paddingOuter(.1)
//    .range([0, width])
  // map x domain to x range
  var xScale = d3.scaleLinear()
    .domain([minXData, maxXData])
    .range([0,width]);

  /*
  // map x axis values to range
  var xAxisValues = d3.scaleTime()
    .domain([dates[0], dates[(dates.length-1)]])
    .range([0, width])

  // build x axis with ticks every 5 years
  var xAxisTicks = d3.axisBottom(xAxisValues)
    .ticks(d3.timeYear.every(5))

  // build tool tip
  var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0)
    .style('pointer-events', 'none');
   */
 
  // build the svgContainer/chart
  var svgContainer = d3.select('#chart')
    .append('svg')
    .style('padding', '30px')
    .style('overflow', 'visible')
    .attr('width',  width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.right + ')');
  
  // add the circles to the svgContainer
  var circles = svgContainer.selectAll('circle')
    .data(points)
    .enter()
    .append('circle');
  
  // add the circleAttributes to the svgContainer
  var circleAttributes = svgContainer.selectAll('circle')
    // for each point...
    .attr('r', '5')
    .attr('fill', function(d) {
      if (d.Doping.length > 0) return "#E4545A";
      else return "black";
    })
  /*
      .attr('width', function(d) {
        return xScale.bandwidth();
      })
      .attr('height', function(d) {
        return yScale(d.value);
      })
*/
    .attr('cx', function(d) {
        // NOTE: want this reversed, or longest time to shortest
        // TODO: neet to scale based on shortest time
        //return xScale(d.Seconds);
      return width - xScale(d.Seconds);
    })
    .attr('cy', function(d) {
        // NOTE: want this reversed, or high Rank to lowest Rank
        // normally we need to invert with height due to orientation
        // of Y scale.  don't need that is this case.
        //return height - yScale(d.Place);
      return yScale(d.Place);
    })
      /*
      // add the tooltip ON
      .on('mouseover', function(d) {
        tooltip.transition().duration(200)
          .style('opacity', .9)
        tooltip.html(
          '<div style="font-size: 1rem; font-weight: bold">' +
            d.value + ' $B</div><div>' + d.date + '</div>'
        )
          .style('left', (d3.event.pageX -35) + 'px')
          .style('top', (d3.event.pageY -30) + 'px')
        tempColor = this.style.fill;
        d3.select(this)
          .style('fill', 'yellow')
      })
      // add the tool tip OFF
      .on('mouseout', function(d) {
        tooltip.html('')
        d3.select(this)
          .style('fill', tempColor)
      })
      */
 
  //Add the SVG Text Element to the svgContainer
var text = svgContainer.selectAll("text")
                       .data(points)
                       .enter()
                       .append("text");

//Add SVG Text Element Attributes
var textLabels = text
  .attr("x", function(d) { return (width - xScale(d.Seconds)) + 10; })
  .attr("y", function(d) { return (yScale(d.Place)) + 4; })
  .text( function (d) { return d.Name })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("fill", "black");

  
  /*
  // add y guide group using previous y axis
  var yGuide = d3.select('#bar-chart svg').append('g')
            .attr('transform', 'translate(20,0)')
            .call(yAxisTicks);

  // add x guide group using previous x axis
  var xGuide = d3.select('#bar-chart svg').append('g')
            .attr('transform', 'translate(20,'+ height + ')')
            .call(xAxisTicks);

  // add Title
  d3.select('#bar-chart svg').append("text")
    .attr('x', width / 2 )
    .attr('y', 0)
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('text-decoration', 'underline')
    .text("Gross Domestic Product");

  // add Y-axis text label
  d3.select('#bar-chart svg').append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0+margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product, in $ Billions");  

  // add Notes below (using separate html div)
  d3.select('#notes')
    .style('margin-top', '-20px')
    .style('margin-bottom', '20px')
    .style('text-align', 'center')
    .style('font-size', '0.8em')
    .append("text")
    .text(jsonData.description);
    */
});



var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

// Helper function
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

// MAIN
d3.json(url, function(gdpData) {
  
  var margin  = { top: 0, right: 0, bottom: 30, left: 20 };
  var height  = 400 - margin.top - margin.bottom;
  var width   = 600 - margin.left - margin.right;
  var dollars = [];
  var dates   = [];
  var points  = []; // TODO remove duplication with dollars/dates

  var yScale;
  var yAxisValues;
  var yAxisTicks;
  var yGuide;
  var xScale;
  var xAxisValues;
  var xAxisTicks;
  var xGuide;
  var tooltip;
  var myChart;

  // gather values and dates, so we can properly scale axis
  for (let i = 0; i < gdpData.data.length; i++) {
    var entry = gdpData.data[i];
    dollars.push(entry[1]);
    dates.push( new Date(entry[0]) );
    var date  = new Date(entry[0]);
    var point = { value: entry[1], date: formatDate(date) };
    points.push(point);
  }

  // map y domain to y range
  yScale = d3.scaleLinear()
    .domain([0, d3.max(dollars)])
    .range([0,height]);

  // map y axis values to range
  yAxisValues = d3.scaleLinear()
    .domain([0, d3.max(dollars)])
    .range([height,0]);

  // build y axis with 10 ticks over the range
  yAxisTicks = d3.axisLeft(yAxisValues)
  .ticks(10)

  // map x domain to x range and set bar padding
  xScale = d3.scaleBand()
    .domain(dollars)
    .paddingInner(.1)
    .paddingOuter(.1)
    .range([0, width])

  // map x axis values to range
  xAxisValues = d3.scaleTime()
    .domain([dates[0], dates[(dates.length-1)]])
    .range([0, width])

  // build x axis with ticks every 5 years
  xAxisTicks = d3.axisBottom(xAxisValues)
    .ticks(d3.timeYear.every(5))

  // build tool tip
  tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0)
    .style('pointer-events', 'none');
 
  // finally build the chart itself
  // (lots of parts)
  myChart = d3.select('#bar-chart').append('svg')
    .style('padding', '30px')
    .attr('width',  width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.right + ')')
    // add the points
    .selectAll('rect').data(points)
    .enter().append('rect')
      // for each point...
      .attr('fill', '#2D8BCF')
      .attr('width', function(d) {
        return xScale.bandwidth();
      })
      .attr('height', function(d) {
        return yScale(d.value);
      })
      .attr('x', function(d) {
        return xScale(d.value);
      })
      .attr('y', function(d) {
        return height - yScale(d.value);
      })
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
      });
  
  // add y guide group using previous y axis
  yGuide = d3.select('#bar-chart svg').append('g')
            .attr('transform', 'translate(20,0)')
            .call(yAxisTicks);

  // add x guide group using previous x axis
  xGuide = d3.select('#bar-chart svg').append('g')
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
    .text(gdpData.description);
});


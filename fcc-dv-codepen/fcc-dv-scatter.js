
var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// MAIN
d3.json(url, function(jsonData) {
  // DEBUG
  //jsonData = jsonData.slice(0, 4);
  
  var margin   = { top: 0, right: 0, bottom: 30, left: 20 };
  var height   = 500 - margin.top - margin.bottom;
  var width    = 600 - margin.left - margin.right;
  var points   = []; 

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
    .domain([maxYData, 1])
    .range([height,0]);

  // build y axis with 10 ticks over the range
  var yAxisTicks = d3.axisLeft(yAxisValues)
  .ticks(10)

  // map x domain to x range
  var xScale = d3.scaleLinear()
    .domain([minXData, maxXData])
    .range([0,width]);

  // map x axis values to range
  var xAxisValues = d3.scaleLinear()
    .domain([maxXData/1000, 0])
    .range([0, width])

  // build x axis with ticks every 5 years
  var xAxisTicks = d3.axisBottom(xAxisValues)
    .ticks(10)

  // build tool tip
  var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0)
    .style('pointer-events', 'none');
 
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
      else                     return "#555555";
    })
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
    // add the tooltip ON
    .on('mouseover', function(d) {
      tooltip.transition().duration(200)
        .style('opacity', .9)
      tooltip.html(
        '<div style="font-size: 1rem; font-weight: bold">' +
                  d.Name + '</div>' + 
        '<div>Country: ' + d.Nationality + '</div>' +
        '<div>Year: ' + d.Year + '</div>' +
        '<div>Time: ' + d.Time + '</div>' +
        '<br><div style="width: 150px">' + d.Doping + '</div>'
      )
      .style('left', '20%')
      .style('top',  '200px')
      tempColor = this.style.stroke;
      d3.select(this)
        .style('stroke', 'black')
    })
    // add the tool tip OFF
    .on('mouseout', function(d) {
      tooltip.html('')
      d3.select(this)
        .style('stroke', tempColor)
    })

 
  // add the circleText elements to the svgContainer
  var circleText = svgContainer.selectAll("text")
                       .data(points)
                       .enter()
                       .append("text");

  // add circleText Attributes
  var circleLabels = circleText
  .attr("x", function(d) { return (width - xScale(d.Seconds)) + 10; })
  .attr("y", function(d) { return (yScale(d.Place)) + 4; })
  .html( function (d) { 
    var str = d.Name;
    if (d.URL.length > 0)
      str = '<a rel="nofollow" href="' + d.URL + '" target="_blank">' + d.Name + '</a>';
    return(str);
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("fill", "black");

  
  // add y guide group using previous y axis
  var yGuide = svgContainer.append('g')
            .attr('transform', 'translate(-10,0)')
            .call(yAxisTicks);

  // add x guide group using previous x axis
  var xGuide = svgContainer.append('g')
            .attr('transform', 'translate(0, '+ (height+10) + ')')
            .call(xAxisTicks);

  // add Title
  var chartTitle = svgContainer.append("text")
    .attr('x', width / 2 )
    .attr('y', 0)
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('text-decoration', 'underline')
    .attr("font-family", "sans-serif")
    .text("Allegations in Professional Cycling");

  // add y-axis text label
  var yLabel = svgContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -90 + margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Place Ranking");  

    // add x-axis text label
  var xLabel = svgContainer.append("text")
    .attr("y", 40 + height)
    .attr("x", 0 + (width / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Seconds Behind the Leader");  


  // add Notes below (using separate html div)
  // TODO: should this be completely in HTML/CSS??
  d3.select('#notes')
    .style('margin-top', '20px')
    .style('margin-bottom', '50px')
    .style('text-align', 'center')
    .style('font-size', '0.8em')
    .style('text-align', 'left')
    .style('position', 'absolute')
    .style('left', '60%')
    .style('top',  (height - 10) + 'px')
    .append("text")
      .html(
        '<div>' +
        '<div><div class="withoutDoping"></div> without allagations</div>' +
        '<div><div class="withDoping"></div> with allagations (name links to details)</div>' + 
        '</div>'
      );

});


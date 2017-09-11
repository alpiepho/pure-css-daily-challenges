
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// MAIN
d3.json(url, function(jsonData) {
  // DEBUG
  //jsonData.monthlyVariance = jsonData.monthlyVariance.slice(0, 36);
  
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var margin   = { top: 0, right: 0, bottom: 30, left: 20 };
  var height   = 500 - margin.top - margin.bottom;
  var width    = 800 - margin.left - margin.right;
  var points   = []; 

  // gather values and dates, so we can properly scale axis
  var maxXData = 0;
  var maxYData = 0;
  var minXData = 10000000;
  var minYData = 10000000;
  var maxValue = 0;
  var minValue = 10000000;
  for (let i = 0; i < jsonData.monthlyVariance.length; i++) {
    var entry = jsonData.monthlyVariance[i];
    entry.value = jsonData.baseTemperature + entry.variance;

    maxXData = (entry.year   > maxXData ? entry.year:  maxXData);
    maxYData = (entry.month  > maxYData ? entry.month: maxYData);
    minXData = (entry.year   < minXData ? entry.year:  minXData);
    minYData = (entry.month  < minYData ? entry.month: minYData);
    maxValue = (entry.value  > maxValue ? entry.value:  maxValue);
    minValue = (entry.value  < minValue ? entry.value: minYData);

    points.push(entry);
  }
   
  function heat(d) {
    var delta = (maxValue - minValue) / 11;
    var result = "";
    /*
    matches example:
    if      (d.value < (minValue + 1*delta))  result = "#5E4FA2";
    else if (d.value < (minValue + 2*delta))  result = "#3288BD";
    else if (d.value < (minValue + 3*delta))  result = "#66C2A5";
    else if (d.value < (minValue + 4*delta))  result = "#ABDDA4";
    else if (d.value < (minValue + 5*delta))  result = "#E6F598";
    else if (d.value < (minValue + 6*delta))  result = "#FFFFBF";
    else if (d.value < (minValue + 7*delta))  result = "#FEE08B";
    else if (d.value < (minValue + 8*delta))  result = "#FDAE61";
    else if (d.value < (minValue + 9*delta))  result = "#F46D43";
    else if (d.value < (minValue + 10*delta)) result = "#D53E4F";
    else                                      result = "#9E0142";
    */
    // grey scale
    if      (d.value < (minValue + 1*delta))  result = "#111";
    else if (d.value < (minValue + 2*delta))  result = "#222";
    else if (d.value < (minValue + 3*delta))  result = "#333";
    else if (d.value < (minValue + 4*delta))  result = "#444";
    else if (d.value < (minValue + 5*delta))  result = "#555";
    else if (d.value < (minValue + 6*delta))  result = "#666";
    else if (d.value < (minValue + 7*delta))  result = "#777";
    else if (d.value < (minValue + 8*delta))  result = "#888";
    else if (d.value < (minValue + 9*delta))  result = "#999";
    else if (d.value < (minValue + 10*delta)) result = "#aaa";
    else                                      result = "#bbb";
    return result;
  }
  
  function heatWidth(d) {
    // NOTE: want to divide width by points, but gets too thin
    return '5px';
  }
  
  // map y domain to y range
  var yScale = d3.scaleBand()
    .domain([1,2,3,4,5,6,7,8,9,10,11,12])
    //.paddingInner(.1)
    //.paddingOuter(.1)
    .range([0,height]);

  // map y axis values to range
  var yAxisValues = d3.scaleLinear()
    .domain([maxYData, 1])
    .range([(height*11)/12 , 0]);

  // build y axis with 10 ticks over the range
  var yAxisTicks = d3.axisLeft(yAxisValues)
  .ticks(10)

  // map x domain to x range
  var xScale = d3.scaleLinear()
    .domain([minXData, maxXData])
    .range([0,width]);

  // map x axis values to range
  var xAxisValues = d3.scaleLinear()
    .domain([minXData, maxXData])
    .range([0, width])

  // build x axis with ticks every 5 years
  var xAxisTicks = d3.axisBottom(xAxisValues)
    .ticks(10).tickFormat(d3.format("d"))

  // build tool tip
  var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('color', 'white')
    .style('background', 'black')
    .style('border-radius', '1em')
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
  
  // add the rects to the svgContainer
  var rects = svgContainer.selectAll('rect')
    .data(points)
    .enter()
    .append('rect');
  
  // add the rectAttributes to the svgContainer
  var rectAttributes = svgContainer.selectAll('rect')
    // for each point...
    .attr('fill', function(d) { 
      return heat(d);
    })
    .attr('x', function(d) {
      return xScale(d.year);
    })
    .attr('y', function(d) {
      return yScale(d.month);
    })
   .attr('width', function(d) {
        return heatWidth();
   })
   .attr('height', function(d) {
        return yScale.bandwidth();
   })
  // add the tooltip ON
  .on('mouseover', function(d) {
    tooltip.transition().duration(200)
      .style('opacity', .9)
    tooltip.html(
      '<div style="font-size: 1rem; font-weight: bold">' +
      monthNames[d.month-1] + ' ' + 
      d.year + '</div>' +
      '<div>Variance:' + d.variance.toFixed(3) + ' C</div>' +
      '<div>Temp: ' + d.value.toFixed(3) + ' C</div>'
    )
      .style('left', (d3.event.pageX + 10) + 'px')
      .style('top', (d3.event.pageY -40) + 'px')
    tempColor = this.style.fill;
    d3.select(this)
      .style('fill', 'purple')
  })
  // add the tool tip OFF
  .on('mouseout', function(d) {
    tooltip.html('')
    d3.select(this)
      .style('fill', tempColor)
  })


 

  // add y guide group using previous y axis
  var yGuide = svgContainer.append('g')
            .attr('transform', 'translate(-10,20)')
            .call(yAxisTicks);

  // add x guide group using previous x axis
  var xGuide = svgContainer.append('g')
            .attr('transform', 'translate(0, '+ (height+10) + ')')
            .call(xAxisTicks);


  // add Title
  var chartTitle = svgContainer.append("text")
    .attr('x', width / 2 )
    .attr('y', -20)
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('text-decoration', 'underline')
    .attr("font-family", "sans-serif")
    .text("Monthly Land-Surface Temperature Variance");


  // add y-axis text label
  var yLabel = svgContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -70 + margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Month");  

    // add x-axis text label
  var xLabel = svgContainer.append("text")
    .attr("y", 40 + height)
    .attr("x", 0 + (width / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Year");  

});


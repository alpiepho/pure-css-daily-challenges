

// started with some examples: (in d3.js v4)
// http://bl.ocks.org/almccon/fe445f1d6b177fd0946800a48aa59c71
// https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a


// build tool tip
var tooltip = d3.select('body')
.append('div')
.style('position', 'absolute')
.style('padding', '0 10px')
.style('color', 'black')
.style('background', 'white')
.style('border-radius', '1rem 1rem 1rem 0')
.style('padding', '10px')
.style('opacity', 0)
.style('pointer-events', 'none');

// get handle to svg, and its w/h
var svg    = d3.select("svg");
var width  = +svg.attr("width");
var height = +svg.attr("height");

// build a geo projection and center
var projection = d3.geoMercator()
.scale(width / 2 / Math.PI)
.translate([width / 2, height / 2])

// add the path
var path = d3.geoPath()
.projection(projection);

// add group for the zoom 
var zoomg = svg.append("g")
.attr("class", "everything");

var geourl = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";
d3.json(geourl, function(err, geojson) {
  zoomg.append("path")
    .attr("d", path(geojson))
})

// add zoom capabilities 
var zoom_handler = d3.zoom()
.on("zoom", zoom_actions);

// call zoom handler
zoom_handler(svg);     


// now add meteor data
var dataurl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
d3.json(dataurl, function (jsonData) { 
  //DEBUG
  //jsonData.features = jsonData.features.slice(0, 932);

  // process data
  for (let i = 0; i < jsonData.features.length; i++) {
    var entry = jsonData.features[i];
    if (entry.geometry == undefined)
      entry.geometry = { coordinates: [-1, -1] };
    var mass = Number.parseInt(entry.properties.mass);
    entry.mass = mass;
    entry.radius = circleRadius(entry);
  }

  node = svg.selectAll("circle")
		.data(jsonData.features).enter()
		.append("circle")
		.attr("cx", function (d) { 
      return projection(d.geometry.coordinates)[0]; 
    })
		.attr("cy", function (d) { 
      return projection(d.geometry.coordinates)[1]; 
    })
		.attr("r", function(d) {
      return d.radius + "px"; 
    })
		.attr("fill", function(d) { 
      return circleColor(d);
    })
		.attr("opacity", "0.5")
    .on('mouseover', function(d) {
    tooltip.transition().duration(0)
      .style('opacity', .9)
    tooltip.html(
      '<div>name: ' + d.properties.name + '</div>' +
      '<div>class: ' + d.properties.recclass + '</div>' +
      '<div>mass: ' + (d.properties.mass == undefined ? "NA" : d.properties.mass) + '</div>' +
      '<div>year: ' + d.properties.year.slice(0,4) + '</div>'
    )
      .style('left', (d3.event.pageX +10) + 'px')
      .style('top', (d3.event.pageY -100) + 'px')
  })
  // add the tool tip OFF
    .on('mouseout', function(d) {
    tooltip.html('')
    .style('opacity', 0)
  })

});

/////////////////////////
// Support functions
/////////////////////////

// zoom functions
function zoom_actions(){
  // adjust zoom group around map
  zoomg.attr("transform", d3.event.transform);
  // adjust nodes
  node.attr("transform", d3.event.transform);
  // adjust node radius
  // (less magnification when map is zoomed in)
  node.attr("r", function(d) {
    var radius = d.radius;
    var scale = d3.event.transform.k * 0.5;
    // only adjust when zooming in
    if (d3.event.transform.k < 1) {
      radius = d.radius/scale;
    }
    return (d.radius/d3.event.transform.k);
  });
  tooltip.html('')
  .style('opacity', 0);
}

// function for radius based on mass
function circleRadius(d) {
  var result;
  if      (d.mass < (10)) result = 1;
  else if (d.mass < (1000))  result = 2;
  else if (d.mass < (100000))  result = 4;
  else if (d.mass < (100000000))  result = 8;
  else                              result = 16;
  return result;
}

// fuction for color based on classification
function circleColor(d) {
  // from:
  // https://answersingenesis.org/astronomy/age-of-the-universe/radioisotope-dating-meteorites-ii-ordinary-and-enstatite-chondrites/
  // generate colors for 
  // 1) Chrondrites,      #EF1C25
  // 2) Stony,            #BCDCAC
  // 3) Stony-Iron,       #CCDCF4
  // 4) Iron,             #F4B4A4
  // 5) and Achhondrites  #FCC20C
  if      (d.properties.recclass == "Acapulcoite")            result = "white";
  else if (d.properties.recclass == "Achondrite-ung")         result = "white";
  else if (d.properties.recclass == "Angrite")                result = "white";
  else if (d.properties.recclass == "Aubrite")                result = "white";
  else if (d.properties.recclass == "C")                      result = "#BCDCAC";
  else if (d.properties.recclass == "C2-ung")                 result = "#BCDCAC";
  else if (d.properties.recclass == "C3-ung")                 result = "#BCDCAC";
  else if (d.properties.recclass == "CBa")                    result = "#BCDCAC";
  else if (d.properties.recclass == "CI1")                    result = "#BCDCAC";
  else if (d.properties.recclass == "CK4")                    result = "#BCDCAC";
  else if (d.properties.recclass == "CM2")                    result = "#BCDCAC";
  else if (d.properties.recclass == "CO3.2")                  result = "#BCDCAC";
  else if (d.properties.recclass == "CO3.3")                  result = "#BCDCAC";
  else if (d.properties.recclass == "CO3.4")                  result = "#BCDCAC";
  else if (d.properties.recclass == "CO3.5")                  result = "#BCDCAC";
  else if (d.properties.recclass == "CO3.6")                  result = "#BCDCAC";
  else if (d.properties.recclass == "CR2")                    result = "#BCDCAC";
  else if (d.properties.recclass == "CR2-an")                 result = "#BCDCAC";
  else if (d.properties.recclass == "CV3")                    result = "#BCDCAC";
  else if (d.properties.recclass == "Diogenite")              result = "white";
  else if (d.properties.recclass == "Diogenite-pm")           result = "white";
  else if (d.properties.recclass == "EH3")                    result = "#BCDCAC";
  else if (d.properties.recclass == "EH3/4-an")               result = "#BCDCAC";
  else if (d.properties.recclass == "EH4")                    result = "#BCDCAC";
  else if (d.properties.recclass == "EH5")                    result = "#BCDCAC";
  else if (d.properties.recclass == "EH7-an")                 result = "#BCDCAC";
  else if (d.properties.recclass == "EL6")                    result = "#BCDCAC";
  else if (d.properties.recclass == "Eucrite")                result = "#BCDCAC";
  else if (d.properties.recclass == "Eucrite-br")             result = "#BCDCAC";
  else if (d.properties.recclass == "Eucrite-cm")             result = "#BCDCAC";
  else if (d.properties.recclass == "Eucrite-mmict")          result = "#BCDCAC";
  else if (d.properties.recclass == "Eucrite-pmict")          result = "#BCDCAC";
  else if (d.properties.recclass == "H")                      result = "#BCDCAC";
  else if (d.properties.recclass == "H/L3.6")                 result = "#BCDCAC";
  else if (d.properties.recclass == "H/L3.9")                 result = "#BCDCAC";
  else if (d.properties.recclass == "H/L4")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H3")                     result = "#BCDCAC";
  else if (d.properties.recclass == "H3-4")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H3-5")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H3-6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H3.4")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H3.7")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H3.8")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H3/4")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H4")                     result = "#BCDCAC";
  else if (d.properties.recclass == "H4-5")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H4-6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H4-an")                  result = "#BCDCAC";
  else if (d.properties.recclass == "H4/5")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H5")                     result = "#BCDCAC";
  else if (d.properties.recclass == "H5-6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H5-7")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H5/6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "H6")                     result = "#BCDCAC";
  else if (d.properties.recclass == "H?")                     result = "#BCDCAC";
  else if (d.properties.recclass == "Howardite")              result = "#BCDCAC";
  else if (d.properties.recclass == "Iron")                   result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IAB-MG")           result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IAB-sHL")          result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IAB-sLL")          result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IAB-ung")          result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IIAB")             result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IID")              result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IIE")              result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IIE-an")           result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IIF")              result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IIIAB")            result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, IVA")              result = "#F4B4A4";
  else if (d.properties.recclass == "Iron, ungrouped")        result = "#F4B4A4";
  else if (d.properties.recclass == "Iron?")                  result = "#F4B4A4";
  else if (d.properties.recclass == "K3")                     result = "#BCDCAC";
  else if (d.properties.recclass == "L")                      result = "#BCDCAC";
  else if (d.properties.recclass == "L/LL4")                  result = "#BCDCAC";
  else if (d.properties.recclass == "L/LL5")                  result = "#BCDCAC";
  else if (d.properties.recclass == "L/LL6")                  result = "#BCDCAC";
  else if (d.properties.recclass == "L3")                     result = "#BCDCAC";
  else if (d.properties.recclass == "L3-4")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L3-6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L3.4")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L3.6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L3.7")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L3.7-6")                 result = "#BCDCAC";
  else if (d.properties.recclass == "L4")                     result = "#BCDCAC";
  else if (d.properties.recclass == "L4-6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L5")                     result = "#BCDCAC";
  else if (d.properties.recclass == "L5-6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L5/6")                   result = "#BCDCAC";
  else if (d.properties.recclass == "L6")                     result = "#BCDCAC";
  else if (d.properties.recclass == "LL")                     result = "#BCDCAC";
  else if (d.properties.recclass == "LL3-6")                  result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.00")                 result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.15")                 result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.2")                  result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.3")                  result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.4")                  result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.6")                  result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.8")                  result = "#BCDCAC";
  else if (d.properties.recclass == "LL3.9")                  result = "#BCDCAC";
  else if (d.properties.recclass == "LL4")                    result = "#BCDCAC";
  else if (d.properties.recclass == "LL5")                    result = "#BCDCAC";
  else if (d.properties.recclass == "LL6")                    result = "#BCDCAC";
  else if (d.properties.recclass == "Lodranite")              result = "white";
  else if (d.properties.recclass == "Martian (chassignite)")  result = "#BCDCAC";
  else if (d.properties.recclass == "Martian (nakhlite)")     result = "#BCDCAC";
  else if (d.properties.recclass == "Martian (shergottite)")  result = "#BCDCAC";
  else if (d.properties.recclass == "Mesosiderite")           result = "#CCDCF4";
  else if (d.properties.recclass == "Mesosiderite-A1")        result = "#CCDCF4";
  else if (d.properties.recclass == "Mesosiderite-A3")        result = "#CCDCF4";
  else if (d.properties.recclass == "Mesosiderite-A3/4")      result = "#CCDCF4";
  else if (d.properties.recclass == "OC")                     result = "white";
  else if (d.properties.recclass == "Pallasite")              result = "white";
  else if (d.properties.recclass == "Pallasite, PMG")         result = "white";
  else if (d.properties.recclass == "R3.8-6")                 result = "#BCDCAC";
  else if (d.properties.recclass == "Stone-uncl")             result = "#BCDCAC";
  else if (d.properties.recclass == "Ureilite")               result = "#BCDCAC";
  else if (d.properties.recclass == "Ureilite-an")            result = "#BCDCAC";
  else if (d.properties.recclass == "Winonaite")              result = "#BCDCAC";
  else   result = "white";
  return result;
}

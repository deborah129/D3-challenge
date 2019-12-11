// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(censusData) {

    // Print the censusData
    // console.log(censusData);
    // Format the date and cast the force value to a number
    censusData.forEach(function(data) {
      data.poverty = parseFloat(data.poverty);
      data.age = parseFloat(data.age);
      data.healthcare = parseFloat(data.healthcare);
      data.smokes = parseFloat(data.smokes);
    //   console.log(data.abbr);
  
  });
    console.log(censusData);
// Configure a linear scale with a range between the chartHeight and 0
var xLinearScale = d3.scaleLinear()
.domain([8, d3.max(censusData, data => data.poverty)])
.range([0, chartWidth]);

var yLinearScale = d3.scaleLinear()
    .domain([3, d3.max(censusData, data => data.healthcare)])
    .range([chartHeight, 0]);

// Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale); 

  // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

      // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".75")
    .on('mouseover', function(data){
      tooltip.show(data);
    })
    .on('mouseout', function(data, index){
      tooltip.hide(data);
    })
    var tooltip = d3.tip()
    .attr("class", "tooltip")
    .offset([-8, 0])
    .html(function(d) { return (`${d.state}<br>Poverty:${d.poverty}%<br> Lacks Healthcare:${d.healthcare}%`)});
    svg.call(tooltip);

    var textGroup = chartGroup.selectAll("text.abbr")
    .data(censusData)
    .enter()
    .append("text")
    .attr("class","abbr")
    .attr("x", d => xLinearScale(d.poverty)-6)
    .attr("y", d => yLinearScale(d.healthcare)+3)
    .text(d=>d.abbr)
    .style("font-size", 6)
    .style("fill","blue");

   // Create axes labels
   chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left + 10)
   .attr("x", 0 - (chartHeight)/2-40)
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Lacks Healthcare(%)");

 chartGroup.append("text")
   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top -20})`)
   .attr("class", "axisText")
   .text("In Poverty(%)");
}).catch(function(error) {
 console.log(error); 
});
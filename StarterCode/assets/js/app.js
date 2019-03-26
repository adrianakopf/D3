// Setting width and height of svg ***********
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;


// setting the margins, to adjust ***********
var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

// Create SVG wrapper, append svg, and shift appropriately ***********
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
// Setting the width and height of chart ***********
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// append an svg group***********
var chart = svg.append('g')

// adding a div w/ class tooltip and style opacity 0 ***********
d3.select('#scatter').append('div').attr('class','tooltip').style('opacity', 0)

// load data from data.csv ***********
d3.csv('assets/data/data.csv').then(function(stateData) {
  // console.log(stateData)

  // Step 1: Parse/Cast Data, can clean up by using forEach function  ***********
  var abbr = stateData.map(element => element.abbr)
  var state = stateData.map(element => element.state)
  var poverty = stateData.map(element => +element.poverty)
  var income = stateData.map(element => +element.income)
  var obesity = stateData.map(element => +element.obesity)
  // console.log(obesity)
  // console.log(income)

  // Step 2: Create Scale functions ***********
  // using income vs obesity
  var xLinearScale = d3.scaleLinear()
    .domain([35000, d3.max(income)+5000])
    .range([0, width]) 

  var yLinearScale = d3.scaleLinear()
    .domain([15, d3.max(obesity) + 5])
    .range([height ,0]) 

  // Step 3: Create Axis functions ***********
  var bottomAxis = d3.axisBottom(xLinearScale)
  var leftAxis = d3.axisLeft(yLinearScale)

  // Step 4: Append Axes to the chart ***********
  chart.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(bottomAxis)

  chart.append('g')
    .call(leftAxis)

  // Step 5: Create Circles ***********
  var circlesGroup = chart.selectAll('circle')
    .data(stateData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.income))
    .attr('cy', d => yLinearScale(d.obesity))
    .attr('r', 16)
    .attr('fill', 'blue')
    .attr('opacity','.5')

  // Step 6: initialize tooltip  ***********
  var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80,-60])
    .html(function(d) {
      return (`${d.state} <br>Income: ${d.income}<br>Obesity: ${d.obesity}`)
    })


  // Step 7: Create tooltip in the chart ***********
  chart.call(toolTip)

  // Step 8: Create event listeners to display and hide the tooltip  ***********
  circlesGroup.on('click', function(data) {
    toolTip.show(data,this)
  })
    .on('mouseout', function(data,index) {
      toolTip.hide(data,this)
    })
    .on('mouseover', function(data,index){
      toolTip.show(data,this)
    
    })

  // Step 9: Create Axes Labels ***********
  chart.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0-margin.left - 10)
    .attr('x', 0-(height/2))
    .attr('dy', '2em')
    .attr('class','axisText')
    .text('Obesity (in BMI)')

  chart.append('text')
    .attr('transform', `translate(${width / 2}, ${height + 40 })`)
    .attr('class', 'axisText')
    .text('Income (in thousands)')

  // Step 10: Create State Labels ***********
  chart.append('text')
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(stateData)
    .enter()
    .append("tspan")
    // .append('text')
      .attr('x', d => xLinearScale(d.income))
      .attr('y', d => yLinearScale(d.obesity))
      .text(d => d.abbr)
})

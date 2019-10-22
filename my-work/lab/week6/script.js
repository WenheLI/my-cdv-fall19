let w = 1200;
let h = 800;

// for convenience
let datafile = "data.json";
let padding = 40;
// scale to map from min and max of our x values to the
// boundaries (minus padding) of our svg:
// function to retrieve only the data points
// belonging to one step in time:
function getStep(data, step){
  return data.filter(function(datapoint){
    if(datapoint.step == step){
      return true;
    }else{
      return false;
    }
  });
}


const buttons = Array.from(document.getElementsByClassName('button'))


// creating the svg that holds everything else
// we do this outside the gotData function to
// keeps things clean
let viz = d3.select("#container")
  .append('svg')
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "darkcyan")
;


let vizgroup = viz.append('g').attr('class', 'vizGroup');
let step = 43;

const drawViz = (target ,incomingData, xScale, yScale) => {
  let data = incomingData.filter((it) => it.name === target);

  let datagroups = vizgroup.selectAll(".datagroup").data(data)
  let enterDataGroup = datagroups.enter()
    .append("g")
    .attr("class", "datagroup")
  ;
  enterDataGroup.append("circle")
      .attr("r", 5)
      .attr("fill", "white")
  ;
  enterDataGroup.transition().attr("transform", function(d, i){
      return "translate("+ xScale(d.x) + ", " + yScale(d.y) + ")"
    });


  datagroups.exit().remove();

  datagroups.transition().duration(1000).attr("transform", function(d, i){
    return "translate("+ xScale(d.x) + ", " + yScale(d.y) + ")"
  });
}


function gotData(incomingData){
  // checking out our data
  console.log(incomingData);
  // testing the filter function defined above
  console.log(getStep(incomingData, 0));

  const xDomain = d3.extent(incomingData, (d) => {
    return d.x;
  });
  let xScale = d3.scaleLinear().domain(xDomain).range([padding, w-padding]);
  // create axis for this scale
  let xAxis = d3.axisBottom(xScale);
  // create a groyp to gold the axis elements
  let xAxisGroup = viz.append("g").attr("class", "xaxis");
  // tell d3 to fill the group with the axis elements
  xAxisGroup.call(xAxis);
  // position the axis at the bottom of the svg
  xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
  const yDomain = d3.extent(incomingData, (d) => {
    return d.y;
  });
  let yScale = d3.scaleLinear().domain(yDomain).range([h-padding, padding]);
  let yAxis = d3.axisLeft(yScale);
  let yAxisGroup = viz.append("g").attr("class", "yaxis");
  yAxisGroup.call(yAxis);
  yAxisGroup.attr("transform", "translate("+padding+",0)");
  drawViz('A', incomingData, xScale, yScale);

  buttons.forEach((it) => {
    it.addEventListener('click', (e) => {
       drawViz(e.target.innerText, incomingData, xScale, yScale);
    })
  })
}





d3.json(datafile).then(gotData);

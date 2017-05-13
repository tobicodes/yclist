var buzzwordCount ={}
var width = 1540
var height = 600

d3.csv('./yclist.csv', function(foo) {
	for (var i = 0; i< foo.length; i++){
		for (var key in foo[i]){
			buzzwordCount[foo[i].Buzzword] = foo[i].NumberOfCompanies		// create an object with all our data from 
		}	
	}
var buzzwordCountValues = Object.values(buzzwordCount).sort(function(a,b){return b-a})   

var buzzwordNums = []
for (var i = 0; i < buzzwordCountValues.length; i++){
	buzzwordNums[i] = parseInt(buzzwordCountValues[i])
}

var buzzwordCountKeys =[];
for (var i = 0; i< buzzwordNums.length; i++){
	for (var key in buzzwordCount){
		if (buzzwordCount[key] === buzzwordNums[i].toString()){
			buzzwordCountKeys.push(key)
		}
	}
}	

var tooltip = d3.select("body")
                .append("div")
                .classed('tooltip', true)
                .style("opacity",0);

d3.select("svg")
	.attr("width", width)
	.attr("height", height)
  .classed("my_svg", true)
  .selectAll("circle")
  .data(buzzwordNums)
  .enter()
  .append("circle")
	.attr("cx",function(d, i){
			return (i * 50) + 80- 2*i
	})  // need to move the x for each circle
	.attr("cy",300)	// keep y constant
    .attr('r',d => d/2)
    .attr('fill','peachpuff')
    .attr("stroke-width", "1px")
    .attr("stroke", "black")
    .classed("circleText", true)
    .data(buzzwordCountKeys)
    .on("mouseenter", function(d) {
    	tooltip.text(d)
           .style("opacity", 1)
           .style("left", d3.event.pageX + "px")
           .style("top", d3.event.pageY + "px");
        tooltip.html("Category: "+ d[0].toUpperCase() + d.slice(1))
    .on("mouseout", () => tooltip.style("opacity", 0))
          
  })
 
// d3.select("svg")
// 	.selectAll("text")
// 	.data(buzzwordCountKeys)
// 	.enter()
// 	.append("text")
//   .text(d => d)
//   .attr("x", (d,i) => (i * 50) + 80)
//   .attr("y", "450");

})


// d3.csv('./companies.csv', function(foo) {
// 	d3.select("")
// 	.on("click", function(d){

 
// 	})



    // make bar chart for each subsection i.e. sum of money raised by companies with "platforms" in their descr
    // show bar chart on click of button
   


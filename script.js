var width = 1200
var height = 2500

var xValues = [200,600,1000] // 3 x positions
var yValues = [200, 550, 900, 1250,1600,1950,2300]  // 7 levels of dataPoints calculated using (i*350)+200

var firstColumnIndices = [0,3,6,9,12,15,18]
var secondColumnIndices = [1,4,7,10,13,16,19]
var thirdColumnIndices = [2,5,8,11,14,17,20]
    

var startups_by_year = {   // generated these from Python script
	Year1: [2, 1, 5],
	Year2: [9, 4, 4],
	Year3: [11, 12, 9],
	Year4: [16, 20, 7],
	Year5: [4, 27, 8],
	Year6: [20, 26, 14],
	Year7: [28, 50, 15]
}

var summary_of_startups = {
	Year1: [],
	Year2: [],
	Year3: [],
	Year4: [],
	Year5: [],
	Year6: [],
	Year7: []
}

function startups_by_year_in_percentages(){
	for (var key in startups_by_year){
		for (var i = 0; i< startups_by_year[key].length; i++){
			 var sum = startups_by_year[key].reduce(function(a, b){return a+ b})
			 summary_of_startups[key][i] = Math.floor(100*startups_by_year[key][i]/sum)
		}
	}
	return summary_of_startups
}

startups_by_year_in_percentages()

//Creating an array of 21 arrays to represent each data point. Each array has [value, X position, Y position]


var circleData = []
function populateXData (textToBeDisplayed,array){  // textToBeDisplayed is an array of calculated percentages
	
	for (var key in summary_of_startups){
		for (var i = 0; i < summary_of_startups[key].length; i++){
			var arr = []
			arr[0] = summary_of_startups[key][i]
			if (i === 0){
				arr[1] = xValues[0]
				array.push(arr)
			} else if(i ===1){
				arr[1] = xValues[1]
				array.push(arr)
			} else if (i ===2){
				arr[1] = xValues[2]
				array.push(arr)
			}
		}
	}
	return array;
}

populateXData(summary_of_startups, circleData)


function populateYdata(arr){
		for (var i = 0; i < arr.length; i++){
			if (i <=2){
				arr[i][2] = yValues[0]
			}else if( 3<= i && i <=5){
				arr[i][2] = yValues[1]
			}else if(6<= i  && i <=8){
				arr[i][2] = yValues[2]
			}else if(9<= i && i <=11){
				arr[i][2] = yValues[3]
			}else if(12<= i && i <=14){
				arr[i][2] = yValues[4]
			}else if(15<= i && i <=17){
				arr[i][2] = yValues[5]
			}else if(18<= i && i <=20){
				arr[i][2] = yValues[6]
			} else return 
		}
	return arr
}

populateYdata(circleData) 

var scaleDiameter = d3.scaleLinear()
    .domain([0, 100])
    .range([40,130]);

d3.select("svg")
	.attr("width", width)
	.attr("height", height)
  .classed("my_svg", true)
  .selectAll("circle")
  .data(circleData)
  .enter()
  .append("circle")
	.attr("cx",function(d, i){
			if (firstColumnIndices.includes(i)){
				return xValues[0]	
			}else if(secondColumnIndices.includes(i)){
				return xValues[1]
			} else if (thirdColumnIndices.includes(i)){
				return (xValues[2])
			} else return 
		})
	.attr("cy",function(d,i){
		if (i >= 0 && i<= 2){
			return yValues[0]
		}else if (i >=3 && i <=5){
			return yValues[1]
		}else if (i >= 6 && i <=8){
			return yValues[2]
		}else if (i >= 9 && i <=11){
			return yValues[3]
		}else if (i >= 12 && i <=14){
			return yValues[4]
		} else if (i >= 15 && i <=17){
			return yValues[5]
		}else if (i >= 18 && i <=20){
			return yValues[6]
		}else return

	})	
    .attr('r',function(d,i){
    		return scaleDiameter(d[0])
    })
    .attr('fill','#222')
    .attr("stroke-width", "30px")
    .attr("stroke", "salmon")
    .classed("allCircles", true);

    d3.selectAll("circle")
    	.attr("stroke", function(d,i){
        if (firstColumnIndices.includes(i)){
          return "salmon"
        }
        else if (secondColumnIndices.includes(i)){
          return "moccasin"
        }
        else if (thirdColumnIndices.includes(i)){
          return "#98ff98"
        }
    })
	
// need a new array to hold "text to be displayd under each circle [text, Xposition, Yposition]"
var textData = []

populateXData(summary_of_startups, textData)  // Add X values to textData array of arrays
populateYdata(textData)						  // Add Y values to textData array of arrays

// Changing the first value in array of arrays to be either "%Dead, %Alive or % Exited"

for (var i = 0; i < textData.length; i++){
	if (firstColumnIndices.includes(i)){
		textData[i][0] = "% Dead"
	}else if(secondColumnIndices.includes(i)){
		textData[i][0] = "% Alive"
	}
	else if(thirdColumnIndices.includes(i)){
		textData[i][0] = "% Exited"
	}
}

// Creating a master array of objects to hold info for each class the corresponding Y-value after being calculated

var classNames = ["Class of 2005", "Class of 2006", "Class of 2007", "Class of 2008", "Class of 2009", "Class of 2010", "Class of 2011"];
var classnameYValues = []

function findYValueForClassNames(arr,listOfClassNames){
  for (var i = 0; i < listOfClassNames.length; i++ ){
  		arr.push((i*350) + 50)
  }
  return arr
}

findYValueForClassNames(classnameYValues,classNames)


function createClassArr(listOfClassNames,listofYValues){  //creating master array
	var classArr = []
	for (var i = 0; i< listOfClassNames.length; i++){
		classArr.push({})
		classArr[i].Class = listOfClassNames[i]
		classArr[i].YValue = listofYValues[i]
	}
	return classArr
}

var myMasterArray = createClassArr(classNames,classnameYValues)

// Putting text on screen

d3.select("svg")
    .selectAll("text")
	.data(circleData)
	.enter()
	.append("text")     // This sections put my percentages on the screen
		.style("fill", "white")
		.attr("x", d => d[1]-35)  // 50px is an adjustment factor that I'm using to center the text
	  	.attr("y", d=> d[2])
	  	.text(function(d, i){
	  		if (firstColumnIndices.includes(i)){
	  			return d[0] + "% Dead"
	  		}else if (secondColumnIndices.includes(i)){
	  			return d[0] + "% Alive"
	  		} else if (thirdColumnIndices.includes(i)){
	  			return d[0] + "% Exited"}
	  	  	})
	  	  .attr("font-size", 20)
  	.select("text")
	.data(myMasterArray)    // This section puts my Class Titles on the screen at the appropriate Y value
	.enter()
	.append("text")
		.style("fill", "white")
		.classed("classTitles", true)
		.attr("x", 530)
		.attr("y", d=> d.YValue)
		.attr("font-size", 30)
		.text((d,i) => d.Class)

	// var allCircles = d3.selectAll("circle .allCircles")

	// // d3.select("#danceButton")
	// // 	.on("click", function(){
	// // 		console.log("Hello")
	// // 		allCircles
	// // 			.transition()
	// // 			.attr("x", 200 )
	// // 			.attr("y", 200);


	// // 	})



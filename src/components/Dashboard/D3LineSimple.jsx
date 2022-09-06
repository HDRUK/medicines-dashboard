import React, { useEffect } from 'react';

import * as d3 from 'd3';

import { defaultChartDims, startSVG, AddYLabel} from './UtilsD3'


import ObjectHelper from "./ObjectHelper"


export const LineChartSimple = ({ chart_id, data, chartCols, country_code, legendsColors,legendState,legendFilter}) => {


  data = ObjectHelper.GetObjByKey(country_code,data)
  
  useEffect(() => {

      //if no data return
      if(ObjectHelper.isEmpty(data)){
          return
      }

      let chartDims = defaultChartDims();

      let svg = startSVG(chart_id, chartDims)

      // Define the line
      var chartLine = d3.line()
        // .curve(d3.curveBasis)
        .x(function(d) { return x(d[chartCols['x']]); })
        .y(function(d) { return y(d[chartCols['y']]); });


    // Set the ranges
    var x = d3.scaleTime().range([0, chartDims.width]);  
    var y = d3.scaleLinear().range([chartDims.height, 0]);

  // Scale the range of the data
    x.domain(data['x_extent']).nice();
    y.domain([0, data['y_max']]).nice();


    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y"));

    // Loop through each symbol / key
    data['dataNested'].forEach(function(d,i) { 
       
        let opac = 1
        opac =  (legendState[i] === true ) ? 1 : 0.2
        
        svg.append("path")
            .attr("class", "line")
            .style('opacity', opac)
            .style("fill","none")
            // .style("stroke", d.color) 
            .style("stroke", function() { // Add the colours dynamically
              
                return d.color = legendsColors[d.key]; })

         
            .attr("d", chartLine(d.value));
  
      });

 
  // Add the X Axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + chartDims.height + ")")
     
      .call(xAxis)
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-90)")

  // Add the Y Axis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

  AddYLabel(svg,chartDims.left,chartDims.height)

    
    
  }, [data, legendState, chart_id, chartCols, legendsColors]);

  return (
    <div> <div id={chart_id} /> </div>);
}
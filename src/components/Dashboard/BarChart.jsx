import React, { useEffect } from 'react';

import * as d3 from 'd3';

import { defaultChartDims, startSVG, addXAxis, addYAxis, scaleLinear, scaleBand , addChartTitleTip } from './UtilsD3'

import ObjectHelper from "./ObjectHelper"


export function BarChart({ chart_id, country_code, data, y_max, chartCols}) {


  data = ObjectHelper.GetObjByKey(country_code,data)

  const fillBarColor = "#69b3a2"

  useEffect(() => {

    //if no data return
    if(ObjectHelper.isEmpty(data)){
          return
      }

    let chartDims = defaultChartDims();

    let svg = startSVG(chart_id, chartDims)


    addChartTitleTip(svg, chart_id, chartDims)

    let xScale = scaleBand(data, chartCols['x'],[ 0, chartDims.width ],0.2)

    let chart_y_max = (y_max === 0) ? d3.max(data, d => d[chartCols['y']]) : y_max

    // Add Y axis
    const yScale = scaleLinear([ chartDims.height, 0],[0, chart_y_max])


    // Add the X Axis
    const xAxis = d3.axisBottom(xScale)

    addXAxis(svg,chartDims,xAxis)

    // Add the Count Axis
    addYAxis(svg,chartDims,yScale)


    // Bars
    svg.selectAll("." + chart_id + "mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", chart_id + "mybar-rect")
        .attr("x", function(d) { return xScale(d[chartCols['x']]); })
        .attr("width", xScale.bandwidth())
        .attr("fill", fillBarColor)
        // no bar at the beginning thus: animate later
        .attr("height", function(d) { return chartDims.height - yScale(0); }) // always equal to 0
        .attr("y", function(d) { return yScale(0); })

        .on("mouseover", mouseover) //Add listener for the mouseover event
       
        .on("mouseout", function(d) {      
          d3.selectAll("." + chart_id + "mybar-rect").attr("fill", fillBarColor) 
          d3.select("#" + chart_id + "chart-title").text('')
        }) //Add listener for the mouseoutr event

   

    // Animation
    d3.selectAll("." + chart_id + "mybar-rect")
      .transition()
      .duration(800)
      .attr("y", function(d) { return yScale(d[chartCols['y']]); })
      .attr("height", function(d) { return chartDims.height - yScale(d[chartCols['y']]); })


    function mouseover(d, i) {
     
      let df = i[chartCols['x']]
      let v = d3.format(",")(i[chartCols['y']])
      d3.select(this).attr("fill", "red")
      d3.select("#" + chart_id + "chart-title").text( df + ' : ' + v )
       
    }
    
    
  }, [data, y_max, chart_id, chartCols]);

  return (
    <div id={chart_id} />);
}



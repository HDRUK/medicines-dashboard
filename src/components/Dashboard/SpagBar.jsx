import React, { useEffect , useState} from 'react';

import * as d3 from 'd3';


import { defaultChartDims, startSVG,  addXAxis, addYAxis } from './UtilsD3'


import ObjectHelper from "./ObjectHelper"

import { GraphLegendsCheckbox } from './Legends'

export const SpagBar = ({data,  chartCols, countries, legends, legendsColors}) => {

  const [legendState, setLegendState] = useState(new Array(legends.length).fill(true));

  const handleLegendsChange = (cbxs) => {

    setLegendState(cbxs);
  }

  
    //Start the return, no data return null
    if(  ObjectHelper.isEmpty(data)){
      return null
    }


    return (
      <div>

         <div className="plots-row">

            {countries.map((c,i) => {

              return (
                <div className="plot-cell" key={`p-spag-${c.code}`}>
                  
                  <h4>{c.name}</h4>
                  <BarChart key={c.code} data={data} chart_id={`d3b-spag-${c.code}`}
                      country_code={c.code} chartCols={chartCols}  legendState={legendState} 
                      legendsColors={legendsColors} />
                                    
               </div>
              )
              
             })}

      </div>     

      <GraphLegendsCheckbox 

        legends={legends}
        legendState={legendState}
        legendsColors={legendsColors}
        handleLegendsChange={handleLegendsChange}

      />
      
     
    </div>
  );
}

const BarChart = ({ chart_id, data, chartCols, country_code, legendsColors, legendState}) => {

  //get data by country
  data = ObjectHelper.GetObjByKey(country_code,data)

  
  useEffect(() => {

      //if no data return
      if(ObjectHelper.isEmpty(data)){
          return
      }


      let chartDims = defaultChartDims();

      let svg = startSVG(chart_id, chartDims)

      // Set scales, the ranges and domains
      let xScale = d3.scaleTime().range([0, chartDims.width]);  
      let yScale = d3.scaleLinear().range([chartDims.height, 0]);

      xScale.domain(data['x_extent']).nice();
      yScale.domain([0, data['y_max']]).nice();

      // Define the line
      const chartLine = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return xScale(d[chartCols['x']]); })
        .y(function(d) { return yScale(d[chartCols['y']]); });

  
    // Loop through each symbol / key
    data['dataNested'].forEach(function(d,i) { 
        
        let opac = 1
        opac =  (legendState[i] === true ) ? 1 : 0.1
      
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
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b-%Y")).ticks(d3.timeMonth.every(3));
  addXAxis(svg,chartDims,xAxis)

  // Add the Count Axis
  addYAxis(svg,chartDims,yScale)
  
    
    
  }, [data, legendState, chart_id, chartCols, legendsColors]);

  return (
    <div>
 
    <div id={chart_id} />
    </div>);
}
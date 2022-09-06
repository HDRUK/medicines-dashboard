import React, { useEffect} from 'react';

import * as d3 from 'd3';

import { defaultChartDims, startSVG, addXAxis, addYAxis, scaleLinear, scaleBand, addChartTitleTip} from './UtilsD3'

import ObjectHelper from "./ObjectHelper"

function stackData(d,d_keys){

    const stackedData = d3.stack()
    .keys(d_keys)
    (d)

    return stackedData
}


const groupToStack = function(data, groupBy, colorBy, reducer = v => v.length) {


  const groupedMap = d3.group(data, d => d[groupBy], d => d[colorBy]);
  const keys = Array.from(new Set(data.map(d => d[colorBy])).values());


  return Array.from(groupedMap.entries()).map(g => {
    
    const obj = {};
    obj[groupBy] = g[0];
    
    for (let col of keys) {

      const vals = g[1].get(col);
      
      obj[col] = !vals ? 0 : reducer(Array.from(vals.values()));
    }    
    
    return obj;
  });
}



export function ChartStacked({ chart_id, data , chartCols, country_code, legendsColors, legends, legendFilter }) {

  // let y_max = 0

  let data_filtered = ObjectHelper.GetObjByKey(country_code,data)

  let showBars = true

  if(legendFilter.length){

    data_filtered = data_filtered.filter(function(e) {

            return legendFilter.includes(e.strat_key) 
          });
  }else{
    showBars = false
  }

  useEffect(() => {

    //if no data return
    if(ObjectHelper.isEmpty(data_filtered)){
          return
      }


    let chartDims = defaultChartDims();

    let svg = startSVG(chart_id, chartDims)

    addChartTitleTip(svg, chart_id, chartDims)


    const stackKeys = Array.from(new Set(data_filtered.map(d => d[chartCols['group_by']])).values())

    const  matrixData = groupToStack(data_filtered, chartCols['x'], chartCols['group_by'], v => d3.sum(v, d => d[chartCols['y']]))

    const  matrixDataObj = {}

    matrixData.forEach(f=>{
      f.total = 0;

      for (let k in stackKeys) {
         
        f.total += f[stackKeys[k]];

      }

      matrixDataObj[f[chartCols['x']]] = f
    })

    const summed = getSummed(matrixData,chartCols,stackKeys)
    const stackedData = stackData(matrixData,stackKeys)
   
    // Add X axis
    const xScale = scaleBand(data_filtered, chartCols['x'],[ 0, chartDims.width ],0)

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
    addXAxis(svg,chartDims,xAxis)
    
    let y_max = d3.max(summed, d => d['total'])
    
    // Add Y axis
    const yScale = scaleLinear([ chartDims.height, 0],[0, y_max])

    // Add the Count Axis
    addYAxis(svg,chartDims,yScale)


  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => 
        {
          
          return legendsColors[d.key]
    })
     
      .selectAll("rect")
      
      
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data( (d,i) => {
        
        return d}
        )
      .join("rect")
      .attr('class', (d,i) =>{
       
        return chart_id  + '-bars'
      })

      .attr('data-stack-idx', (d,i) =>{
       
        return i
      })

        .attr("x", d => {
          
          return xScale(d.data[chartCols['x']])
        }
          )
        .attr("height", function(d,i) { 
          
        return chartDims.height - yScale(0); }) // always equal to 0
    .attr("y", function(d) { return yScale(0); })

        .attr("width",xScale.bandwidth())
        .on("mouseover", onMouseOverBar) //Add listener for the mouseover event
        .on("mouseout", function(d,i){ 

          d3.select("#" + chart_id + "chart-title").text('')
          d3.selectAll( '.' + chart_id + '-bars').each(function(d,i){
          
          d3.select(this).attr('opacity', 1)
        })})
    
    function onMouseOverBar(d,i) {

        const onIdx = d3.select(this).attr('data-stack-idx')
       
        d3.selectAll( '.' + chart_id + '-bars').each(function(d,i){
         
          const opac = (onIdx === d3.select(this).attr('data-stack-idx')) ? 1 : 0.5
          d3.select(this).attr('opacity', opac)
        })

       
      let v = d3.format(",")(i['data']['total'])
      
      d3.select("#" + chart_id + "chart-title").text( i['data']['date'] + ' : ' + v )
         

    }//end onMouseOver

  svg.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .style('opacity', showBars ? 1 : 0)


    
  }, [data_filtered, chart_id, chartCols, legendsColors, showBars]);

  return (
    <div id={chart_id} />);
}


const getSummed = (matrixData,chartCols,stackKeys) => {

    return matrixData.map(item => {

      
      const container = {};

      container[chartCols['x']] = item[chartCols['x']];
     

      let total = 0;

      for (let k in stackKeys) {
          
        total += item[stackKeys[k]];

      }
      container.total = total

      return container;
    })


}





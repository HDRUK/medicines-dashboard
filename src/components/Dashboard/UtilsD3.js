import * as d3 from 'd3';
import ObjectHelper from "./ObjectHelper"

//parser for dates that have format month 3 letter code - year ie jan-2019 etc
const parseDateMonYear = d3.timeParse("%b-%Y");

//for dates that have format month 3 letter code - year ie jan-2019 etc
export const formatDate = d3.timeFormat("%b-%Y");

//common chart cols from data
export const  chartCols = {'y' : 'count', 'x': 'date', 'group_by' : 'strat_key'}

//parse date for charts, updates in place, ie passed by reference, nothing to return
export const parseData = (data) =>{

    //if spag data
    let d =  ObjectHelper.GetObjByKey('spag_data',data)

    if(! ObjectHelper.isEmpty(d)){

        parseDateMonYearCount(d,chartCols)
        data['spag_data'] = dataForLines(d, chartCols)

    }


    //chart data, lets clone it for the line chart, org is for stack chart
    let cd =  ObjectHelper.GetObjByKey('chart_data',data)

    let cloneData = {}

    if(! ObjectHelper.isEmpty(cd)){
        

        Object.keys(cd).forEach(function (item) {

            cloneData[item] = cd[item].map(a => Object.assign({}, a));
            
          })

        parseDateMonYearCount(cloneData,chartCols)

        data['chart_line_data'] = dataForLines(cloneData, chartCols)

    }

    // return out

}

//common chart dimensions
export const defaultChartDims = () => {

    let d = { top: 30, right: 10, bottom: 70, left: 60, width: 0, height: 0}
    d['width'] = 400 - d.left - d.right
    d['height'] = 300 - d.top - d.bottom;

    return d
}

//common svg for charts, remove everything and return new svg
export function startSVG(chart_id, chartDims){

    let svg = d3
          .select('#' + chart_id)
          .selectAll("*").remove()


    svg = d3.select('#' + chart_id)
      .append("svg")
        .attr("width", chartDims.width + chartDims.left + chartDims.right)
        .attr("height", chartDims.height + chartDims.top + chartDims.bottom)
        .append("g")
          .attr("transform",
                "translate(" + chartDims.left + "," + chartDims.top + ")")

    return svg

}

//common chart add x-axis, xAxis here is d3 Scale/domain object
export function addXAxis(svg, chartDims, xAxis){

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + chartDims.height + ")")
      .call(xAxis)
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)")
}

//common chart add y-axis
export function addYAxis(svg, chartDims, yScale){

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")));

      AddYLabel(svg,chartDims.left,chartDims.height)

}

//common chart add y-axis
export function addChartTitleTip(svg, chart_id, chartDims){

    svg.append("text")
      .attr('class','chart-title-tip')
      .attr("id", chart_id + "chart-title")
      .attr("x", chartDims.width/2)
      .attr("y", -1)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")

}


//expects object
export const parseDateMonYearCount = (data,cols) => {

    if( ObjectHelper.isEmpty(data) ){
        return
    }

    Object.keys(data).forEach(function (item) {

        if(Array.isArray(data[item]) ){

           data[item].forEach(function(d) {
              
              d[cols['x']] = parseDateMonYear(d[cols['x']]);
              d[cols['y']] = +d[cols['y']];
            });
       }
          })

}

export function getYMaxes(data,cols){

    let y_max = 0

    if(! ObjectHelper.isEmpty(data) ){
        
     let y_maxes = []

     Object.keys(data).forEach(function (item) {
      y_maxes.push(d3.max(data[item], d => d[cols['y']]))

    })
     y_max = Math.max(...y_maxes)

  }

  return y_max

}


export function getExtent(data,col){
    return d3.extent(data, function(d) { return d[col]; })

}

export function getMax(data,col){
    return d3.max(data, function(d) { return d[col]; })

}

export function dataNested(data,col){
    return Array.from(
          d3.group(data, d => d[col]), ([key, value]) => ({key, value})
        );
}

export function scaleTime(range, domain){
    return  d3.scaleTime().range(range).domain(domain).nice();
}

export function scaleLinear(range, domain){
    return  d3.scaleLinear().range(range).domain(domain).nice();
}

export function scaleBand(data,col,range,padding=0){
    return  d3.scaleBand()
                .range(range)
                .domain(data.map(function(d) { return d[col]; }))
                .padding(padding);
}


//convert data into nested for d3 linecharts
export const dataForLines = (data, cols) => {

  let chart_data = {}

  if(! ObjectHelper.isEmpty(data)){
   
    Object.keys(data).forEach(function (item) {

        chart_data[item] = {
                            'dataNested': [],
                            'y_max': 0,
                            'x_extent': []
                          }

        chart_data[item]['dataNested'] = Array.from(
            d3.group(data[item], d => d[cols['group_by']]), ([key, value]) => ({key, value})
        );

        chart_data[item]['y_max'] = getMax(data[item], cols['y'])
        chart_data[item]['x_extent'] = getExtent(data[item],cols['x'])

    })
    
  }

  return chart_data
  
}

export function AddYLabel(svg,y,x){

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 -  y)
      .attr("x",0 - (x / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number Dispensed");  

}

export const groupToStack = function(data, groupBy, colorBy, reducer = v => v.length) {


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

export function stackData(d,d_keys){

    const stackedData = d3.stack()
    .keys(d_keys)
    (d)

    return stackedData
}


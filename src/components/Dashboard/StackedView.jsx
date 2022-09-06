import React, { useState} from 'react';

import ObjectHelper from "./ObjectHelper"

import { GraphLegendsCheckbox } from './Legends'

import {ChartStacked} from './BarStack';
import { LineChartSimple } from './D3LineSimple'

const RadioButton = ({ label, value, checked, onChange }) => {
  return (
    <label>
      <input type="radio" value={value} checked={checked} onChange={onChange} />
      &nbsp;&nbsp;{label}
    </label>
  );
};

export const StackedView = ({data, chartCols, countries, legends, legendsColors}) => {

    const [graphView, setGraphView] = React.useState('stacked');

    const stackedData =  ObjectHelper.GetObjByKey('chart_data',data,{})
    const lineData = ObjectHelper.GetObjByKey('chart_line_data',data,{})


    const [legendState, setLegendState] = useState(new Array(legends.length).fill(true));

    const [legendFilter, setLegendFilter] = useState(legends.map(i=>i[0]));

    const handleLegendsChange = (cbxs) => {


        let cbx_on = []
        let cbx_all = []
        cbxs.forEach((item, index) =>{

            cbx_all.push(legends[index][1])

            if(item === true){ cbx_on.push(legends[index][1])}

        });

        setLegendFilter(cbx_on)
        setLegendState(cbxs);
    }

    const handleRadioChange = (e) => { setGraphView(e.target.value)};

    
    //start return, if nothing return null
    if(ObjectHelper.isEmpty(data)){
        return null;
    }
    
    return (
        <div>

          <div className="strat-view-options">
      <div> Graph Options</div>
     
   

                      <RadioButton
        label="Stacked"
        value="stacked"
        checked={graphView === 'stacked'}
        onChange={handleRadioChange}
      />

            <RadioButton
        label="Line"
        value="line"
        checked={graphView === 'line'}
        onChange={handleRadioChange}
      />
 </div>
            <div className="plots-row">

                {countries.map((c,i) => {
                    return (
                        <div className="plot-cell" key={`p-stacked-${c.code}`}>

                        <h4>{c.name}</h4>
                        {graphView === 'stacked' ?
                        <ChartStacked
                            chart_id={`d3bar-strat-${c.code}`}
                            data={stackedData}
                            chartCols={chartCols} 
                            country_code={c.code}
                            legendState={legendState}
                            legendsColors={legendsColors}
                            legends={legends}
                            legendFilter={legendFilter}
                           />
                        :

                        <LineChartSimple data={lineData} chart_id={`d3bar-strat-line-${c.code}`}
                        country_code={c.code}   
                         legendState={legendState} legendsColors={legendsColors} legendFilter={legendFilter} 
                        chartCols={chartCols}/>
                         }

                        </div>
                    )

                })}
                 </div>
                <div>

               <GraphLegendsCheckbox 

                legends={legends}
                legendState={legendState}
                legendsColors={legendsColors}
                handleLegendsChange={handleLegendsChange}

              />


               
</div>
            </div>


    )
}


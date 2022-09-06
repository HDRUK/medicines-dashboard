import React, { useState} from 'react';

import ObjectHelper from "./ObjectHelper"

import {getYMaxes } from './UtilsD3'

import { BarChart } from './BarChart';

export const TotalsBar = ({data,  chartCols, countries}) => {

  const [scaleChecked, setScaleChecked] = useState(false);

  const [yMax, setYMax] = useState(0);
 

  const y_max = getYMaxes(data, chartCols)
    

  function changeScale(c){
     
      setYMax( (c === true) ? y_max : 0)
      setScaleChecked(c)
  }

  //start return, if nothing return null
  if(ObjectHelper.isEmpty(data)){
        return null;
  }

  return (
    <div>
      <div className="strat-view-options">
      <div> Graph Options</div>
     
     <label key={'index'} className="checkbox-inline">
        <input
        type="checkbox"
        checked={scaleChecked}
        onChange={e => changeScale(e.target.checked)}
        />&nbsp;&nbsp;View all nations on the same scale
                
    </label>

    </div>
            

    <div className="plots-row">

        {countries.map((c,i) => {
                          return (
          <div className="plot-cell" key={`p-total-${c.code}`} >
            
            <h4>{c.name}</h4>

            <BarChart 
                chart_id={`d3bar-totals-${c.code}`}
                data={data}
                chartCols={chartCols}
                country_code={c.code} 
                y_max={yMax} 
            />
                              
          </div>
                )
              
          })}

      
    </div>            
      
      
          
          
    </div>
  );
}


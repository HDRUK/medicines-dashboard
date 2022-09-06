import React, { useState} from 'react';

import ObjectHelper from "./ObjectHelper"


const cbx_array_tf = (legends,val = true) => {
  return new Array(legends.length).fill(val)
}

export const GraphLegendsCheckbox = ({ legends, legendState, handleLegendsChange, legendsColors}) => {


  const [isCheckAll, setIsCheckAll] = useState(true);

 
 const handleLegendChange = (position) => {

    const updatedCheckedState = legendState.map((item, index) =>
      index === position ? !item : item
    );

    handleLegendsChange(updatedCheckedState);

  }

  
  const handleSelectAll = e => {

    let s = !isCheckAll
    setIsCheckAll(s);

    if (s) {
      handleLegendsChange(cbx_array_tf(legends,true));
    }else{
      handleLegendsChange(cbx_array_tf(legends,false));
    }
  };

    //Start the return, no data or not array eturn null
    if(  ObjectHelper.isEmpty(legends) || ! Array.isArray(legends) ){

      return null
    }

  return (
    <div>

          <div>

              <label key={'index-x'} className="checkbox-all" >
                    <input
                    
                      type="checkbox"
                      
                      name="selectAll"
                      id="selectAll"
                      onChange={handleSelectAll}
                      checked={isCheckAll}


                    />
                    <span className="xcheckbox-inline"  >Select / De-Select All</span>
                  
              </label>
          </div>

          {legends.map((item, index) => {
              return (
               <label key={index} className="checkbox-inline" >
                      <input
                      
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={item[1]}
                        value={item[0]}
                        checked={legendState[index]}
                        onChange={() => handleLegendChange(index)}
                      />
                      <span className="checkbox-inline-legend-color" style={{background: legendsColors[item[0]]}}>
                      <span className="checkbox-inline-legend-text"  >{item[1]} </span></span>
                    
                </label>
              );
            })}

          
     
    </div>
  );
}


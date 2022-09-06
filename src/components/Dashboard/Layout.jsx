import React  from 'react';

import ObjectHelper from "./ObjectHelper";
import loading_gif from '../assets/loading.gif'

import { chartCols } from './UtilsD3'
import { SpagBar } from './SpagBar';
import { TotalsBar } from './TotalsBar';
import { StackedView } from './StackedView'


export const LoadingGif = () => {

  return (<img src={loading_gif} alt="loading..." />)
    
}

export const LoaderFullPage = ({msg= "Loading...."}) => {
  return (
    <div className="loader-full">
      <div className="centered">
        <div>{msg}</div>
        <LoadingGif />
      </div>
    </div>
    )
}

export const D3Graphs =  ({data, stratView,filterStratKey,selected,searchValues,bnf_levels}) => {


  let v = null;

  const countries =  ObjectHelper.GetObjByKey('countries',data,[])

  //for all normal charts
  const legends =  ObjectHelper.GetObjByKey('chart_legends',data,[])
  const legendsColors =  ObjectHelper.GetObjByKey('chart_legends_colors',data,{})

  //for spag only
  const spag_legends =  ObjectHelper.GetObjByKey('spag_legends',data,[])
  const spag_legendsColors =  ObjectHelper.GetObjByKey('spag_legends_colors',data,{})

  let spagData =  ObjectHelper.GetObjByKey('spag_data',data)


  
  switch(stratView){

    case "Totals":

        let chartData = ObjectHelper.GetObjByKey('chart_data',data,{})
        v = <TotalsBar data={chartData} chartCols={chartCols} countries= {countries} legends={legends} legendsColors={legendsColors} />
    break;

    default: 
       
        v =  <StackedView data={data} chartCols={chartCols} countries= {countries} legends={legends} legendsColors={legendsColors} />
         
    break;

  }
  
  return (
    <div>
      <div className="plots-row-wrapper">
          <SearchCrumb searchValues={searchValues} bnf_levels={bnf_levels} minus_levels={0} />
          <StratChoiceButtons data={data} filterStratKey={filterStratKey} selected={stratView}/>
          {v}
    </div>
      <div className="plots-row-wrapper">
          <SearchCrumb searchValues={searchValues} bnf_levels={bnf_levels} minus_levels={-1} />
          <SpagBar data={spagData} chartCols={chartCols}  countries={countries}  legends={spag_legends} legendsColors={spag_legendsColors} />
      </div>
    </div>
    

  )

}

export function SearchCrumb({searchValues, bnf_levels, minus_levels}){

  if(ObjectHelper.isEmpty(searchValues)){
    return null;
  }

  let out = []

  let levels = (minus_levels !== 0 ) ? bnf_levels.slice(0,minus_levels) : bnf_levels

  levels.forEach(i =>{

    let v = searchValues[i]['value']

    if(v !== 'all'){

      out.push(searchValues[i]['text'])
    }
  })

  if(out.length === 0){
    out.push('All Chapters / Medicines')
  }

  return (

    <div><span className="crumb-span">Search Results for: </span>
    {out.map((item, i) => (
      <span key={i} className=
        {i === out.length - 1 ? 'crumb-span crumb-last' : 'crumb-span'}>{item} 
         {i === out.length - 1 ? '' : ' :'}
      </span>
    ))}
  </div>

    )

}



export const StratChoiceButtons = ({data,filterStratKey, selected,graph_options}) => {

  const opts =  ObjectHelper.GetObjByKey('strat_opts',data,[])
  // const [options, setOptions] = useState(opts)

  let btns = opts.map((k,i)=>{

      let c = (k === selected) ? 'fake-btn-on' : ''
 
      return (<button className={`fake-btn ${c}`} key= {i} onClick={e => handleOptionsChange(k)} >{k}</button>)
  })
  
  const handleOptionsChange = (e) => {
    // alert(e)
    filterStratKey(e)
  }

  return (

    <div className="strat-view-options">
      <div> View By</div>{btns}
     
    </div>
    )
}


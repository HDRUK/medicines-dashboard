import React , { useState , useEffect} from 'react';


import pageData from "../data/nested2.json";

import { SearchModal } from './search_modal'

import {  makeDataChapters, exBNF2 } from "./FakeData";

import { parseData } from './UtilsD3'

import { LoaderFullPage, D3Graphs } from "./Layout"


const bnf_levels = ['chapter','section','subpara','chemical']
const def_search = {chapter: {value: "all", text: "All"},chemical: {value: "all", text: "All"},section: {value: "all", text: "All"}, subpara: {value: "all", text: "All"}}

const Example = (props) => {


  let def_view = 'Totals'
  
  const [searchModal, setSearchModal] = useState(false);
  const [searchValues, setSearchValues] = useState(def_search);
  const [stratView, setStratView] = useState(def_view);

  const [apiState, setApiState] = useState({ data: [], search_list: [], loading: false , error : null});


  useEffect(() => {
  
    fakeSearch(searchValues,stratView)

  }, [searchValues,stratView]);

  const toggleModal = (e) => {
    setSearchModal(!searchModal);
  };

  const doneModal = (s) => {

    setSearchModal(!searchModal);
    setSearchValues(s)
    setStratView(def_view)

  };

  const cancelModal = (s) => {

    setSearchModal(!searchModal);

  };


  const fakeSearch = (s,sview) => { 

      s['strat_view'] = sview

      // set loading etc
      setApiState( ({ data: [], search_list: [], loading: true, error: null }));

      setTimeout(() => {

          //some fake data
          let data = makeDataChapters(pageData, s)

          let search_list = exBNF2(pageData)

          parseData(data)

          setApiState( { data: data , search_list: search_list, loading: false, error: null });
            
      }, 1000);

        

    }


  
  return (
      <div>
        
        <header>
              <h2>HDRUK Medicines Dashboard (DEMO ONLY, ALL DATA IS FAKE!)</h2>
        </header>
       
       
        {apiState.loading ?  <LoaderFullPage /> : null }

        <div className="search-header-container">
          <div className="search-header">
             <div className="search-header-flex-left"></div>
             {  searchModal ?  null : 
               <div className="search-header-flex-right">
                <button className="fake-btn search-header-btn" onClick={toggleModal}>New Search</button>
              </div>
              }
             </div>
          </div>


             <main>
              <article>
                <section>
          
                    <div className="plots-container">     

                       {  searchModal ?  <SearchModal
                                            data={pageData} 
                                           
                                            toggleModal={toggleModal}
                                      doneModal={doneModal}
                                      cancelModal={cancelModal}
                                      searchValues={searchValues}

                                      searchList = {apiState.search_list} /> : null
                      }
              

                      {apiState.loading ||  searchModal ? null:
                          <div>
                                <D3Graphs data={apiState.data} stratView={stratView} 
                                       filterStratKey={setStratView} 
                                       selected={stratView} 
                                       searchValues={searchValues} bnf_levels={bnf_levels}
                                       />
                          </div>
                      }

                    </div>

                </section>
              </article>
            </main>

     
      </div>
  );
  
};

export default Example




import React from 'react';
import {Link} from "react-router-dom"

import './App.css'

const Example = (props) => {
  
  return (
      <div>
       
        <header>
              <h2>HDRUK Medicines Dashboard (DEMO DATA ONLY).</h2>
        </header>
       
             <main>
              <article>
                <section>
                    <div className="landing-page">
                    <p>
                      This site allows you to explore dispensing data of medicines across the NHS in England, Wales and Scotland. 
                      You can explore trends in the data as well as stratify the dispensing 
                      data by gender, pre-specified age band and in time region (and other strata). You can compare dispensing on the same scale 
                      across all GB nations.</p>

                  <p>To create a new search, click on the New Search Button, and use the search function to either search 
                    for a drug by chemical substance (e.g. metformin or atorvastatin). You can enter the name in the space provided, 
                      or you can use the BNF hierarchy to search for a class of drugs or a single substance of choice. 
                    Once selected, press search and this will produce your plots which you can then stratify by the provided fields using the buttons. 
                  
                    </p>

                    <p>

                      We are looking for feedback on functionality, usability, the look and feel of this site. We have not provided 
                      exhaustive guidance on all the functions to understand if this is intuitive and would welcome your 
                      feedback on this. 
                    </p>

                    <p>
                     <Link to="/dashboard" className="nav-link">
        <button className="fake-btn" > 
            
                Proceed to Dashboard
            
        </button>
    </Link>
                     </p>
                    </div>
                   
                </section>
              </article>
            </main>

     </div>
  
  );
  
};

export default Example




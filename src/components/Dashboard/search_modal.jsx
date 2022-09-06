import React ,{ useState }from 'react';


const default_select = {'value': 'all', 'text':'All' }



export const SearchModal = (props) => {

  
  const [chapter, setChapter] = React.useState(props.searchValues.chapter);
  const [section, setSection] = React.useState(props.searchValues.section);
  const [subpara, setSubpara] = React.useState(props.searchValues.subpara);
  const [chemical, setChemical] = React.useState(props.searchValues.chemical);

  const [filtered, setFiltered] = React.useState([]);

  const [search, setNewSearch] = useState("");

  const handleSearchChange = (e) => {
    let search = e.target.value
    setNewSearch(search);


    let filtered = !search
      ? []
      : props.searchList.filter((i) =>
          i.name.toLowerCase().includes(search.toLowerCase())
        );

      setFiltered(filtered)

  };

  const getTextValue = (event) => {
      const ele = event.target;
      return {'value': ele.value, 'text':ele.options[ele.selectedIndex].text }
  };


  const handleChapterChange = (event) => {
    
    let tv = getTextValue(event)

    setChapter(tv);
    setSection(default_select)
    setSubpara(default_select);
    setChemical(default_select);
    
  };

  const handleSectionChange = (event) => {

    let tv = getTextValue(event)
    let sp = props.data.subpara[tv.value]
    let cs = []
    
    setSection(tv);
    setSubpara(default_select);

    if(sp && sp.length === 1){
      cs =  props.data.cs[sp[0][0]]
      setSubpara({value: sp[0][0], text: sp[0][1]})
    }
    
    setChemical(default_select);
    if(cs && cs.length === 1){
      setChemical({value: cs[0][0], text: cs[0][1]})
    }
  };

  const handleSubparaChange = (event) => {

    let tv = getTextValue(event)

    let cs = props.data.cs[tv.value]

    setSubpara(tv);

    setChemical(default_select);
    
    
      if(cs && cs.length === 1){
        setChemical({value: cs[0][0], text: cs[0][1]})
      }
      
  

  };

  const handleChemicalChange = (event) => {

    let tv = getTextValue(event)
    setChemical(tv);
  };


  const doneSelection = () => {

     // send list back to parent
    
     let s = { 'chapter' : chapter,
                'section' :section,
                'subpara': subpara,
                'chemical': chemical
     }

     if(props.doneModal){
        props.doneModal(s)
     }

  }

  const onClickS = (v) =>  {
    
    setNewSearch(v.name);

    setChapter(v.link[0]);
    setSection(v.link[1])
    setSubpara(v.link[2]);
    setChemical(v.link[3]);
  }

  const resetSearch = (v) =>  {

    setNewSearch('');
    setChapter(default_select);
    setSection(default_select)
    setSubpara(default_select);
    setChemical(default_select)
    setFiltered([])
  }

  const cancelSearch = (v) =>  {
    if(props.cancelModal){
        props.cancelModal()
     }
  }

  const listChemicals = (v) =>  {

    let filtered = props.searchList.sort(function(a, b) {

        return a.name.localeCompare(b.name);
 
      }).filter(i=> {return i.type === 'chemical'});

    setFiltered(filtered)
    
  }

  
  
  return (

      <div>

          <div className="flex-search-bar">
             
              <button className="fake-btn" onClick={e => cancelSearch()} >Back</button> 
              <button className="fake-btn" onClick={e => doneSelection()} >Search</button> 
             
          </div>

          <div className="search-options">
            <div className="search-option-text">Type to search <span className="search-options-or">OR</span> click here to 
                  <span className="fake-span-href"  onClick={ () => listChemicals()} >Find a drug by chemical substance</span>
                  </div>
                <input className="search-box" type="text" value={search} placeholder="Search..." onChange={handleSearchChange} />
                <button className="search-clear-input" type="reset" onClick={ () => resetSearch()} >X</button>

                <div className="search-results">
                <ul>
                {filtered.map((i,idx) => {
                  return (
                    <li key={idx} onClick={ () => onClickS(i)}>
                      {i.name}
                    </li>
                  );
                })}
                </ul>
                </div>
        </div>

        <div className="search-options">
        <div className="search-options-or"> OR </div>
    
    <h4 className="search-options-h4">Search a drug by BNF category or search a class of drugs</h4>
     <div className="search-options-dropdowns" >
          <Dropdown
            label="Chapter"
            options={props.data.chapters}
            value={chapter}
            onChange={handleChapterChange}
          />
              
          <Dropdown
            label="Section"
            options={props.data.sections[chapter.value] || []}
            value={section}
            onChange={handleSectionChange}
            />
          
          <Dropdown
            label="Sub Paragraph"
            options={props.data.subpara[section.value] || []}
            value={subpara}
            onChange={handleSubparaChange}
            />
          
          <Dropdown
            label="Chemical Substance"
            options={props.data.cs[subpara.value] || []}
            value={chemical}
            onChange={handleChemicalChange}
          />

      </div>
 
      </div>

   
    {/* end */}
    </div>
    
  );
  
};


const Dropdown = ({ label, value, options, onChange }) => {

  return (
    <div>
      <div className="select_title">{label}</div>
      <select value={value.value} onChange={onChange}>
        <option key ='all' value='all'>All</option>
        {options.map((option,i) => (
          <option key ={i} value={option[0]}>{option[1]}</option>
        ))}
      </select>
    </div>
    
  );
};
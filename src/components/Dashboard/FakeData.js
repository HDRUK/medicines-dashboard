

export const countries = [
  {
    name: "England",
    code: 'GB-ENG',
    limit: 5000000
  },
  {
    name: "Wales",
    code: 'GB-WLS',
    limit: 300000
  },
  {
    name: "Scotland",
    code: 'GB-SCO',
    limit: 400000
  }

]


const mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const gender = ['Male','Female','Unknown']
const age_band = ['0','1-4','5-9','10-19','20-29','30-39','40-49','50-59','60-59','70-79','80-89','90+']
const strat_opts = ["Totals", "Gender", "Age"]



//create random data
function getRandom(rr,split_into){
  const n = Math.floor(Math.random() * rr)
  const mf = distributeRandomly(n, gender.length)
  
  const age = distributeRandomly(n, age_band.length)
  
  let x = distributeRandomly(n, split_into)

  return [n,mf,x,age]

}

export function getSearchByValue(bnf,s){

  let out = bnf['chapters']
  let bnf_level = 'chapter'

  if(s.chapter.value !== 'all'){
    
    out = bnf.sections[s.chapter.value]
  
  }

  if(s.section.value !== 'all'){
    bnf_level = 'section'
    out = bnf.subpara[s.section.value]
 
  }

  if(s.subpara.value !== 'all'){
    bnf_level = 'subpara'
    out = bnf.cs[s.subpara.value]
 
  }

  if(s.chemical.value !== 'all'){
    bnf_level = 'chemical'
    out = bnf.cs[s.subpara.value]
   
  }


  return [bnf_level,out]

}

//main fake data for testing
export function makeDataChapters(bnf,s){
  
  let out = []
  let out_gender = []
  let out_age = []
  let out_spag = []
  let spag_legends = []
  
  let bnf_state = getSearchByValue(bnf,s)
  
  let chaps = bnf_state[1]

  for(let z in chaps){
    spag_legends.push(chaps[z])
  }

  // dummy data, start with each country
  for (var c in countries){
    
          for (var i = 1; i < 3; i++) {

              for(let m in mons){
                let y = 2018 + i
                
                const rn = getRandom(countries[c]['limit'],chaps.length)
                
                out.push({ 
                  'strat_key': '', 
                  'date' : mons[m] +'-'+ y, 
                  'count' : rn[0],
                  'country': countries[c]['code']
                })

                //for gender
                for(let st in gender){

                    out_gender.push({ 
                    'strat_key': gender[st], 
                    'date' : mons[m] +'-'+ y, 
                    'count' : rn[1][st],
                    'country': countries[c]['code']
                  })

                }

              //for age_bands
               for(let st in age_band){
              
                    out_age.push({ 
                    'strat_key': age_band[st], 
                    'date' : mons[m] +'-'+ y, 
                    'count' : rn[3][st],
                    'country': countries[c]['code']
                  })

                }

                //spag data
                if(chaps.length ){
                  for(let z in chaps){
                    out_spag.push({ 
                      'strat_key': chaps[z][0],
                      'strat_text' : chaps[z][1],
                      'date' : mons[m] +'-'+ y, 
                      'count' : rn[2][z],
                      'country': countries[c]['code']
                    })

                  }
                }

              }
          }
     
  }

  //start output objects
  let r = {}

  r['countries'] = countries
  r['strat_opts'] = strat_opts

  r['chart_data'] ={}
  r['spag_data'] = groupByCountry(out_spag)
  r['spag_legends'] = spag_legends
  r['spag_legends_colors'] = legendColors(r['spag_legends'])

   switch(s.strat_view){

    case "Totals":
         r['chart_data'] = groupByCountry(out)
         r['chart_legends'] = []
    break;
    case "Gender":
         r['chart_data'] = groupByCountry(out_gender)
         r['chart_legends'] = gender.map(i=>[i,i])
         r['chart_legends_colors'] = legendColors(r['chart_legends'])

    break;
    case "Age":
         r['chart_data'] = groupByCountry(out_age)
         r['chart_legends'] = age_band.map(i=>[i,i])
         r['chart_legends_colors'] = legendColors(r['chart_legends'])
    break;

  }

    return r
}


//for search from bnf setup
export function exBNF2(bnf){
    // console.log('BNF EX', bnf)

    let all = []

    for(let c in bnf.chapters){

        let a = { value: bnf.chapters[c][0], text: bnf.chapters[c][1]}
        let def_all = {value: "all", text: "All"}
        
        all.push({'name': bnf.chapters[c][1], type : 'chapter', 'link' : [a,def_all,def_all,def_all] })

        let sec = bnf.sections[bnf.chapters[c][0]]
        if(sec && sec.length === 1){
            console.log('sec 1 ', sec, sec.length)
          }

        for(let s in sec){

          let b =  {value:  sec[s][0], text: sec[s][1]}
          all.push({'name': sec[s][1] , type : 'section', 'link' : [a,b,def_all,def_all]})

          let subpara = bnf.subpara[sec[s][0]]

          for(let sp in subpara){

            let c =  {value:  subpara[sp][0], text: subpara[sp][1]}
            all.push({'name': subpara[sp][1], type : 'subpara', 'link' : [a,b,c,def_all] })
            
            let csp = bnf.cs[subpara[sp][0]]

            for(let cs in csp){

              let d =  {value:  csp[cs][0], text: csp[cs][1]}
              all.push({'name': csp[cs][1] , type : 'chemical', 'link' : [a,b,c,d]})

            }
          }
        }
    }

    return all

}


function groupByCountry(d){

  let group = d.reduce((r, a) => {
  // console.log("a", a);
  // console.log('r', r);
      r[a['country']] = [...r[a['country']] || [], a];
      return r;
  }, {});
  // console.log("group country", group);
  return group

}

//split a total number into random x parts that add up to the sum, 
function distributeRandomly(value, countPeople, roundTo) {
    var weights = [];
    var total = 0
    var i;

    // To avoid floating point error, use integer operations.
    if (roundTo) {
        value = Math.round(value / roundTo);
    }
    
    for (i=0; i < countPeople; i++) {
        weights[i] = Math.random();
        total += weights[i];
    }

    for (i=0; i < countPeople; i++) {
        weights[i] *= value / total;
    }
    
    if (roundTo) {
        // Round off
        total = 0;
        for (i = 0; i < countPeople; i++) {
            var rounded = Math.floor(weights[i]);
            total += weights[i] - rounded;
            weights[i] = rounded;
        }

        total = Math.round(total);

        // Distribute the rounding randomly
        while (0 < total) {
            weights[Math.floor(Math.random(countPeople))] += 1;
            total -= 1;
        }

        // And now normalize
        for (i = 0; i < countPeople; i++) {
            weights[i] *= roundTo;
        }
    }

    return weights;
}

export const ColorScheme = () =>{

  return ['#E6194B', '#3cb44b',  '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080','#000000','#545C46',
  "#FF4A46","#008941","#1CE6FF","#FF34FF","#006FA6","#A30059","#000000","#FFDBE5","#7A4900","#0000A6","#63FFAC",
  "#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A",
  "#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300018","#0AA6D8",
  "#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66",
  "#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C",
  "#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700",
  "#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F",
  "#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72",
  "#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C",
  "#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF",
  "#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F",
  "#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE",
  "#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01",
  "#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749",
  "#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64",
  "#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C",
  "#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03",
  "#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A",
  "#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23",
  "#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88",
  "#5B656C","#00B57F","#ffe119","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B","#FFFF00"]

}

// add colors to legends
const legendColors = (l) =>{

  const colors = ColorScheme()
  let out = {}

  l.forEach(function (item,i) { out[item[0]] = colors[i]})
  return out
}




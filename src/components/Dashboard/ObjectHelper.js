
export default class ObjectHelper {

	/* test if object and is empty, return true if empty, null, or not an object */
	static isEmpty(data) {

    if (typeof(data) !== 'object' || !data ) { 
      
      return true
    }

    if (Array.isArray(data)) {
     
      return data.length === 0;
    }

    return !data || Object.keys(data).length === 0;
  }


  /* get data from object by key */
  static GetObjByKey(key,data,rtn=null){
       
        if (typeof(data) !== 'object' || data === null ) { return rtn}
       
        return (data.hasOwnProperty(key) ) ? data[key] : rtn;
    }
  
}




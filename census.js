console.log('census.js loaded')

census={}

census.get=async(q='/data/',apiURL='https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/episphere_census')=>{ // default returns catalog, could also be, for example census.get('/data/2018/acs/acs1/subject?get=NAME,group(S0101)&for=us:1')
    let url=''
    if(census.key){
        url=`https://api.census.gov${q}?key=${census.key}`
        if(!q.match(/\?/g)){
            url=`https://api.census.gov${q}&key=${census.key}`
        }
    }else{
        url=`${apiURL}?${encodeURIComponent(q)}`
        if(!q.match(/\?/g)){
            url=`${apiURL}?${encodeURIComponent(q)}?date=${Date()}`
        }
    }
    //console.log(`calling ${url}`)
    let res = await (await fetch(url)).text()
    //debugger
    try {
        res=JSON.parse(res)
    }
    catch(err) {
        console.log(err,res)
        }
    return res
}

census.ACS5vars=async(yr=2019,q)=>{ // ACS5 variables
    let vv
    if(typeof(yr)=='object'){ // first input can be year or variable object
        vv=Object.assign({},yr) // to cut connection to vv returned
    }else{
        vv = await (await fetch(`https://api.census.gov/data/${yr}/acs/acs5/variables.json`)).json()
    }
    //let vv = await (await fetch(`https://api.census.gov/data/${yr}/acs/acs5/variables.json`)).json()
    //let vv = await census.getJSON(`https://api.census.gov/data/${yr}/acs/acs5/variables.json`)
    if(q){
        let v0 = {}
        Object.keys(vv.variables).forEach(v=>{
            let vi = vv.variables[v]
            if(`${vi.label} ${vi.concept}`.match(q)){
                //Object.assign(v0,vv.variables[v])
                v0[v]=vi
            }
        })
        vv.variables=v0
    }
    return vv
}

census.ACS5geo=async(yr=2019)=>{ // ACS5 geography
    return (await fetch(`https://api.census.gov/data/${yr}/acs/acs5/geography.json`)).json()
}

census.ACS5groups=async(yr=2019)=>{ // ACS5 groups
    return (await fetch(`https://api.census.gov/data/${yr}/acs/acs5/groups.json`)).json()
}

census.help=function(){ // observable notebook
    window.open('https://observablehq.com/@episphere/census')
}


// example
// census.get('/data/2018/acs/acs1/subject?get=NAME,group(S0101)&for=us:1')
// for debugging with local server: census.get=async(q='/data/',apiURL='http://localhost:3000')

if(typeof(define)!='undefined'){
    define(census)
}

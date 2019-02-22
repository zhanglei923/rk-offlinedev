if(alias==='en'){
    for(let key in json){
        if(/^BI/.test(key)) {
            console.log(key)
            json[key]=json[key].replace(/\bview\b/, 'report')
            json[key]=json[key].replace(/\bView\b/, 'Report')
            json[key]=json[key].replace(/\bviews\b/, 'reports')
            json[key]=json[key].replace(/\bViews\b/, 'Reports')
        }
    }
}
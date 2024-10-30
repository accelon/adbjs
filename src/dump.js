const breakxml=(s,dbname)=>{
    let prev=0, at=s.indexOf('<檔'), prevname=dbname+'.xml';
    const encoder=new TextEncoder();
    const out=[];
    let count=0;
    while (at>=0) {
        let tagline=s.slice(at,at+200);
        const at2=tagline.indexOf('">');
        if (~at2) tagline=tagline.slice(0,at2+2);
        let name=tagline.match(/n="(.+?)"/);
        if (!name) {
            name=dbname+'.'+count+'.xml';
        } else {
            name=name[1];
        }
        if (at>prev) {
            const content=encoder.encode(s.slice(prev,at));
            out.push({name:prevname, content});
        }
        count++;
        prev=at;
        prevname=name;
        at=s.indexOf('<檔',prev+3);
    }
    const content=encoder.encode(s.slice(prev));
    out.push({name:prevname,content});
    return out;
}

export const dumpXML=adb=>{
    const files=breakxml(adb.getXML(),adb.header.dbname);
    if (files.length>1) {
        const content=new TextEncoder().encode(files.map(it=>it.name).join('\n'));
        files.push({ name: adb.header.dbname+'.lst', content});
    }
    return files;
}
export const dumpAll=adb=>{
    const files=dumpXML(adb);
    if (adb.resources) {
	    for (let i=0;i<adb.resources.count;i++) { 
	        const name=adb.resources.names[i];
	        const content=new Int8Array(adb.resources.getRawData(i));
	        files.push({name,content});
	    }
    }
    return files;
}
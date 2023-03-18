// see accelon3\basetype.pas
const DBTYPE_DICTIONARY=2;
export const readHeader=buf=>{
    const dataview = new DataView(buf);
    let offset=0;
    const dbname = (new TextDecoder().decode(buf.slice(offset,32))).replace(/\0.*$/g,'');
    offset+=32;
    const signature = new TextDecoder().decode(buf.slice(offset,offset+48)).replace(/\0.*$/g,'');
    if (signature!=='\r\nAccelon Search Engine\r\ndesigned by C.S.Yap') {
        return null;
    }
    offset+=48;
    const textterminator=dataview.getInt32(offset,true);  offset+=4; // 0x1a1a1a1a
    const version=dataview.getInt32(offset,true) ;        offset+=4;
    const compression=dataview.getInt32(offset,true) ;    offset+=4;
    const srcblocksize=dataview.getInt32(offset,true) ;   offset+=4;
    const maxblockoffset=dataview.getInt32(offset,true);  offset+=4;
    const andtagid=dataview.getInt32(offset,true);        offset+=4;
    const linecount=dataview.getInt32(offset,true);       offset+=4;
    const dbtype=dataview.getInt32(offset,true);          offset+=4;
    const protection=dataview.getInt32(offset,true);      offset+=4;
    const tagcount=dataview.getInt32(offset,true);        offset+=4;
    
    //auto simplified if features==1
    const features=dataview.getInt32(offset,true);        offset+=4;
    const reserved2=dataview.getInt32(offset,true);       offset+=4;
     
    const dbcname = new TextDecoder('utf-16le').decode(buf.slice(offset,offset+64)).replace(/\0.*$/g,'');
    offset+=64;

    //not used
    const serial = new TextDecoder().decode(buf.slice(offset,offset+16)).replace(/\0.*$/g,'');
    offset+=16;
    const pw = new TextDecoder().decode(buf.slice(offset,offset+20)).replace(/\0.*$/g,'');
    offset+=20;
    offset+=23;
    const isDict = dbtype | DBTYPE_DICTIONARY;
    const crc32=dataview.getUint32(offset,true);
    const tokencount= maxblockoffset-tagcount;
    return {dbname,dbcname,version,isDict, compression,srcblocksize,maxblockoffset
        ,andtagid,linecount,tagcount,tokencount
        ,signature,dbtype,features,crc32,serial,pw,protection}
}
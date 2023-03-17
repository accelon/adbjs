const   MileDistance = 512;

export const loadPackedList=(buf,offset)=>{
    const dataview = new DataView(buf);
    const added=dataview.getUint32(offset,true);        offset+=4;
    
    const nMileStone = Math.floor(added / MileDistance);
    offset += nMileStone*8; //each milstone has 2 int32

    const out=[];
    let remain=added;

    const next=v=>{ 
        let delta=0,shift=0;
        let c=dataview.getUint8(offset);
        do {
            delta += (c & 0x7f) << shift ;
            shift+=7;
            offset++;  
            remain--;
            if (remain>0) c=dataview.getUint8(offset);
        } while (c >= 0x80 && remain>0);
        return v+delta;
    }
    let v=0;
    while ( remain>0) {
        v=next(v);
        out.push(v);
    }
    
    return out;
}
/*
TROMBlocksHeader  32 bytes
feature, signature, totalblocksize, blocksize 
*/
import {loadPackedList} from './list.js';
const boWithPointer = 0x40000000;
const boSorted      = 0x20000000;
const boNamed       = 0x10000000; //last block is names
const FORMAT_MASK   = 0x00000007;
const boUndefined   = 0x00000000;
const boHits        = 0x00000001;
const boAscii       = 0x00000002;
const boUnicode     = 0x00000003;
const boBlocks      = 0x00000004;
const header_size   = 0x10;

export const loadROMBlock=(buf,offset=0)=>{
    const dataview = new DataView(buf);
    const feature=dataview.getUint32(0,true);        
    const signature=dataview.getInt32(4,true);        
    const totalblocksize=dataview.getUint32(8,true);  
    const blocksize=dataview.getInt32(12,true);        
    let count = blocksize?totalblocksize/blocksize:0;
    let lengths=null; //null if fixed length    
    let adv=0;
    if (blocksize==0) { //'variable length block'
        adv=dataview.getUint32(header_size+totalblocksize,true); 
        lengths=loadPackedList(buf.slice(header_size+totalblocksize));
        count=lengths.length;
    }
    let pointers=0;
    if (feature&boWithPointer) {
        pointers=offset+totalblocksize+adv;
        console.log('with pointers')   
    }
    offset+=header_size;
    let names=[];
    if (feature&boNamed && lengths) {
        
        const nameblockoffset=lengths[lengths.length-2];
        const namebuf=buf.slice(header_size+nameblockoffset);
        const namesblock=loadROMBlock(namebuf, offset+nameblockoffset);
        let off=0;
        for (let i=0;i<namesblock.count;i++) {
            const decoder= new TextDecoder('utf-16le');
            const len=i>0?namesblock.lengths[i]-namesblock.lengths[i-1]:namesblock.lengths[i];
            const s=decoder.decode( namebuf.slice(off+header_size, off+header_size+len-2));
            off=namesblock.lengths[i];
            names.push(s)
        }
    }
    return {feature,signature,totalblocksize,count,blocksize,pointers,lengths,names,offset}
}
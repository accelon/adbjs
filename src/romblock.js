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
const header_size   = 0x100;

export const loadROMBlock=(buf,offset)=>{
    const dataview = new DataView(buf);

    const feature=dataview.getUint32(offset,true);        offset+=4;
    const signature=dataview.getInt32(offset,true);        offset+=4;
    const totalblocksize=dataview.getUint32(offset,true);  offset+=4;
    const blocksize=dataview.getInt32(offset,true);        offset+=4;

    let fcount = blocksize?totalblocksize/blocksize:0;
    let lengths=null; //null if fixed length
    const blockstart=offset;
    console.log('blockstart',offset)
    let adv=0;
    if (blocksize==0) { //'variable length block'
        adv=dataview.getUint32(offset+totalblocksize,true); 
        lengths=loadPackedList(buf,offset+totalblocksize);
        fcount=lengths.length;
    }
    let pointers=0;
    if (feature&boWithPointer) {
        pointers=offset+totalblocksize+adv;
        console.log('with pointers')   
    }

    let names;
    if (feature&boNamed && lengths) {
        offset+=totalblocksize+adv; //now point to actual blocks
        
        names=loadROMBlock(buf, 100+lengths[lengths.length-1] );
        
        console.log('names',names)   
    }
    return {feature,signature,totalblocksize,fcount,blocksize,pointers,lengths,names}
}
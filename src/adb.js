// assuming adb in an arraybuffer

import {readHeader} from './header.js';
import {loadROMBlock} from './romblock.js';

export const openADB= buf=>{
    const header=readHeader(buf);
    //read sources
    const blocks=loadROMBlock(buf.slice(256),256); //header size

    // console.log(header)
    return {header,blocks};
}
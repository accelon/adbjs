// assuming adb in an arraybuffer

import {readHeader} from './header.js';
import {loadROMBlock} from './romblock.js';

export const openADB= buf=>{
    const header=readHeader(buf);
    let offset=256;
    //read sources
    const blocks=loadROMBlock(buf, offset);

    // console.log(header)
    return {header,blocks};
}
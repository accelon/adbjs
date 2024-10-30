// assuming adb in an arraybuffer

import {readHeader} from './header.js';
import {ROMBlocks} from './romblock.js';
import {bzip2} from './bzip2.js';
import { loadPackedList } from './list.js';
export class openADB {
    constructor (buf){
        this.header=readHeader(buf);
        if (!this.header) {
            this.error='invalid adb'
            return;
        }

        this.blocks=new ROMBlocks(buf.slice(256),256); //header size
        const sourceoff=this.blocks.getBlockOffset('source');
        this.sources=new ROMBlocks(buf.slice(sourceoff),sourceoff); 
        const resourcesoff=this.blocks.getBlockOffset('resources');
        if (resourcesoff) this.resources=new ROMBlocks(buf.slice(resourcesoff),resourcesoff); 
        const tablesoff=this.blocks.getBlockOffset('tables');
        this.tables=new ROMBlocks(buf.slice(tablesoff),tablesoff); 
        const PALinesoff=this.tables.getBlockOffset('lines.physical');
        this.PALines=loadPackedList(buf.slice(PALinesoff));
        this.buf=buf;
    }
    getTextBlock(i){
        const buffer=this.sources.getRawData(i);
        const out=[];
        bzip2.simple(buffer,function(s){out.push(s)});
        const decoder= new TextDecoder('utf-16le');
        const s=decoder.decode(new Int8Array(out).buffer);
        return s;
    }
    getXML() {
        const raw=[];
        const till=this.sources.lengths.length;
        for (let i=0;i<till;i++) {
            raw.push(this.getTextBlock(i));
        }
        const alltext=raw.join('');        
        const out=[];
        for (let i=0;i<this.PALines.length;i++) {
            const start=(i==0?0:this.PALines[i-1]) >> 1;
            const end=this.PALines[i] >> 1;
            out.push(alltext.slice(start,end));
        }
        return out.join('\n');
    }
}
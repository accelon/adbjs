import {readFileSync,existsSync} from 'fs';
import {openADB} from './src/adb.js';
const adbname='yinshun.adb';
let pass=0, test=0;

if (!existsSync(adbname)) {
    throw "missing "+adbname;
}

const buf=readFileSync('yinshun.adb',null).buffer;

test++;

// copy yinshun.adb from accelon3

const handle=openADB(buf);
pass+= !handle?1:0;
console.log(handle.blocks)

console.log('test',test,'pass',pass);


import {openADB, dumpAll} from 'adbjs';
import { storeZip } from 'ptk/zip';
import {createBrowserDownload} from 'ptk/platform/chromefs.ts'

let adbbuffer=null;
const saveOption={types:[{
        description: 'zip File',
        accept: {'application/zip': ['.zip']}
    }
]
}

const lblmessage=document.querySelector('#message');
const btndownload=document.querySelector('#btndownload');

window.doconvert=async function(){
    const adb=new openADB(adbbuffer);
    if (!adb || adb.error) {
        console.error(adb.error||'wrong adb');
        return;
    }
    lblmessage.innerHTML='轉換中...'
    setTimeout(function(){
        const files=dumpAll(adb);
        const zipbuf = storeZip(files);
        const outfn=adb.header.dbname+'.zip';
        createBrowserDownload(outfn,zipbuf);
        lblmessage.innerHTML=''
    },0);
}

document.querySelector('input').addEventListener('change', function() {
    var reader = new FileReader();
    reader.onload = function() {
        adbbuffer = this.result;
        lblmessage.innerHTML = 'size: ' +adbbuffer.byteLength;
        btndownload.style=''; 
    }
    reader.readAsArrayBuffer(this.files[0]);
}, false);
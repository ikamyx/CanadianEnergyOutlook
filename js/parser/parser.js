"use strict";

function parser(raw, connection, dataSource) {
    let value;
    let lineBreaks = (raw.match(/\n/g)||[]).length;
    let lines = [];
    for(let i=0; i<=lineBreaks; i++){
        lines[i] = raw.split("\n")[i];
    }
    let data = lines.filter(d => !d.includes("metadata"));
    let metadata = lines.filter(d => d.includes("metadata"));

    let metaObj = {};
    metadata.forEach(d => {
        let split1, split2, split3;
        split1 = getPosition(d, ";", 1);
        split2 = getPosition(d, ";", 2);
        split3 = getPosition(d, ";", 3);
        let attribute = d.substring(split1, split2).substr(1);
        if(connection == 'local' || ((connection == 'online') && (dataSource == 'file'))) {
            value = d.substring(split2, split3).substr(1).slice(0, -1);
        }
        else if((connection == 'online') && (dataSource == 'list')) {
            value = d.substring(split2, split3).substr(1);
        }
        let pointer = attribute.indexOf(".");
        let subCat = attribute.substring(0, pointer);
        attribute = attribute.substring(pointer + 1);
        if(connection == 'local' || ((connection == 'online') && (dataSource == 'file'))) {
            if(split2 == split3) {
                attribute = attribute.slice(0, -1);
            }
        }
        if(!metaObj[subCat]) {
            metaObj[subCat] = {}
        }
        metaObj[subCat][attribute] = value;
    });
    /************************************************************************/
    let num = 1; // change from 1 to zero
    for(let i=0;i<=data[0].length - 1;i++) {
        if(data[0][i] == ";") num++;
    }
    let atrPos = [];
    for(let i=1;i<=num - 1;i++) {
        atrPos[i] = getPosition(data[0], ";", i);
    }
    let atrs = [];
    for(let i=1;i<=num - 1;i++) {
        let split = data[0].substring(atrPos[i], atrPos[i+1]).substr(1);
        atrs.push(split);
    }
    /***/
    if(connection == 'local' || ((connection == 'online') && (dataSource == 'file'))) {
        atrs[atrs.length - 1] = atrs[atrs.length - 1].slice(0, -1);
    }
    /***/
    atrPos.shift();
    data.shift();

    let valuePos = [];
    let values = [];
    data.forEach(d => {
        let valueItem = [];
        for(let i=1;i<=num - 1;i++) {
            valuePos[i] = getPosition(d, ";", i);
        }
        for(let i=1;i<=num - 1;i++) {
            let split = d.substring(valuePos[i], valuePos[i+1]).substr(1);
            valueItem.push(split);
        }
        values.push(valueItem);
    });

    let dataAr = [];

    values.forEach((d, i) => {
        let dataObj = {};
        atrs.forEach((D, j) => {
            let value = values[i][j];
            if(!isNaN(value)) {
                value = parseInt(value);
            }
            dataObj[atrs[j]] = value; 
        });
        dataAr.push(dataObj);
    })

    function getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }
    return {
        data: dataAr,
        metadata: metaObj
    }
}
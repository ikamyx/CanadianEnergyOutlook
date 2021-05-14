"use strict";

function dataCoversion(data, attrList) {
    data.forEach(e => {
        let sum = 0;  
        // adding sum of each row of data
        attrList.forEach(d => {
            sum = e[d] + sum;
            e.sum = sum;
        });
    });
}
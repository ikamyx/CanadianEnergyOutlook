"use strict";

function dataCoversion_line(data, metadata, attrList, level_1) {
    data.forEach(e => {
        let sumPositive = 0;
        let sumNegative = 0;
        let sum = 0;
        // adding sum of each row of data
        attrList.forEach(d => {
            let value = e[d];
            if(value.toString().includes("-")) value = 0;
            e.sumPositive = sumPositive;
            e.sumNegative = sumNegative;
            if(value >= 0) {
                sumPositive = value + sumPositive;
                e.sumPositive = sumPositive;
            }
            else if(value) {
                sumNegative = value + sumNegative;
                e.sumNegative = sumNegative;
            }
            sum = value + sum;
            e.sum = sum;
        });
        // e[metadata.chart[Object.keys({level_1})]] = d3.timeParse("%Y")(e[metadata.chart[Object.keys({level_1})]])
    });
}
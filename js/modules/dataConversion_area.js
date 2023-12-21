"use strict";

function dataCoversion_area(data, metadata, attrList, level_1) {
    data.forEach(e => {
        let sumPositive = 0;
        let sumNegative = 0;
        let sum = 0;
        // adding sum of each row of data
        attrList.forEach(d => {
            e.sumPositive = sumPositive;
            e.sumNegative = sumNegative;
            if( e[d] >= 0) {
                sumPositive =  e[d] + sumPositive;
                e.sumPositive = sumPositive;
            }
            else if( e[d]) {
                sumNegative =  e[d] + sumNegative;
                e.sumNegative = sumNegative;
            }
            sum =  e[d] + sum;
            e.sum = sum;
        });
        e[metadata.chart[Object.keys({level_1})]] = d3.timeParse("%Y")(e[metadata.chart[Object.keys({level_1})]])
    });
}
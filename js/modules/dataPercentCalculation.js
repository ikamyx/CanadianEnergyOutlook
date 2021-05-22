"use strict";

function dataPercentCalculation(data, attrList) {
    data.forEach(e => {
        attrList.forEach(d => {
            e[d] = e[d] / e.sum * 100;
        })
        e.sum = e.sum / e.sum * 100;
    })
}
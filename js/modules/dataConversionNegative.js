"use strict";

function dataCoversionNegative(data, attrList) {
    data.forEach(e => {
        let sumPositive = 0;
        let sumNegative = 0;  
        // adding sum of each row of data
        attrList.forEach(d => {
            e.sumPositive = sumPositive;
            e.sumNegative = sumNegative;
            if(e[d] >= 0) {
                sumPositive = e[d] + sumPositive;
                e.sumPositive = sumPositive;
            }
            else {
                sumNegative = e[d] + sumNegative;
                e.sumNegative = sumNegative;
            }
            
        });
    });
}
"use strict";

function mapColor(colors, attrList) {
    let colorList = [];
    attrList.forEach(d => {
        let result = colors.find(obj => {
            if((obj.variable == d)) {
                return obj;
            }
          });
        colorList.push(result);
    });
    console.log(attrList, colorList)
    return colorList;
}
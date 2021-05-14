"use strict";

function mapColor(colors, attrList) {
    let colorList = [];
    attrList.forEach(d => {
        let result = colors.find(obj => {
            if((obj.label == d)) {
                return obj;
            }
          });
        colorList.push(result.color);
    });
    return colorList;
}
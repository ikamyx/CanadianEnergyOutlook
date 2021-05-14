"use strict";

function parserSettings(data) {
    return data
    //.filter(x => x.isVariable == "yes")
    .reduce((c, v) => {
        c[v.chart] = c[v.chart] || {}; 
        c[v.chart][v.setting] = c[v.chart][v.setting] || {};
        c[v.chart][v.setting][v.type] = data.filter(x => (x.chart == v.chart) && (x.setting == v.setting) && (x.type == v.type))
        .map(item => +item.value).reduce((previousValue, currentValue) => {return previousValue + currentValue })
        return c;
      }, {});
}
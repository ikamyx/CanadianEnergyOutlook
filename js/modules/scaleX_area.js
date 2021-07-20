"use strict";

function scaleX_area(data, metadata, level_1, xAxisWidth) {
    let scaleX = d3.scaleTime()
    .domain([
        d3.timeYear.offset(d3.min(data, d => d[metadata.chart[Object.keys({level_1})]]), 0), 
        d3.timeYear.offset(d3.max(data, d => d[metadata.chart[Object.keys({level_1})]]), 1)
    ])
    //.domain(d3.extent(data, d => d[metadata.chart[Object.keys({level_1})]]))
    .range([0, xAxisWidth]);
    return scaleX;
}
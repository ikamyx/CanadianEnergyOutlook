"use strict";

function yAxisInit_bar_double(chart, scaleY, label, i) {
    chart.selectAll(`g.row${i} g.plot_groups`)
    .each(function(d,i){
        d3.select(this)
        .append("g")
        .attr("class", "y_axis")
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(scaleY[i]));
    });
    chart.selectAll("g.y_axis")
    .each(function(d,i) {
    d3.select(this)
    .append("g")
    .attr("class", "text")
    .append("text")
    .text(label);
    });
}
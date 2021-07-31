"use strict";

function xAxisInit_bar(chart, scaleX, label) {
    // add the x axis
    chart.append("g")
    .attr("class", "x_axis")
    .append("g")
    .attr("class", "axis")
    .call(d3.axisBottom(scaleX).ticks(0));

    // xAxis Label
    chart.select("g.x_axis")
    .append("g")
    .attr("class", "text")
    .append("text")
    .text(label);
}


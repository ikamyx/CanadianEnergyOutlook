"use strict";

function yAxisInit_bar(chart, scaleY, label) {
    // add the y axis
    chart.append("g")
    .attr("class", "y_axis")
    .append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(scaleY).ticks(0));

    // yAxis Label
    chart.select("g.y_axis")
    .append("g")
    .attr("class", "text")
    .append("text")
    .text(label);
}


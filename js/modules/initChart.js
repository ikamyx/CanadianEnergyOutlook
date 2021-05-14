"use strict";

function initChart(chart, data) {
    chart.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .each(function(_, i) {
        d3.select(this)
        //.attr("data-content", level_2[i])
        .attr("class", "bar_groups");
    });
}


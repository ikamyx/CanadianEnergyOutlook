"use strict";

function yAxisGrid_bar_double(chart, xAxisWidth, scaleY, i) {
    chart.selectAll(`g.row${i} g.plot_groups`)
    .each(function(d,i){
        let j = Math.floor(i / 2) + 1;
        let k = (i % 2) + 1;
        d3.select(this)
        .append("g")
        .lower()
        .attr("class", "grid")
        .call(d3.axisLeft(scaleY[i])
            .tickSize(-xAxisWidth)
            .tickFormat("")
        );
    });
    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });
}
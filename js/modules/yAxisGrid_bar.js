"use strict";

function yAxisGrid_bar(chart, xAxisWidth, scaleY) {
    chart.append("g")
    .lower()	
    .attr("class", "grid")
    .call(d3.axisLeft(scaleY)
        .tickSize(-xAxisWidth)
        .tickFormat("")
    );
    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });
}


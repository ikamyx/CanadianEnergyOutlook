"use strict";

function xAxisGrid_line(chart, level_1, yAxisHeight, scaleX, setting) {
    let ticks = level_1.map(d => d3.timeParse("%Y")(d))
    chart.append("g")
    .lower()	
    .attr("class", "grid")
    .call(d3.axisBottom(scaleX)
        .tickSize(-yAxisHeight)
        .tickValues(ticks)
        .tickFormat(d3.timeFormat("%Y"))
    );
    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });
    chart.selectAll("g.grid text")
    .each(function() {
        d3.select(this)
        .attr("transform", `translate(0, ${setting.xTicks.row1Margin})`)
    });
};


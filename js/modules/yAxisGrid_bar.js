"use strict";

function yAxisGrid_bar(chart, xAxisWidth, scaleY, setting) {
    let ticks = scaleY.ticks().filter((_,i) => i % 3 == 0);
    console.log(ticks)
    chart.append("g")
    .lower()	
    .attr("class", "yGrid grid")
    .call(d3.axisLeft(scaleY)
        .tickSize(-xAxisWidth)
        .tickValues(ticks)
    );
    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });
    chart.selectAll("g.yGrid text")
    .each(function() {
        d3.select(this)
        .attr("transform", `translate(${-1 * setting.yTicks.rowMargin}, 0)`)
    });
}


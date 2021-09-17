"use strict";

function ticks_horizontal_bar(chart, data, metadata, yAxisHeight, setting, distribution) {
    chart.selectAll("g.bar")
    .each(function(_, i){
        d3.select(this)
        .append("g")
        .attr("class", "tick_x")
        .append("text")
        .text(data[i][metadata.chart.level_1])
        .attr("y", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.fontHeight);
    });
    let tickWidth = [];
    chart.selectAll("g.tick_x text")
    .each(function(_, i){
        tickWidth.push(d3.select(this).node().getBBox().width);
    });
    chart.selectAll("g.tick_x text")
    .each(function(_, i) {
        d3.select(this)
        .attr("x", distribution.barWidth / 2 - tickWidth[i] / 2)
    });
}

"use strict";

function ticks_vertical_bar(chart, data, metadata, yAxisHeight, setting, distribution, tickWidth, tickHeight) {
    chart.selectAll("g.bar")
    .each(function(_, i){
        d3.select(this)
        .append("g")
        .attr("class", "tick_x")
        .append("text")
        .text(data[i][metadata.chart.level_1])
        .attr("y", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin);
    });
    chart.selectAll("g.tick_x text")
    .each(function(_, i){
        tickWidth.push(d3.select(this).node().getBBox().width);
        tickHeight.push(d3.select(this).node().getBBox().height);
    });
    let maxTickWidth = Math.max(...tickWidth)
    chart.selectAll("g.tick_x text")
    .each(function(_, i){
        d3.select(this)
        .attr("style", `transform-box: fill-box; transform: translateY(${tickWidth[i] + tickHeight[i]}px) rotate(-90deg);`);
    });
    chart.selectAll("g.tick_x text")
    .each(function(_, i) {
        d3.select(this)
        .attr("x", distribution.barWidth / 2 - tickHeight[i] / 2)
    });
    return maxTickWidth;
}

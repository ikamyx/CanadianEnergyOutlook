"use strict";

function ticks_horizontal_bar_double(chart, data, data_, metadata, yAxisHeight, setting, distribution, i) {
    chart.selectAll(`g.row${i} g.plot_groups`)
    .each(function(_,i) {
        let __ = d3.select(this).attr("data-content");
        d3.select(this)
        .selectAll("g.bar_groups")
        .each(function(_d,j) {
            let ___ = d3.select(this).attr("data-content"); 
            d3.select(this)
            .selectAll("g.bar")
            .each(function(d,k) {
                d3.select(this)
                .append("g")
                .attr("class","tick_x")
                .append("text")
                .text(data.filter(h => h[metadata.chart.level_3] == __).filter(m => m[metadata.chart.level_2] == ___)[k][metadata.chart.level_1])
                .attr("y", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.fontHeight);
            });
        });
    });
    let tickWidth = data_.map(d => new Array());
    chart.selectAll(`g.row${i} g.plot_groups`)
    .each(function(_, i){
        d3.select(this)
        .selectAll("g.tick_x text")
        .each(function(d,j){
            tickWidth[i].push(d3.select(this).node().getBBox().width);
        });
    });
    chart.selectAll(`g.row${i} g.plot_groups`)
    .each(function(_,i) {
        d3.select(this)
        .selectAll("g.tick_x text")
        .each(function(d,j) {
            d3.select(this)
            .attr("x", distribution[i].barWidth / 2 - tickWidth[i][j] / 2)
        });
    });
}
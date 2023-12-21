"use strict";

function plotTitle_double(chart, setting, yAxisHeight, xAxisWidth, level_3, index) {
    chart.selectAll(`g.row${index} g.plot_groups`)
    .data(level_3)
    .each(function(_,j) {
        let m = (j % 2);
        let n = Math.floor(j / 2) + (index - 1);
        d3.select(this)
        .append("g")
        .attr("class", "title")
        .append("text")
        .text((d => d))
        .attr("x", setting.padding.left + setting.yAxis.width + setting.yAxis.lineWidth + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.title.marginX + m*(xAxisWidth + setting.padding.middleX + setting.yAxis.width + setting.yAxis.lineWidth + setting.yAxis.labelMargin + setting.yAxis.labelHeight))
        .attr("y", setting.padding.top + setting.title.fontHeight + yAxisHeight*n + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n)
    });
}
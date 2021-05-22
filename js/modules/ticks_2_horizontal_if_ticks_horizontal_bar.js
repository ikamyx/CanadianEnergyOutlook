"use strict";

function ticks_2_horizontal_if_ticks_horizontal_bar(chart, level_2, metadata, yAxisHeight, setting, barGroupWidth) {
    chart.selectAll("g.bar_groups")
    .data(level_2)
    .each(function(d, i) {
        let g = d3.select(this)
        .append("g").attr("class", metadata.chart.level_2 + "_group");
        g.append("line")
        .attr("x1", setting.xTicks.lineSeparatorExtra)
        .attr("x2", barGroupWidth[i] + setting.xTicks.lineSeparatorExtra)
        .attr("y1", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight)
        .attr("y2", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.row2Margin + setting.xTicks.fontHeight)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7)
        // .attr("stroke-dasharray", "4, 4");
        g.append("line")
        .attr("x1", setting.xTicks.lineSeparatorExtra)
        .attr("x2", setting.xTicks.lineSeparatorExtra)
        .attr("y1", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight - 4)
        .attr("y2", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7);
        g.append("line")
        .attr("x1", barGroupWidth[i] + setting.xTicks.lineSeparatorExtra)
        .attr("x2", barGroupWidth[i] + setting.xTicks.lineSeparatorExtra)
        .attr("y1", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight)
        .attr("y2", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight - 4)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7);
        g.append("text")
        .text(d => d)
        .attr("y", yAxisHeight + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2);
        let textWidth = g.select("text").node().getBBox().width;
        g.select("text")
        .attr("x", barGroupWidth[i] / 2 - textWidth / 2);
    });
}
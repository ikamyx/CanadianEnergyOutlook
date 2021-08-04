"use strict";

function ticks_grouped_horizontal_horizontal_bar(chart, level_2, metadata, xAxisWidth, setting, barGroupHeight) {
    chart.selectAll("g.bar_groups")
    .data(level_2)
    .each(function(d, i) {
        let g = d3.select(this)
        .append("g").attr("class", metadata.chart[Object.keys({level_2})] + "_group");
        g.append("line")
        .attr("y1", setting.yTicks.lineSeparatorExtra)
        .attr("y2", barGroupHeight[i] + setting.yTicks.lineSeparatorExtra)
        .attr("x1", setting.padding.left + setting.yTicks.row1Margin + setting.yTicks.lineSeparatorMargin + setting.yTicks.lineSeparatorExtra + setting.yTicks.fontHeight - setting.yTicks.lineSeparatorMargin)
        .attr("x2", setting.padding.left + setting.yTicks.row1Margin + setting.yTicks.lineSeparatorMargin + setting.yTicks.lineSeparatorExtra + setting.yTicks.fontHeight - setting.yTicks.lineSeparatorMargin)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7)
        // .attr("stroke-dasharray", "4, 4");
        g.append("line")
        .attr("y1", setting.yTicks.lineSeparatorExtra)
        .attr("y2", setting.yTicks.lineSeparatorExtra)
        .attr("x1", setting.padding.left + setting.yTicks.row1Margin + setting.yTicks.lineSeparatorMargin + setting.yTicks.lineSeparatorExtra + setting.yTicks.fontHeight - setting.yTicks.lineSeparatorMargin + 4)
        .attr("x2", setting.padding.left + setting.yTicks.row1Margin + setting.yTicks.lineSeparatorMargin + setting.yTicks.lineSeparatorExtra + setting.yTicks.fontHeight - setting.yTicks.lineSeparatorMargin)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7);
        g.append("line")
        .attr("y1", barGroupHeight[i] + setting.yTicks.lineSeparatorExtra)
        .attr("y2", barGroupHeight[i] + setting.yTicks.lineSeparatorExtra)
        .attr("x1", setting.padding.left + setting.yTicks.row1Margin + setting.yTicks.lineSeparatorMargin + setting.yTicks.lineSeparatorExtra + setting.yTicks.fontHeight - setting.yTicks.lineSeparatorMargin)
        .attr("x2", setting.padding.left + setting.yTicks.row1Margin + setting.yTicks.lineSeparatorMargin + setting.yTicks.lineSeparatorExtra + setting.yTicks.fontHeight - setting.yTicks.lineSeparatorMargin + 4)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7);
        g.append("text")
        .text(d => d);
        let textHeight = g.select("text").node().getBBox().height;
        let textWidth = g.select("text").node().getBBox().width;

        g.select("text")
        .attr("x",  setting.padding.left + setting.yTicks.row1Margin + setting.yTicks.lineSeparatorMargin + setting.yTicks.lineSeparatorExtra + setting.yTicks.fontHeight - setting.yTicks.lineSeparatorMargin - setting.yTicks.row1Margin - setting.yTicks.fontHeight + (setting.yTicks.fontHeight - textWidth))
        .attr("y", textHeight + barGroupHeight[i] / 2 - textHeight / 2 - 5);
    });
}
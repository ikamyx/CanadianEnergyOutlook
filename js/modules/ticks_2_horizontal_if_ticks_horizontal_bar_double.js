"use strict";

function ticks_2_horizontal_if_ticks_horizontal_bar_double(chart, level_2, metadata, yAxisHeight, xAxisWidth, setting, barGroupWidth, index) {
    chart.selectAll(`g.row${index} g.plot_groups`)
    .each(function(_,j){
        let m =  (j % 2);
        d3.select(this)
        .selectAll("g.bar_groups")
        .data(level_2)
        .each(function(d, i) {
            let m = (j % 2);
            let n = Math.floor(j / 2) + (index - 1);
            let g = d3.select(this)
            .append("g").attr("class", metadata.chart.level_2 + "_group");
            g.append("line")
            .attr("x1", setting.xTicks.lineSeparatorExtra+ m*(xAxisWidth + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.lineWidth + setting.yAxis.width))
            .attr("x2", barGroupWidth[j][i] + setting.xTicks.lineSeparatorExtra+ m*(xAxisWidth + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.lineWidth + setting.yAxis.width))
            .attr("y1", yAxisHeight*(n+1) + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight + setting.title.fontHeight + setting.title.marginY)
            .attr("y2", yAxisHeight*(n+1) + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight + setting.title.fontHeight + setting.title.marginY)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7)
            // .attr("stroke-dasharray", "4, 4");
            g.append("line")
            .attr("x1", setting.xTicks.lineSeparatorExtra+ m*(xAxisWidth + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.lineWidth + setting.yAxis.width))
            .attr("x2", setting.xTicks.lineSeparatorExtra+ m*(xAxisWidth + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.lineWidth + setting.yAxis.width))
            .attr("y1", yAxisHeight*(n+1) + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight + setting.title.fontHeight + setting.title.marginY - 4)
            .attr("y2", yAxisHeight*(n+1) + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight + setting.title.fontHeight + setting.title.marginY)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7);
            g.append("line")
            .attr("x1", barGroupWidth[j][i] + setting.xTicks.lineSeparatorExtra+ m*(xAxisWidth + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.lineWidth + setting.yAxis.width))
            .attr("x2", barGroupWidth[j][i] + setting.xTicks.lineSeparatorExtra+ m*(xAxisWidth + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.lineWidth + setting.yAxis.width))
            .attr("y1", yAxisHeight*(n+1) + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight + setting.title.fontHeight + setting.title.marginY)
            .attr("y2", yAxisHeight*(n+1) + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight + setting.title.fontHeight + setting.title.marginY - 4)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7);
            g.append("text")
            .text(d => d);
            let textWidth = g.select("text").node().getBBox().width;
            g.select("text")
            .attr("x", barGroupWidth[j][i] / 2 - textWidth / 2 + m*(setting.padding.left + xAxisWidth + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.lineWidth + setting.yAxis.width))
            .attr("y", yAxisHeight*(n+1) + (setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)*n + setting.padding.top + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)
        });
    });
}
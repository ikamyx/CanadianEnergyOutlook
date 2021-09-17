"use strict";

function ticks_grouped_grouped_horizontal_bar(chart, level_2, metadata, yAxisHeight, setting, barInnerGroupWidth) {
    chart.selectAll("g.bar_groups")
    .each(function(d, i) {
        d3.select(this)
        .selectAll("g")
        .each(function(d_,j) {
            let g = d3.select(this)
            .append("g")
            .attr("class", metadata.chart[Object.keys({level_2})] + "_group");
            g.append("line")
            .attr("x1", setting.xTicks.lineSeparatorExtra)
            .attr("x2", barInnerGroupWidth[j] + setting.xTicks.lineSeparatorExtra)
            .attr("y1", yAxisHeight + setting.padding.top + setting.xTicks.line1SeparatorMargin)
            .attr("y2", yAxisHeight + setting.padding.top + setting.xTicks.line1SeparatorMargin)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7)
            // .attr("stroke-dasharray", "4, 4");
            g.append("line")
            .attr("x1", setting.xTicks.lineSeparatorExtra)
            .attr("x2", setting.xTicks.lineSeparatorExtra)
            .attr("y1", yAxisHeight + setting.padding.top + setting.xTicks.line1SeparatorMargin - 4)
            .attr("y2", yAxisHeight + setting.padding.top + setting.xTicks.line1SeparatorMargin)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7);
            g.append("line")
            .attr("x1", barInnerGroupWidth[i] + setting.xTicks.lineSeparatorExtra)
            .attr("x2", barInnerGroupWidth[i] + setting.xTicks.lineSeparatorExtra)
            .attr("y1", yAxisHeight + setting.padding.top + setting.xTicks.line1SeparatorMargin)
            .attr("y2", yAxisHeight + setting.padding.top + setting.xTicks.line1SeparatorMargin - 4)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7);
            g.append("text")
            .text(d3.select(this).attr("data-content"))
            .attr("y", yAxisHeight + setting.padding.top + setting.xTicks.line1SeparatorMargin + setting.xTicks.row1Margin + setting.xTicks.fontHeight);
            let textWidth = g.select("text").node().getBBox().width;
            g.select("text")
            .attr("x", barInnerGroupWidth[j] / 2 - textWidth / 2);
        });
    });
};
"use strict";

function initChart_multi(data, setting, level_2, level_3) {
    let chart = d3.select("body svg");
    chart.attr("width", setting.dimension.width)
    .attr("viewBox", `0 0 ${setting.dimension.width} ${setting.dimension.height}`)
    .style("max-width", "100%")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .each(function(_, i) {
        d3.select(this)
        .attr("data-content", level_3[i])
        .attr("class", "plot_groups")
        .selectAll("g")
        .data(data[i])
        .enter()
        .append("g")
        .each(function(__, j) {
            d3.select(this)
            .attr("data-content", level_2[j])
            .attr("class", "bar_groups");
        });
    });
    return chart;
}
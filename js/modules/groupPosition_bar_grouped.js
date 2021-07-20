"use strict";

function groupPosition_bar_grouped(chart, barInnerGroupWidth, barOuterGroupWidth, barGroupPos, setting, distribution) {
    chart.selectAll("g.bar_groups")
    .each(function(_, i){
        d3.select(this)
        .selectAll("g")
        .each(function(d, j) {
            barInnerGroupWidth.push(d3.select(this).node().getBBox().width);
        });
    });
    let c = 0;
    chart.selectAll("g.bar_groups")
    .each(function(_, i) {
        let barInnerGroupPos = 0;
        d3.select(this)
        .selectAll("g")
        .each(function(d, j) {
            d3.select(this)
            .attr("transform", `translate(${barInnerGroupPos}, 0)`)
            barInnerGroupPos = barInnerGroupPos + barInnerGroupWidth[c] + distribution.innerGroupSpace*(j+1);
            c++;
        });
    });
    chart.selectAll("g.bar_groups")
    .each(function(_, i) {
        barOuterGroupWidth.push(d3.select(this).node().getBBox().width);
    });
    barGroupPos.forEach((d, i) => {
        for(let k=0; k<i; k++) {
            barGroupPos[i] = barGroupPos[i] + barOuterGroupWidth[k];
        }
        barGroupPos[i] = barGroupPos[i] + i*distribution.outerGroupSpace + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yAxis.lineWidth + distribution.preSpace;
    });
}


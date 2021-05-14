"use strict";

function groupPosition_bar(chart, barGroupWidth, barGroupPos, setting, optimization) {
    chart.selectAll("g.bar_groups")
    .each(function(_, i){
        barGroupWidth.push(d3.select(this).node().getBBox().width);
    });
    for (let i = 0; i < barGroupWidth.length; i++) barGroupPos[i] = 0;
    barGroupPos.forEach((d, i) => {
        for(let k=0; k<i; k++) {
            barGroupPos[i] = barGroupPos[i] + barGroupWidth[k];
        }
        barGroupPos[i] = barGroupPos[i] + i*optimization.groupSpace + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yAxis.lineWidth + optimization.preSpace;
    });
}


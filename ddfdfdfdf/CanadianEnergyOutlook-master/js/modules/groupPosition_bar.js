"use strict";

function groupPosition_bar(chart, barGroupWidth, barGroupPos, setting, distribution, data) {
    chart.selectAll("g.bar_groups")
    .each(function(_, i){
        // barGroupWidth.push(d3.select(this).node().getBBox().width);
        let groupWidth = (data[i].length * distribution.barWidth) + ((data[i].length - 1) * (distribution.barSpace))
        barGroupWidth.push(groupWidth);
    });
    barGroupPos.forEach((d, i) => {
        for(let k=0; k<i; k++) {
            barGroupPos[i] = barGroupPos[i] + barGroupWidth[k];
        }
        barGroupPos[i] = barGroupPos[i] + i*distribution.groupSpace + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yAxis.lineWidth + distribution.preSpace + setting.yTicks.rowMargin;
    });
}


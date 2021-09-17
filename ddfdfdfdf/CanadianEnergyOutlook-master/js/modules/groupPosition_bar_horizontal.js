"use strict";

function groupPosition_bar_horizontal(chart, barGroupHeight, barGroupPos, setting, distribution) {
    chart.selectAll("g.bar_groups")
    .each(function(_, i){
        barGroupHeight.push(d3.select(this).node().getBBox().height);
    });
    barGroupPos.forEach((d, i) => {
        for(let k=0; k<i; k++) {
            barGroupPos[i] = barGroupPos[i] + barGroupHeight[k];
        }
        barGroupPos[i] = barGroupPos[i] + i*distribution.groupSpace + setting.padding.top + distribution.preSpace;
    });
}


"use strict";

function groupPosition_bar_double(chart, barGroupWidth, barGroupPos, setting, distribution, i) {
    chart.selectAll(`g.row${i} g.plot_groups`)
    .each(function(_, i) {
        d3.select(this)
        .selectAll("g.bar_groups")
        .each(function(d, j) {
            barGroupWidth[i].push(d3.select(this).node().getBBox().width);
        });
    });
    barGroupPos.forEach((d,j) => {
        let m =  (j % 2) + 1;
        d.forEach((d_,i) => {
            for(let k=0; k<i; k++) {
                barGroupPos[j][i] = barGroupPos[j][i] + barGroupWidth[j][k];
            };
            barGroupPos[j][i] = barGroupPos[j][i] + i*distribution[j].groupSpace + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yAxis.lineWidth + distribution[j].preSpace + setting.padding.left + (m - 1) * (setting.padding.middleX - setting.padding.left)  ;
        });
    });
}
"use strict";

function scaleY_bar_multi(data, metadata, level_3, yAxisHeight) {
    let scaleY = [];
    level_3.forEach((d,i) => {
        let _data = data.filter(g => g[metadata.chart.level_3] == d);
        scaleY.push(d3.scaleLinear()
        .domain([0, d3.max(_data, d_ => d_.sum) + 0])
        .range([yAxisHeight, 0]));
        let ticks = scaleY[scaleY.length - 1].ticks(),
        lastTick = ticks[ticks.length - 1],
        newLastTick = lastTick + (ticks[1] - ticks[0]);
        if (lastTick<scaleY[scaleY.length - 1].domain()[1]) {
            ticks.push(newLastTick);
        }
        scaleY[scaleY.length - 1].domain([scaleY[scaleY.length - 1].domain()[0], newLastTick]);
    });
    return scaleY;
}
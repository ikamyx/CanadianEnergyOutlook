"use strict";

function scaleY_bar_multi(data, metadata, level_3, yAxisHeight) {
    let scaleY = [];
    level_3.forEach((d,i) => {
        let _data = data.filter(g => g[metadata.chart.level_3] == d);
        scaleY.push(d3.scaleLinear()
        .domain([d3.min(_data, d_ => d_.sumNegative), d3.max(_data, d_ => d_.sumPositive)])
        .range([yAxisHeight, 0]));
        let ticks = scaleY[scaleY.length - 1].ticks(),
        lastTick = ticks[ticks.length - 1],
        firstTick = ticks[0],
        newLastTick = lastTick + (ticks[1] - ticks[0]),
        newFirstTick = firstTick - (ticks[1] - ticks[0]);

        if (lastTick<scaleY[scaleY.length - 1].domain()[1]) {
            ticks.push(newLastTick);
            scaleY[scaleY.length - 1].domain([scaleY[scaleY.length - 1].domain()[0], newLastTick]);
        }
        if (firstTick>scaleY[scaleY.length - 1].domain()[0]) {
            ticks.unshift(newFirstTick);
            scaleY[scaleY.length - 1].domain([newFirstTick, scaleY[scaleY.length - 1].domain()[1]]);
        } 
    });
    return scaleY;
}
"use strict";

function scaleY_bar(data, yAxisHeight) {
    let scaleY = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.sum) + 0])
    .range([yAxisHeight, 0]);
    let ticks = scaleY.ticks(),
        lastTick = ticks[ticks.length - 1],
        newLastTick = lastTick + (ticks[1] - ticks[0]);
    if (lastTick<scaleY.domain()[1]) {
            ticks.push(newLastTick);
    }
    scaleY.domain([scaleY.domain()[0], newLastTick]);
    return scaleY;
}
"use strict";

function scaleX_bar(data, xAxisWidth) {
    let scaleX = d3.scaleLinear()
    .domain([d3.min(data, d => d.sumNegative), d3.max(data, d => d.sumPositive)])
    .range([0, xAxisWidth]);
    let ticks = scaleX.ticks(),
        lastTick = ticks[ticks.length - 1],
        firstTick = ticks[0],
        newLastTick = lastTick + (ticks[1] - ticks[0]),
        newFirstTick = firstTick - (ticks[1] - ticks[0]);

    if (lastTick<scaleX.domain()[1]) {
            ticks.push(newLastTick);
            scaleX.domain([scaleX.domain()[0], newLastTick]);
    }
    if(firstTick>scaleX.domain()[0]) {
        ticks.unshift(newFirstTick);
        scaleX.domain([newFirstTick, scaleX.domain()[1]]);
    }
    return scaleX;
}
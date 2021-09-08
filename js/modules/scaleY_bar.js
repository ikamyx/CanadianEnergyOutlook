"use strict";

function scaleY_bar(data, yAxisHeight) {

    let scaleY = d3.scaleLinear()
    .domain([d3.min(data, d => d.sumNegative), d3.max(data, d => d.sumPositive)])
    .range([yAxisHeight, 0]);
    let ticks = scaleY.ticks(),
        lastTick = ticks[ticks.length - 1],
        firstTick = ticks[0],
        newLastTick = lastTick + (ticks[1] - ticks[0]),
        newFirstTick = firstTick - (ticks[1] - ticks[0]);

    console.log(scaleY.domain()[0], scaleY.domain()[1])
    console.log(scaleY.ticks())

    if (lastTick<scaleY.domain()[1]) {
            ticks.push(newLastTick);
            scaleY.domain([scaleY.domain()[0], newLastTick]);
    }
    if(firstTick>scaleY.domain()[0]) {
        ticks.unshift(newFirstTick);
        scaleY.domain([newFirstTick, scaleY.domain()[1]]);
    }
    return scaleY;
}
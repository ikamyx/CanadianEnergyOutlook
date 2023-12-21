"use strict";

function scaleY_fan(stackedData, yAxisHeight) {

    let scaleY = d3.scaleLinear().range([yAxisHeight, 0]);
    if(d3.min(stackedData[0], d => d[1]) < 0) {
        scaleY.domain([d3.min(stackedData[0], d => d[1]), d3.max(stackedData[stackedData.length - 1], d => d[0])]).nice();
    } else {
        scaleY.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[0])]).nice()
    }
    
    let ticks = scaleY.ticks(),
        lastTick = ticks[ticks.length - 1],
        firstTick = ticks[0],
        newLastTick = lastTick + (ticks[1] - ticks[0]),
        newFirstTick = firstTick - (ticks[1] - ticks[0]);
    
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
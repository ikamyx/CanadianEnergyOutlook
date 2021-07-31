"use strict";

function xAxisGrid_line(chart, level_1, yAxisHeight, scaleX, setting) {
    // let ticks = level_1.map(d => d3.timeParse("%Y")(d)).filter((_,i) => (i % 5 == 0))
    let ticks = scaleX.ticks();
    let distance = (ticks[ticks.length - 1] - ticks[0]) / 5;
    let newTicks = new Array();
    if(ticks[0] < 0) newTicks.push(0);
    for(let i = 0; i <= 5; i++) {
        let value = ticks[0] + i*distance;
        newTicks.push(value);
    }
    newTicks.sort(function(a, b) { return a - b;});
    // newTicks.push(level_1[0]);
    chart.append("g")
    .lower()	
    .attr("class", "xGrid grid")
    .call(d3.axisBottom(scaleX)
        .tickSize(-yAxisHeight)
        .tickValues(newTicks)
        //.tickValues(ticks)
        //.tickFormat(d3.timeFormat("%Y"))

    );
    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });
    chart.selectAll("g.xGrid text")
    .each(function() {
        d3.select(this)
        .attr("transform", `translate(0, ${setting.xTicks.row1Margin})`)
    });
};


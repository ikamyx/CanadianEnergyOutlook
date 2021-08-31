"use strict";

function yAxisGrid_fan(chart, xAxisWidth, scaleY, setting) {
    let ticks = scaleY.ticks();
    let newTicks = new Array();
    if(ticks[0] < 0) {

        if(Math.abs(ticks[0] - 0) >= 0.35 * Math.abs(ticks[ticks.length - 1] - 0)) {
            let distance = ticks[ticks.length - 1] / 2;
            let distance_negative = ticks[0] / 2;
            newTicks.push(ticks[0], distance_negative, 0, distance, ticks[ticks.length - 1]);
        }
        else {
            let distance = ticks[ticks.length - 1] / 3;
            newTicks.push(ticks[0]);
            for(let i = 0; i <= 3; i++) {
                let value = i*distance;
                newTicks.push(value);
            }
        }
        
        
    } else {
        let distance = (ticks[ticks.length - 1] - ticks[0]) / 4;
        if(ticks[0] < 0) newTicks.push(0);
        for(let i = 0; i <= 4; i++) {
            let value = ticks[0] + i*distance;
            newTicks.push(value);
        }
    }
    newTicks.sort(function(a, b) { return a - b;});
    chart.append("g")
    .lower()	
    .attr("class", "yGrid grid")
    .call(d3.axisLeft(scaleY)
        .tickSize(-xAxisWidth)
        .tickValues(newTicks)
        .tickFormat(d3.formatLocale(
            {
            decimal: ",",
            thousands: " ",
            grouping: [3]
            }
        ).format(",.0f"))
    );
    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });
    chart.selectAll("g.yGrid text")
    .each(function() {
        d3.select(this)
        .attr("transform", `translate(${-1 * setting.yTicks.rowMargin}, 0)`)
    });
}


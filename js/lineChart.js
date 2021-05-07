"use strict";

function lineChart(data, metadata, colors) {

    let chart = d3.select("body svg#single");
    let level_2_List = data.map(d => d[metadata.chart.level_2]), // sorting by aggregation level 2 in separate array
        level_1_List = data.map(d => d[metadata.chart.level_1]),
        data_ = [],
        colorList = [],
        // creating list for legend filtering
        attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2));
        
        level_2_List = level_2_List.filter(function(item, pos) {
            return level_2_List.indexOf(item) == pos;
        });
        level_1_List = level_1_List.filter(function(item, pos) {
            return level_1_List.indexOf(item) == pos;
        });
        let attrListLegened = level_2_List.map(x => x);
        const width = 900, height = 600,
          padding = {
            top: 30,
            right: 30, // space between legend and chart 
            bottom: 30,
            left: 30, // y axis label to left
          },
          legendLineSpace = 20,
          legendColorBoxWidth = 15,
          legendBoxToText = 20,
          legendMargin = 20, // legend to right
          yAxisLabelMargin = 20, // y axis label to the y axis
          yAxisLineWidth = 1,
          secondTickLineMargin = 10,
          secondTickMargin = 10,
          minTickFontHeight = 10, // fixed
          secondTickLineExtra = 0,
          figureTitleMargin = 30;

    // time format
    let parseTime = d3.timeParse("%Y");

    // data conversion
    data.forEach(e => {
        let sum = 0;  
        // adding sum of each row of data
        attrList.forEach(d => {
            sum = e[d] + sum;
            e.sum = sum;
        });
    });

    // data re arrange by aggregation level 2
    level_2_List.forEach(e => {
        data_.push(data.filter(g => g[metadata.chart.level_2] == e))
    });
    
    // map the colors
    level_2_List.forEach(d => {
        let result = colors.find(obj => {
            if((obj.label == d)) {
                return obj;
            }
        });
        colorList.push(result.color);
    });
    
    
    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(level_2_List)
    .range(colorList);
    
    // initialize
    chart.selectAll("g")
    .data(data_)
    .enter()
    .append("g")
    .each(function(_, i) {
        d3.select(this)
        .attr("data-content", level_2_List[i])
        .attr("class", "line");
    });

    // chart Title
    chart.append("g")
    .attr("class", "figureTitle")
    .append("text")
    .text("fig " + metadata.chart.section + " - " + metadata.chart.title);
    let titleWidth = chart.select("g.figureTitle").node().getBBox().width;
    let titleHeight = chart.select("g.figureTitle").node().getBBox().height;

    // legend
    chart.append("g")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("class", "legend")
    .selectAll("g")
    .data(attrListLegened)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
        return `translate(${0}, ${i * legendLineSpace})`
    })
    .attr("class", "legened_item")
    .attr("data-content", d => d)
    .each(function(d, i) {
        d3.select(this)
        .append("text")
        .text(d)
        .attr("x", legendBoxToText)
        .attr("y", 12)
        d3.select(this)
        .append("rect")
        .attr("fill", d => scaleColor(d))
        .attr("width", legendColorBoxWidth)
        .attr("height", legendColorBoxWidth)
        .attr("x", 0)
        .attr("y", 0);
    });

    let legendWidth = chart.select("g.legend").node().getBBox().width;
    chart.select("g.legend")
    .attr("transform", `translate(${width - legendWidth - padding.right}, ${padding.top})`);

    // scale for Y
    let yAxisHeight = height - padding.top - padding.bottom - figureTitleMargin -titleHeight - secondTickLineMargin - secondTickMargin - minTickFontHeight;
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

    // add the y axis
    chart.append("g")
    .attr("class", "y_axis")
    .append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(scaleY));

    //yAxis Label
    chart.select("g.y_axis")
    .append("g")
    .attr("class", "text")
    .append("text")
    .text(metadata.chart.yLabel);

    let yAxisWidth = chart.select("g.y_axis > .axis").node().getBBox().width;
    let yAxisLabelHeight = chart.select("g.y_axis > .text").node().getBBox().height;
    let yAxisLabelWidth = chart.select("g.y_axis > .text").node().getBBox().width;

    chart.select("g.y_axis > .text")
    .attr("transform", `translate(${-1 * (yAxisLabelMargin + yAxisWidth)}, ${(yAxisHeight) / 2 + yAxisLabelWidth / 2}) rotate(-90)`);

    
    chart.select("g.y_axis")
    .attr("transform", `translate(${padding.left + yAxisWidth + yAxisLabelMargin + yAxisLabelHeight}, ${padding.top})`);

    // scale for x
    let xAxisWidth = width - padding.left - padding.right - legendMargin - legendWidth - yAxisWidth - yAxisLabelMargin - yAxisLabelHeight - yAxisLineWidth;
    let scaleX = d3.scaleLinear()
    .domain([d3.min(level_1_List), d3.max(level_1_List)])
    .range([0, xAxisWidth]);


    // add the x axis
    chart.append("g")
    .attr("transform", `translate(${padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidth}, ${padding.top + yAxisHeight})`)
    .attr("class", "x_axis")
    .call(d3.axisBottom(scaleX));

    let line = d3.line()
    .x(function(d, i) { return scaleX(d.year); }) // set the x values for the line generator
    .y(function(d) { return scaleY(d.value); }) // set the y values for the line generator 
    //.curve(d3.curveMonotoneX) // apply smoothing to the line

    // bar optimization calculations
    const preSpacePercent = 0.02,
          barSpacePercent = 0.06,
          groupSpacePercent = 0.09,
          barWidthPercent = 0.81;

    let groupSpaceNumber = data_.length - 1,
        barSpaceNumber = 0,
        barNumber = data.length,
        preSpace = xAxisWidth * preSpacePercent;
    let barSpace, groupSpace, barWidth;

    data_.forEach(d => {
        barSpaceNumber = barSpaceNumber + (d.length - 1)
    });


    barSpace = barSpaceNumber ? (xAxisWidth * barSpacePercent) / barSpaceNumber : 0;
    groupSpace = groupSpaceNumber ? (xAxisWidth * groupSpacePercent) / groupSpaceNumber : 0;
    barWidth = (xAxisWidth * barWidthPercent) / barNumber;

        
    // add grid lines for y axis
    chart.append("g")
    .lower()	
    .attr("class", "grid")
    .attr("transform", `translate(${padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidth}, ${padding.top})`)
    .call(d3.axisLeft(scaleY)
        .tickSize(-xAxisWidth)
        .tickFormat("")
    );

    // add grid lines for x axis
    chart.append("g")
    .lower()	
    .attr("class", "grid")
    .attr("transform", `translate(${padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidth}, ${padding.top + yAxisHeight})`)
    .call(d3.axisBottom(scaleX)
        .tickSize(-yAxisHeight)
        .tickFormat("")
    );

    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });

    //drawing lines
    chart.selectAll("g.line")
    .each(function(d, i) {
        d3.select(this)
        .append("path")
        .datum(data_[i])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", d => scaleColor(d[0][metadata.chart.level_2]))
        .attr("transform", `translate(${padding.left + yAxisWidth + yAxisLabelMargin + yAxisLabelHeight + yAxisLineWidth}, ${padding.top})`);
    })

    chart.select("g.figureTitle")
    .attr("transform", `translate(${width / 2 - titleWidth / 2},${padding.top + titleHeight + figureTitleMargin + yAxisHeight + secondTickLineMargin + secondTickMargin + minTickFontHeight})`)
    
}
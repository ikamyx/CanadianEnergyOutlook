"use strict";

function bar_grouped_stacked_percent(data, metadata, colors) {

    let chart = d3.select("body svg#single");
    let level_2_List = data.map(d => d[metadata.chart.level_2]), // sorting by aggregation level 2 in separate array
        data_ = [],
        colorList = [],
        // creating list for legend filtering
        attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2)),
        attrListLegened = attrList.map(x => x).reverse();
        level_2_List = level_2_List.filter(function(item, pos) {
            return level_2_List.indexOf(item) == pos;
        });

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
          mainTickMargin = 10,
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

    // percent calculation
    data.forEach(e => {
        attrList.forEach(d => {
            e[d] = e[d] / e.sum * 100;
        })
        e.sum = e.sum / e.sum * 100;
    })

    // data re arrange by aggregation level 2
    level_2_List.forEach(e => {
        data_.push(data.filter(g => g[metadata.chart.level_2] == e))
    });
    
    // map the colors
    attrList.forEach(d => {
        let result = colors.find(obj => {
            if((obj.label == d)) {
                return obj;
            }
          });
        colorList.push(result.color);
    });

    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(attrList)
    .range(colorList);

    // initialize
    chart.selectAll("g")
    .data(data_)
    .enter()
    .append("g")
    .each(function(_, i) {
        d3.select(this)
        .attr("data-content", level_2_List[i])
        .attr("class", "bar_groups");
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
    let yAxisHeight = height - padding.top - padding.bottom - figureTitleMargin -titleHeight - mainTickMargin - secondTickLineMargin - secondTickMargin - minTickFontHeight * 2;
    let scaleY = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.sum) + 0])
    .range([yAxisHeight, 0]);

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

    
    //scale for X
    let xAxisWidth = width - padding.left - padding.right - legendMargin - legendWidth - yAxisWidth - yAxisLabelMargin - yAxisLabelHeight - yAxisLineWidth;
    let scaleX = d3.scaleLinear()
    .domain([0, xAxisWidth])
    .range([0, xAxisWidth]);

    // add the x axis
    chart.append("g")
    .attr("transform", `translate(${padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidth}, ${padding.top + yAxisHeight})`)
    .attr("class", "x_axis")
    .call(d3.axisBottom(scaleX).ticks(0));

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

    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });

    //drawing bars
    chart.selectAll("g.bar_groups")
    .each(function(d, i) {
        d3.select(this)
        .selectAll("g")
        .data(data_[i])
        .enter()
        .append("g")
        .each(function(d, j) {
            let y = 0;
            d3.select(this)
            .attr("data-content", d[metadata.chart.level_1])
            .attr("class", "bar")
            .attr("transform", `translate(${(barSpace + barWidth) * j}, 0)`);
            d3.select(this)
            .selectAll("rect")
            .data(attrList)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", cat => (scaleY(0) - (scaleY(0) - scaleY(d[cat]))))
            .attr("width", barWidth)
            .attr("height", cat => scaleY(0) - scaleY(d[cat]))
            .attr("fill", cat => scaleColor(cat))
            .attr("data-field", cat => cat)
            // adjusting bar positions
            .each(function(_, k) {
                y = y + (scaleY(0) - scaleY(d[attrList[k]]));
                d3.select(this)
                .attr("y", scaleY(0) - y + padding.top);
            });
        });  
    });


    
    let barGroupWidth = [];
    chart.selectAll("g.bar_groups")
    .each(function(_, i){
        barGroupWidth.push(d3.select(this).node().getBBox().width);
    });
    

    let barGroupPos = [];
    for (let i = 0; i < barGroupWidth.length; i++) barGroupPos[i] = 0;

    barGroupPos.forEach((d, i) => {
        for(let k=0; k<i; k++) {
            barGroupPos[i] = barGroupPos[i] + barGroupWidth[k];
        }
        barGroupPos[i] = barGroupPos[i] + i*groupSpace + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidth + yAxisLineWidth + preSpace;

    });

    // positiong the group
    chart.selectAll("g.bar_groups")
    .each(function(_, i) {
        d3.select(this)
        .attr("transform", `translate(${barGroupPos[i]}, 0)`)
    });
    


    // add ticks for x axis
    chart.selectAll("g.bar")
    .each(function(_, i){
        d3.select(this)
        .append("g")
        .attr("class", "tick_x")
        .append("text")
        .text(data[i][metadata.chart.level_1])
        .attr("y", yAxisHeight + padding.top + mainTickMargin + minTickFontHeight);
    });

    let tickWidth = [];
    chart.selectAll("g.tick_x text")
    .each(function(_, i){
        tickWidth.push(d3.select(this).node().getBBox().width);
    });

    chart.selectAll("g.tick_x text")
    .each(function(_, i) {
        d3.select(this)
        .attr("x", barWidth / 2 - tickWidth[i] / 2)
    });


    // level_2 filter
    chart.selectAll("g.bar_groups")
    .data(level_2_List)
    .each(function(d, i) {
        let g = d3.select(this)
        .append("g").attr("class", metadata.chart.level_2 + "_group");

        g.append("line")
        .attr("x1", secondTickLineExtra)
        .attr("x2", barGroupWidth[i] + secondTickLineExtra)
        .attr("y1", yAxisHeight + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight)
        .attr("y2", yAxisHeight + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7)
        // .attr("stroke-dasharray", "4, 4");

        g.append("line")
        .attr("x1", secondTickLineExtra)
        .attr("x2", secondTickLineExtra)
        .attr("y1", yAxisHeight + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight - 4)
        .attr("y2", yAxisHeight + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7);

        g.append("line")
        .attr("x1", barGroupWidth[i] + secondTickLineExtra)
        .attr("x2", barGroupWidth[i] + secondTickLineExtra)
        .attr("y1", yAxisHeight + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight)
        .attr("y2", yAxisHeight + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight - 4)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7);
        
        g.append("text")
        .text(d => d)
        .attr("y", yAxisHeight + padding.top + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2);

        let textWidth = g.select("text").node().getBBox().width;

        g.select("text")
        .attr("x", barGroupWidth[i] / 2 - textWidth / 2);
    })

    chart.select("g.figureTitle")
    .attr("transform", `translate(${width / 2 - titleWidth / 2},${padding.top + titleHeight + figureTitleMargin + yAxisHeight + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2})`)
    
}
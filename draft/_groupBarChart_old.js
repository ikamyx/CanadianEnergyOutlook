"use strict";

function groupBarChart(data, metadata, colors) {

    let chart = d3.select("body svg");
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
        // let attrListLegened = level_1_List.map(x => x);

    const width = 900, height = 600,
          padding = {
            top: 50,
            right: 15, // space between legend and chart 
            bottom: 150,
            left: 15, // y axis label to left
          },
          legendLineSpace = 20,
          legendColorBoxWidth = 15,
          legendBoxToText = 20,
          legendMargin = 15, // legend to right
          yAxisLabelMargin = 15, // y axis label to the y axis
          yAxisLineWidth = 1,
          mainTickMargin = 20,
          secondTickMargin = 40,
          secondTickLineMargin = 20,
          secondTickLineExtra = 0,
          titleMargin = 110;

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

    // colors conversion characters
    colors.filter(d => d.figure == metadata.chart.section).forEach(d => {
        d.label = d.label.replaceAll("_", ",");
    });
    
    // map the colors
    let result = colors.filter(obj => (obj.figure == metadata.chart.section))
    result.forEach(d => colorList.push(d.color));

    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(level_1_List)
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

    // legend
    chart.append("g")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("class", "legend")
    .selectAll("g")
    .data(level_1_List)
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
        .attr("y", 11)
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
    .attr("transform", `translate(${width - legendWidth - legendMargin}, ${padding.top})`);

    // scale for Y
    let scaleY = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.sum) + 0])
    .range([height - padding.top - padding.bottom, 0]);

    // add the y axis
    chart.append("g")
    .attr("class", "y_axis")
    .call(d3.axisLeft(scaleY));

    //yAxis Label
    chart.select("g.y_axis")
    .append("text")
    .text(metadata.chart.yLabel);

    let yAxisWidth = chart.select("g.y_axis").node().getBBox().width;
    let yAxisLabelHeight = chart.select("g.y_axis > text").node().getBBox().height;
    let yAxisLabelWidth = chart.select("g.y_axis > text").node().getBBox().width;

    chart.select("g.y_axis > text")
    .attr("transform", `translate(${-1 * (yAxisLabelMargin + yAxisWidth)}, ${(height - padding.top - padding.bottom) / 2 - yAxisLabelWidth / 2}) rotate(-90)`);

    
    chart.select("g.y_axis")
    .attr("transform", `translate(${padding.left + yAxisWidth + yAxisLabelMargin + yAxisLabelHeight}, ${padding.top})`);

    
    //scale for X
    let scaleX = d3.scaleLinear()
    .domain([0, width - padding.left - padding.right - legendWidth - legendMargin - yAxisWidth - yAxisLabelMargin - yAxisLabelHeight - yAxisLineWidth])
    .range([0, width - padding.left - padding.right - legendWidth - legendMargin - yAxisWidth - yAxisLabelMargin - yAxisLabelHeight - yAxisLineWidth]);

    // add the x axis
    chart.append("g")
    .attr("transform", `translate(${padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidth}, ${height - padding.bottom})`)
    .attr("class", "x_axis")
    .call(d3.axisBottom(scaleX).ticks(0));

    // bar optimization calculations
    const preSpacePercent = 0.02,
          barSpacePercent = 0.06,
          groupSpacePercent = 0.09,
          barWidthPercent = 0.81;

    let totalWidth = width - padding.left - padding.right - legendWidth - legendMargin - yAxisWidth - yAxisLabelMargin - yAxisLabelHeight - yAxisLineWidth,
        groupSpaceNumber = data_.length - 1,
        barSpaceNumber = 0,
        barNumber = data.length;
    let barSpace, groupSpace, preSpace, barWidth;

    data_.forEach(d => {
        barSpaceNumber = barSpaceNumber + (d.length - 1)
    });


    preSpace = (totalWidth * preSpacePercent);
    barSpace = barSpaceNumber ? (totalWidth * barSpacePercent) / barSpaceNumber : 0;
    groupSpace = groupSpaceNumber ? (totalWidth * groupSpacePercent) / groupSpaceNumber : 0;
    barWidth = (totalWidth * barWidthPercent) / barNumber;


        
    // add grid lines for y axis
    chart.append("g")			
    .attr("class", "grid")
    .attr("transform", `translate(${padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidth + yAxisLineWidth}, ${padding.top})`)
    .call(d3.axisLeft(scaleY)
        .tickSize(-width + padding.left + padding.right + legendWidth + legendMargin + yAxisWidth + yAxisLabelMargin + yAxisLabelHeight + yAxisLineWidth)
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
            .attr("data-content", d[metadata.chart.level_2])
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
            .attr("fill", scaleColor(d[metadata.chart.level_1]))
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
    // chart.selectAll("g.bar")
    // .each(function(_, i){
    //     d3.select(this)
    //     .append("g")
    //     .attr("class", "tick_x")
    //     .append("text")
    //     .text(data[i][metadata.chart.level_1])
    //     .attr("y", height - padding.bottom + mainTickMargin);
    // });

    // let tickWidth = [];
    // chart.selectAll("g.tick_x text")
    // .each(function(_, i){
    //     tickWidth.push(d3.select(this).node().getBBox().width);
    // });

    // chart.selectAll("g.tick_x text")
    // .each(function(_, i) {
    //     d3.select(this)
    //     .attr("x", barWidth / 2 - tickWidth[i] / 2)
    // });



    // level_2 filter
    chart.selectAll("g.bar_groups")
    .data(level_2_List)
    .each(function(d, i) {
        let g = d3.select(this)
        .append("g").attr("class", metadata.chart.level_2 + "_group");

        g.append("line")
        .attr("x1", secondTickLineExtra)
        .attr("x2", barGroupWidth[i] + secondTickLineExtra)
        .attr("y1", height - padding.bottom + secondTickLineMargin)
        .attr("y2", height - padding.bottom + secondTickLineMargin)
        .attr("stroke", "#999")
        .attr("stroke-width", 0.7)
        .attr("stroke-dasharray", "4, 4");

        g.append("text")
        .text(d => d)
        .attr("y", height - padding.bottom + secondTickMargin);

        let textWidth = g.select("text").node().getBBox().width;

        g.select("text")
        .attr("x", barGroupWidth[i] / 2 - textWidth / 2);
    })

    // chart Title
    chart.append("g")
    .attr("class", "title")
    .append("text")
    .text("fig " + metadata.chart.section + " - " + metadata.chart.title);
    let titleWidth = chart.select("g.title").node().getBBox().width;
    chart.select("g.title")
    .attr("transform", `translate(${padding.left + yAxisWidth + yAxisLabelMargin + yAxisLineWidth + yAxisLabelHeight + (width - padding.left - yAxisWidth - yAxisLabelMargin - yAxisLineWidth - yAxisLabelHeight - legendMargin - legendWidth - padding.right) / 2 - titleWidth / 2}, ${height - padding.bottom + titleMargin})`)

    // d3.select("body main > figure")
    // .append("figcaption").text("Fig 4.1 - Final energy consumption by source");
    
}
"use strict";

function bar_grouped_overlap(data, metadata, colors, settings, language, chartContainer) {
    // setting
    let setting = settings[metadata.chart.type];



    // consts
    const yAxisHeight = setting.dimension.height - (setting.padding.top + setting.padding.bottom + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.fontHeight),
        xAxisWidth = setting.dimension.width*(setting.distribution.plotRatio/100) - (setting.padding.left + setting.padding.legend + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth);



    // attributes
    let attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2) && (e != metadata.chart.level_3));
    let level_1 = data.map(d => d[metadata.chart.level_1]);
    let level_2 = data.map(d => d[metadata.chart.level_2]);
    let level_3 = data.map(d => d[metadata.chart.level_3]);
    level_1 = level_1.filter(function(item, pos) {
        return level_1.indexOf(item) == pos;
    });
    level_2 = level_2.filter(function(item, pos) {
        return level_2.indexOf(item) == pos;
    });
    level_3 = level_3.filter(function(item, pos) {
        return level_3.indexOf(item) == pos;
    });



    // data conversion and re arrange
    /* **************************************************** */
    dataCoversion(data, attrList);
    /* **************************************************** */



    // data re arrange by aggregation level 3
    let data_ = [];
    level_3.forEach(e => {
        data_.push(data.filter(g => g[metadata.chart.level_3] == e))
    });



    // map the colors
    /* **************************************************** */
    let color = mapColor(colors, level_1);
    let colorList = color.map(x => x.color);
    /* **************************************************** */



    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(level_1)
    .range(colorList);



    // scale for label
    let scaleLabel = d3.scaleOrdinal()
    .domain(level_1)
    .range(color.map(x => x[language]));



    // initialize
    /* **************************************************** */
    let chart = initChart(data_, setting, level_3, chartContainer);
    /* **************************************************** */


    
    // legend
    const maxLegend = setting.dimension.width*(setting.distribution.legendRatio/100) - (setting.padding.right + setting.legend.colorBoxWidth + setting.legend.boxToText);
    let attrListLegend = level_1.map(x => x).reverse();
    /* **************************************************** */
    legend(chart, maxLegend, attrListLegend, setting, scaleColor, scaleLabel);
    /* **************************************************** */
    chart.select("g.legend")
    .attr("transform", `translate(${setting.dimension.width*(setting.distribution.plotRatio/100)}, ${setting.padding.top})`);



    // scale for Y
    /* **************************************************** */
    let scaleY = scaleY_bar(data, yAxisHeight);
    /* **************************************************** */



    // y axis + label
    /* **************************************************** */
    yAxisInit_bar(chart, scaleY, metadata.chart.yLabel);
    /* **************************************************** */
    let yAxisLabelWidth = chart.select("g.y_axis > .text").node().getBBox().width;
    chart.select("g.y_axis > .text")
    .attr("transform", `translate(${-1 * (setting.yAxis.labelMargin + setting.yAxis.width)}, ${(yAxisHeight) / 2 + yAxisLabelWidth / 2}) rotate(-90)`);
    chart.select("g.y_axis")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight}, ${setting.padding.top})`);



    //scale for X
    let scaleX = d3.scaleLinear()
    .domain([0, xAxisWidth])
    .range([0, xAxisWidth]);



    // add the x axis
    chart.append("g")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width}, ${setting.padding.top + yAxisHeight})`)
    .attr("class", "x_axis")
    .call(d3.axisBottom(scaleX).ticks(0));



    // bar distribution calculations
    let distribution = {
        barSpace: null,
        groupSpace: null,
        barWidth: null,
        groupSpaceNumber: data_.length - 1,
        barSpaceNumber: 0,
        barNumber: data.length / 2,
        preSpace: xAxisWidth * (setting.distribution.preSpacePercent/100)
    }
    /* **************************************************** */
    distributionCalculation_bar(distribution, data_, xAxisWidth, setting);
    /* **************************************************** */


        
    // add grid lines for y axis
    /* **************************************************** */
    yAxisGrid_bar(chart, xAxisWidth, scaleY);
    /* **************************************************** */  
    chart.select("g.grid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width}, ${setting.padding.top})`);



    //drawing bars
    chart.selectAll("g.bar_groups")
    .each(function(d, i) {
        d3.select(this)
        .selectAll("g")
        .data(data_[i])
        .enter()
        .append("g")
        .each(function(d, j) {
            let k =  j % level_2.length;
            let y = 0;
            let yPositive = 0;
            let yNegative = 0;
            d3.select(this)
            .attr("data-content", d[metadata.chart.level_2])
            .attr("class", "bar")
            .attr("transform", `translate(${(distribution.barSpace + distribution.barWidth) * k}, 0)`);
            d3.select(this)
            .selectAll("rect")
            .data(attrList)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("width", distribution.barWidth)
            .attr("height", cat => Math.abs(scaleY(0) - scaleY(d[cat])))
            .attr("fill", cat => scaleColor(d[metadata.chart.level_1]))
            .attr("data-field", cat => cat)
            // adjusting bar positions
            .each(function(_, t) {
                if(d[attrList[t]] > 0) {
                    yPositive = yPositive + scaleY(0) - scaleY(d[attrList[t]]);
                    y = yPositive;
                }
                else {
                    yNegative = yNegative + scaleY(0) - scaleY(d[attrList[t]]);
                    y = yNegative;
                }
                
                d3.select(this)
                .attr("y",  () => {
                    if(d[attrList[t]] > 0) {
                        return scaleY(0) - y + setting.padding.top;
                    }
                    else {
                        return 2*scaleY(0) - y - scaleY(d[attrList[t]]) + setting.padding.top;
                    }
                });
            });
        });  
    });




    let barGroupWidth = [];
    let barGroupPos = data_.map(d => 0);
    /* **************************************************** */
    groupPosition_bar(chart, barGroupWidth, barGroupPos, setting, distribution, data_);
    /* **************************************************** */
    chart.selectAll("g.bar_groups")
    .each(function(_, i) {
        d3.select(this)
        .attr("transform", `translate(${barGroupPos[i]}, 0)`)
    });




    // add ticks level 1 for x axis
    /* **************************************************** */
    ticks_grouped_horizontal_bar(chart, level_3, metadata, yAxisHeight, setting, barGroupWidth);
    /* **************************************************** */
}
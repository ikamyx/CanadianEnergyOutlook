"use strict";

function bar_grouped_stacked_ticks_vertical(data, metadata, colors, settings, language) {

    // setting
    let setting = settings[metadata.chart.type];



    // consts
    const yAxisHeight = setting.dimension.height - setting.padding.top,
          xAxisWidth = setting.dimension.width*(setting.distribution.plotRatio/100) - (setting.padding.left + setting.padding.legend + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth);



    // attributes
    let attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2));
    let level_2 = data.map(d => d[metadata.chart.level_2]);
    level_2 = level_2.filter(function(item, pos) {
        return level_2.indexOf(item) == pos;
    });



    // data conversion and re arrange
    /* **************************************************** */
    dataCoversion(data, attrList);
    /* **************************************************** */



    // data re arrange by aggregation level 2
    let data_ = [];
    level_2.forEach(e => {
        data_.push(data.filter(g => g[metadata.chart.level_2] == e))
    });
    


    // map the colors
    /* **************************************************** */
    let color = mapColor(colors, attrList);
    let colorList = color.map(x => x.color);
    /* **************************************************** */
    


    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(attrList)
    .range(colorList);



    // scale for label
    let scaleLabel = d3.scaleOrdinal()
    .domain(attrList)
    .range(color.map(x => x[language]));



    // initialize
    /* **************************************************** */
    let chart = initChart(data_, setting, level_2);
    /* **************************************************** */



    // legend
    const maxLegend = setting.dimension.width*(setting.distribution.legendRatio/100) - (setting.padding.right + setting.legend.colorBoxWidth + setting.legend.boxToText);
    let attrListLegened = attrList.map(x => x).reverse();
    /* **************************************************** */
    legend(chart, maxLegend, attrListLegened, setting, scaleColor, scaleLabel);
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
        barNumber: data.length,
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
            let y = 0;
            let yPositive = 0;
            let yNegative = 0;
            d3.select(this)
            .attr("data-content", d[metadata.chart.level_1])
            .attr("class", "bar")
            .attr("transform", `translate(${(distribution.barSpace + distribution.barWidth) * j}, 0)`);
            d3.select(this)
            .selectAll("rect")
            .data(attrList)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("width", distribution.barWidth)
            .attr("height", cat => Math.abs(scaleY(0) - scaleY(d[cat])))
            .attr("fill", cat => scaleColor(cat))
            .attr("data-field", cat => cat)
            // adjusting bar positions
            .each(function(_, k) {
                if(d[attrList[k]] > 0) {
                    yPositive = yPositive + scaleY(0) - scaleY(d[attrList[k]]);
                    y = yPositive;
                }
                else {
                    yNegative = yNegative + scaleY(0) - scaleY(d[attrList[k]]);
                    y = yNegative;
                }
                
                d3.select(this)
                .attr("y",  () => {
                    if(d[attrList[k]] > 0) {
                        return scaleY(0) - y + setting.padding.top;
                    }
                    else {
                        return 2*scaleY(0) - y - scaleY(d[attrList[k]]) + setting.padding.top
                    }
                });
            });
        });  
    });



    // positiong the group
    let barGroupWidth = [];
    let barGroupPos = data_.map(d => 0);
    /* **************************************************** */
    groupPosition_bar(chart, barGroupWidth, barGroupPos, setting, distribution);
    /* **************************************************** */
    chart.selectAll("g.bar_groups")
    .each(function(_, i) {
        d3.select(this)
        .attr("transform", `translate(${barGroupPos[i]}, 0)`)
    });
    



    // add ticks for x axis
    let tickWidth = [];
    let tickHeight = [];
    /* **************************************************** */
    let maxTickWidth = ticks_vertical_bar(chart, data, metadata, yAxisHeight, setting, distribution, tickWidth, tickHeight);
    /* **************************************************** */
    chart.attr("viewBox", `0 0 ${setting.dimension.width} ${setting.dimension.height + setting.padding.bottom + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + maxTickWidth + setting.xTicks.fontHeight}`)
    



    // add ticks level 2 for x axis
    /* **************************************************** */
    ticks_2_horizontal_if_ticks_vertical_bar(chart, level_2, metadata, yAxisHeight, setting, barGroupWidth, maxTickWidth);
    /* **************************************************** */

}
"use strict";

function line(data, metadata, colors, settings, language) {

    // setting
    let setting = settings[metadata.chart.type];



    // consts
    const yAxisHeight = setting.dimension.height - (setting.padding.top + setting.padding.bottom + setting.xTicks.row1Margin + setting.xTicks.fontHeight),
          xAxisWidth = setting.dimension.width*(setting.distribution.plotRatio/100) - (setting.padding.left + setting.padding.legend + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth);



    // attributes
    let attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2));
    let level_1 = data.map(d => d[metadata.chart.level_1]);
    let level_2 = data.map(d => d[metadata.chart.level_2]);
    level_1 = level_1.filter(function(item, pos) {
        return level_1.indexOf(item) == pos;
    });
    level_2 = level_2.filter(function(item, pos) {
        return level_2.indexOf(item) == pos;
    });



    // data conversion and re arrange
    /* **************************************************** */
    dataCoversion_line(data, metadata, attrList, level_1);
    /* **************************************************** */



    // data re arrange by aggregation level 2
    let data_ = [];
    level_2.forEach(e => {
        data_.push(data.filter(g => g[metadata.chart.level_2] == e))
    });
    


    // map the colors
    /* **************************************************** */
    let color = mapColor(colors, level_2);
    let colorList = color.map(x => x.color);
    /* **************************************************** */

    

    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(level_2)
    .range(colorList);



    // scale for label
    let scaleLabel = d3.scaleOrdinal()
    .domain(level_2)
    .range(color.map(x => x[language]));



    // initialize
    /* **************************************************** */
    let chart = initChart(data_, setting, level_2);
    /* **************************************************** */



    // legend
    const maxLegend = setting.dimension.width*(setting.distribution.legendRatio/100) - (setting.padding.right + setting.legend.colorBoxWidth + setting.legend.boxToText);
    let attrListLegened = level_2.map(x => x);
    /* **************************************************** */
    legend_line(chart, maxLegend, attrListLegened, setting, scaleColor, scaleLabel);
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
    /* **************************************************** */
    let scaleX = scaleX_line(data, metadata, level_1, xAxisWidth);
    /* **************************************************** */



    // x axis
    chart.append("g")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width}, ${setting.padding.top + yAxisHeight})`)
    .attr("class", "x_axis")
    .call(d3.axisBottom(scaleX).ticks(0));



    let line = d3.line()
    .x(d => scaleX(d[metadata.chart.level_1])) // set the x values for the line generator
    .y(function(d) { return scaleY(d[attrList[0]]); }) // set the y values for the line generator 
    //.curve(d3.curveMonotoneX) // apply smoothing to the line

    
        
    // add grid lines for y axis
    /* **************************************************** */
    yAxisGrid_bar(chart, xAxisWidth, scaleY);
    /* **************************************************** */  
    chart.select("g.grid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width}, ${setting.padding.top})`);



    // add grid lines for x axis
    /* **************************************************** */
    xAxisGrid_line(chart, level_1, yAxisHeight, scaleX, setting);
    /* **************************************************** */
    chart.select("g.grid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width}, ${setting.padding.top + yAxisHeight})`);



    //drawing lines
    chart.selectAll("g.bar_groups")
    .each(function(d, i) {
        d3.select(this)
        .attr("class", "")
        .attr("class", "line")
        .append("path")
        .datum(data_[i])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", d => scaleColor(d[0][metadata.chart.level_2]))
        .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth}, ${setting.padding.top})`);
    })
}


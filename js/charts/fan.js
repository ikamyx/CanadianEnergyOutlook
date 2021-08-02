"use strict";

function fan(data, metadata, colors, settings, language) {

    // setting
    let setting = settings[metadata.chart.type];



    // consts
    const yAxisHeight = setting.dimension.height - (setting.padding.top + setting.padding.bottom + setting.xTicks.row1Margin + setting.xTicks.fontHeight),
          xAxisWidth = setting.dimension.width*(setting.distribution.plotRatio/100) - (setting.padding.left + setting.padding.legend + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth + setting.yTicks.rowMargin);



    // attributes
    let attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1));
    let attrListExclude = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.min) && (e != metadata.chart.max));
    let level_1 = data.map(d => d[metadata.chart.level_1]);
    level_1 = level_1.filter(function(item, pos) {
        return level_1.indexOf(item) == pos;
    });



    // data conversion and re arrange
    /* **************************************************** */
    dataCoversion_area(data, metadata, attrList, level_1);
    /* **************************************************** */
    


    // data re arrange by aggregation attrList
    let data_ = [];
    attrList.forEach(e => {
        data_.push(new Array());
    });
    data_.forEach((g, i) => {
        data.forEach(r => {
            g.push({
                [attrList[i]]: r[attrList[i]],
                [metadata.chart.level_1]: r[metadata.chart.level_1]

            })
        })
    })


    // data re arrange by aggregation attrListExclude
    let data_exclude = [];
    attrListExclude.forEach(e => {
        data_exclude.push(new Array());
    });
    data_exclude.forEach((g, i) => {
        data.forEach(r => {
            g.push({
                [attrListExclude[i]]: r[attrListExclude[i]],
                [metadata.chart.level_1]: r[metadata.chart.level_1]

            })
        })
    })


    // guide data
    let gData = [];
    let gData_guide = [metadata.chart.min, metadata.chart.max]
    gData_guide.forEach(e => {
        gData.push(new Array());
    });
    gData.forEach((g, i) => {
        data.forEach(r => {
            g.push({
                [gData_guide[i]]: r[gData_guide[i]],
                [metadata.chart.level_1]: r[metadata.chart.level_1]
            })
        })
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
    let data__ = data_.slice(0,data_.length - 1);
    let chart = initChart(data__, setting, attrList);
    /* **************************************************** */

    


    // legend
    const maxLegend = setting.dimension.width*(setting.distribution.legendRatio/100) - (setting.padding.right + setting.legend.colorBoxWidth + setting.legend.boxToText);
    let attrListLegend = attrListExclude.reverse();
    attrListLegend.push(...gData_guide);
    /* **************************************************** */
    legend(chart, maxLegend, attrListLegend, setting, scaleColor, scaleLabel);
    /* **************************************************** */
    chart.select("g.legend")
    .attr("transform", `translate(${setting.dimension.width*(setting.distribution.plotRatio/100)}, ${setting.padding.top})`);




    let stackedData = d3.stack().keys(attrList)(data);
    let	area = d3.area()
    .x(d => scaleX(d.data[metadata.chart.level_1]))
    .y0(d => scaleY(d[0]))
    .y1(d => scaleY(d[1]));

    let line = d3.line()
    .x(function(d) {
        return scaleX(d[metadata.chart.level_1]);
    }) // set the x values for the line generator
    .y(function(d) {
        return scaleY(d[Object.keys(d)[0]]);
    }) // set the y values for the line generator 
    //.curve(d3.curveMonotoneX) // apply smoothing to the line





    // scale for Y
    /* **************************************************** */
    let scaleY = scaleY_fan(stackedData, yAxisHeight);
    /* **************************************************** */



    // y axis + label
    /* **************************************************** */
    yAxisInit_bar(chart, scaleY, metadata.chart.yLabel);
    /* **************************************************** */
    let yAxisLabelWidth = chart.select("g.y_axis > .text").node().getBBox().width;
    chart.select("g.y_axis > .text")
    .attr("transform", `translate(${-1 * (setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin)}, ${(yAxisHeight) / 2 + yAxisLabelWidth / 2}) rotate(-90)`);
    chart.select("g.y_axis")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yTicks.rowMargin}, ${setting.padding.top})`);



    //scale for X
    /* **************************************************** */
    let scaleX = scaleX_area(data, metadata, level_1, xAxisWidth);
    /* **************************************************** */



    // x axis
    chart.append("g")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin}, ${setting.padding.top + yAxisHeight})`)
    .attr("class", "x_axis")
    .call(d3.axisBottom(scaleX).ticks(0));


    
        
    // add grid lines for y axis
    /* **************************************************** */
    yAxisGrid_bar(chart, xAxisWidth, scaleY, setting);
    /* **************************************************** */  
    chart.select("g.yGrid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin}, ${setting.padding.top})`);



    // add grid lines for x axis
    /* **************************************************** */
    xAxisGrid_fan(chart, level_1, yAxisHeight, scaleX, setting);
    /* **************************************************** */
    chart.select("g.xGrid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin}, ${setting.padding.top + yAxisHeight})`);



    //drawing area
    chart.selectAll("g.bar_groups")
    .each(function(d, i) {
    d3.select(this)
    .attr("class", "")
    .attr("class", "area")
    .append("path")
    .datum(stackedData[i])
    .attr("d", d => area(d))
    .attr("fill", d => scaleColor(d.key))
    .attr("stroke", d => scaleColor(d.key))
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth + setting.yTicks.rowMargin}, ${setting.padding.top})`);
    });

    //draeing dashed line
    chart.append("g")
    .attr("class", "line")
    .attr("data-content", `${metadata.chart.min}`)
    .datum(gData[0])
    .append("path")
    .attr("class", "line min")
    .attr("d", line)
    .attr("stroke", "#000")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth + setting.yTicks.rowMargin}, ${setting.padding.top})`);

    //draeing dashed line
    chart.append("g")
    .attr("class", "line")
    .attr("data-content", `${metadata.chart.max}`)
    .datum(gData[1])
    .append("path")
    .attr("class", "max")
    .attr("d", line)
    .attr("stroke", "#000")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth + setting.yTicks.rowMargin}, ${setting.padding.top})`);



    chart.select(`g.legend_item[data-content=${metadata.chart.min}`)
    .append("line")
    .attr("x1", 0)
    .attr("x2", setting.legend.lineHeight)
    .attr("y1", 7)
    .attr("y2", 7)
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", 7)

    chart.select(`g.legend_item[data-content=${metadata.chart.min}`)
    .select("text")
    .attr("x", setting.legend.lineHeight + setting.legend.lineToText)


    chart.select(`g.legend_item[data-content=${metadata.chart.max}`)
    .append("line")
    .attr("x1", 0)
    .attr("x2", setting.legend.lineHeight)
    .attr("y1", 7)
    .attr("y2", 7)
    .attr("stroke", "black")
    .attr("stroke-width", 3)

    chart.select(`g.legend_item[data-content=${metadata.chart.max}`)
    .select("text")
    .attr("x", setting.legend.lineHeight + setting.legend.lineToText)

}
"use strict";

function line(data, metadata, colors, settings, language) {

    // setting
    let setting = settings[metadata.chart.type];



    // consts
    const yAxisHeight = setting.dimension.height - (setting.padding.top + setting.padding.bottom + setting.xTicks.row1Margin + setting.xTicks.fontHeight),
          xAxisWidth = setting.dimension.width*(setting.distribution.plotRatio/100) - (setting.padding.left + setting.padding.legend + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth + setting.yTicks.rowMargin);



    // attributes
    let attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2));
    let level_1 = data.map(d => d[metadata.chart.level_1]);
    level_1 = level_1.filter(function(item, pos) {
        return level_1.indexOf(item) == pos;
    });



    // data conversion and re arrange
    /* **************************************************** */
    dataCoversion_line(data, metadata, attrList, level_1);
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
    });

    

    // map the colors
    /* **************************************************** */
    let color = mapColor(colors, attrList);
    let colorList = color.map(x => x.color);
    /* **************************************************** */




    // map the xLabel and yLabel
    /* **************************************************** */
    let axis = [metadata.chart.xLabel, metadata.chart.yLabel];
    let axisList = mapColor(colors, axis);
    /* **************************************************** */

    

    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(attrList)
    .range(colorList);



    // scale for label
    let scaleLabel = d3.scaleOrdinal()
    .domain(attrList)
    .range(color.map(x => x[language]));




    // scale for axis
    let scaleAxis = d3.scaleOrdinal()
    .domain(axis)
    .range(axisList.map(function(x,i) {
        if(x) {
            return x[language];
        } else {
            return axis[i];
        }
    }));



    // initialize
    /* **************************************************** */
    let chart = initChart(data_, setting, attrList);
    /* **************************************************** */



    // legend
    const maxLegend = setting.dimension.width*(setting.distribution.legendRatio/100) - (setting.padding.right + setting.legend.lineHeight + setting.legend.lineToText);
    let attrListLegend = attrList.map(x => x).reverse();
    /* **************************************************** */
    legend_line(chart, maxLegend, attrListLegend, setting, scaleColor, scaleLabel);
    /* **************************************************** */
    chart.select("g.legend")
    .attr("transform", `translate(${setting.dimension.width*(setting.distribution.plotRatio/100)}, ${setting.padding.top})`);



    // scale for Y
    /* **************************************************** */
    let scaleY = scaleY_bar(data, yAxisHeight);
    /* **************************************************** */



    // y axis + label
    /* **************************************************** */
    yAxisInit_bar(chart, scaleY, scaleAxis(metadata.chart.yLabel));
    /* **************************************************** */
    let yAxisLabelWidth = chart.select("g.y_axis > .text").node().getBBox().width;
    chart.select("g.y_axis > .text")
    .attr("transform", `translate(${-1 * (setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin)}, ${(yAxisHeight) / 2 + yAxisLabelWidth / 2}) rotate(-90)`);
    chart.select("g.y_axis")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yTicks.rowMargin}, ${setting.padding.top})`);



    //scale for X
    let scaleX = d3.scaleLinear()
    .domain([d3.min(level_1), d3.max(level_1)])
    .range([0, xAxisWidth]);




    // x axis
    chart.append("g")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin}, ${setting.padding.top + yAxisHeight})`)
    .attr("class", "x_axis")
    .call(d3.axisBottom(scaleX).ticks(0));



    let line = d3.line()
    .x(function(d) {
        return scaleX(d[metadata.chart.level_1]);
    }) // set the x values for the line generator
    .y(function(d) {
        return scaleY(d[Object.keys(d)[0]]);
    }) // set the y values for the line generator 
    //.curve(d3.curveMonotoneX) // apply smoothing to the line

    
        
    // add grid lines for y axis
    /* **************************************************** */
    yAxisGrid_bar(chart, xAxisWidth, scaleY, setting);
    /* **************************************************** */  
    chart.select("g.grid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin}, ${setting.padding.top})`);



    // add grid lines for x axis
    /* **************************************************** */
    xAxisGrid_line(chart, level_1, yAxisHeight, scaleX, setting);
    /* **************************************************** */
    chart.select("g.grid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yTicks.rowMargin}, ${setting.padding.top + yAxisHeight})`);



    // drawing lines
    chart.selectAll("g.bar_groups")
    .each(function(d, i) {
            d3.select(this)
            .datum(data_[i].filter(g => !g[attrList[i]].toString().includes("-")))
            .attr("class", "")
            .attr("class", "line")
            .append("path")
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", d => scaleColor(Object.keys(d)))
            .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth + setting.yTicks.rowMargin}, ${setting.padding.top})`);
    });


    // drawing dots
    chart.selectAll("g.line")
    .each(function(d, i) {
            d3.select(this)
            .selectAll("rect")
            .data(data_[i].filter(g => !g[attrList[i]].toString().includes("-")))
            .enter()
            .append("circle")
            .attr("r", 4)
            // .attr("width", 8)
            // .attr("height", 8)
            .attr("cx", d => scaleX(d[metadata.chart.level_1]))
            .attr("cy", d => scaleY(d[Object.keys(d)[0]]))
            .attr("fill", d => scaleColor(Object.keys(d)))
            .attr("transform", `translate(${setting.padding.left + setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth + setting.yTicks.rowMargin}, ${setting.padding.top})`);
    });
}


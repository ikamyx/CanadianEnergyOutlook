"use strict";

function bar_grouped_stacked_multi(data, metadata, colors, settings, language) {

    // setting
    let setting = settings[metadata.chart.type];



    // attributes
    let attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2) && (e != metadata.chart.level_3));
    let level_2 = data.map(d => d[metadata.chart.level_2]);
    let level_3 = data.map(d => d[metadata.chart.level_3]);
    level_2 = level_2.filter(function(item, pos) {
        return level_2.indexOf(item) == pos;
    });
    level_3 = level_3.filter(function(item, pos) {
        return level_3.indexOf(item) == pos;
    });



    // consts
    let lines = Math.floor(level_3.length / 2) + 1;
    let yAxisHeight = (setting.dimension.height - setting.padding.top - setting.padding.bottom - (lines - 1) * setting.padding.middleY - lines * (setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)) / lines;
    let xAxisWidth = (setting.dimension.width - 2 * (setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight + setting.yAxis.lineWidth) - setting.padding.left - setting.padding.middleX - setting.padding.right) / 2;



    // data conversion and re arrange
    /* **************************************************** */
    dataCoversion(data, attrList);
    /* **************************************************** */



    // data re arrange by aggregation level 2 & level 3
    let data_ = []
    level_3.forEach(e => {
        let data__ = [];
        level_2.forEach(d => {
            let temp = data.filter(g => (g[metadata.chart.level_3] == e)).filter(g => (g[metadata.chart.level_2] == d))
            if(temp.length != 0) {
                data__.push(temp);
            }
        })
        data_.push(data__);
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
    let chart = initChart_multi(data_, setting, level_2, level_3);
    /* **************************************************** */



    // legend
    const maxLegend = xAxisWidth;
    let attrListLegened = attrList.map(x => x).reverse();
    /* **************************************************** */
    legend(chart, maxLegend, attrListLegened, setting, scaleColor, scaleLabel);
    /* **************************************************** */
    chart.select("g.legend")
    .attr("transform", `translate(${setting.dimension.width - (data_.length % 2) * (xAxisWidth + setting.yAxis.width + setting.yAxis.labelHeight + setting.yAxis.labelMargin) - setting.padding.right}, ${setting.padding.top + setting.title.marginY + (lines - 1)*(yAxisHeight + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY + setting.padding.middleY)})`);



    // scale for Y
    /* **************************************************** */
    let scaleY = scaleY_bar_multi(data, metadata, level_3, yAxisHeight);
    /* **************************************************** */



    // y axis + label
    /* **************************************************** */
    yAxisInit_bar_multi(chart, scaleY, metadata.chart.yLabel);
    /* **************************************************** */
    let yAxisLabelWidth = chart.select("g.y_axis  > .text").node().getBBox().width;
    chart.selectAll("g.y_axis > .text")
    .each(function(d, i) {
        d3.select(this)
        .attr("transform", `translate(${-1 * (setting.yAxis.labelMargin + setting.yAxis.width)}, ${(yAxisHeight) / 2 + yAxisLabelWidth / 2}) rotate(-90)`);
    });
    chart.selectAll("g.y_axis")
    .each(function(d,i) {
        let j = Math.floor(i / 2) + 1;
        let k = (i % 2) + 1;
        d3.select(this)
        .attr("transform", `translate(${setting.padding.left + k * (setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight) + (k - 1) * (xAxisWidth + setting.padding.middleX)}, ${setting.padding.top + setting.title.fontHeight + setting.title.marginY + (j - 1) * (yAxisHeight + setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)})`);
    });



    //scale for X
    let scaleX = d3.scaleLinear()
    .domain([0, xAxisWidth])
    .range([0, xAxisWidth]);



    // add the x axis
    chart.selectAll("g.plot_groups")
    .each(function(d,i){
        let j = Math.floor(i / 2) + 1;
        let k = (i % 2) + 1;
        d3.select(this)
        .append("g")
        .attr("class", "x_axis")
        .attr("transform", `translate(${setting.padding.left + k * (setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight) + (k - 1) * (xAxisWidth + setting.padding.middleX)}, ${setting.padding.top + setting.title.fontHeight + setting.title.marginY + yAxisHeight + (j - 1) * (yAxisHeight + setting.padding.middleY + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)})`)
        .call(d3.axisBottom(scaleX).ticks(0));
    }); 



    // bar distribution calculations
    let distribution = data_.map(d => ({
        barSpace: null,
        groupSpace: null,
        barWidth: null,
        groupSpaceNumber: d.length - 1,
        barSpaceNumber: 0,
        barNumber: d.flat().length,
        preSpace: xAxisWidth * (setting.distribution.preSpacePercent/100)
    }));
    /* **************************************************** */
    distributionCalculation_bar_multi(distribution, data_, xAxisWidth, setting);
    /* **************************************************** */
    


    // add grid lines for y axis
    /* **************************************************** */
    yAxisGrid_bar_multi(chart, xAxisWidth, scaleY);
    /* **************************************************** */
    chart.selectAll("g.plot_groups")
    .each(function(d,i){
        let j = Math.floor(i / 2) + 1;
        let k = (i % 2) + 1;
        d3.select(this).select("g.grid")
        .attr("transform", `translate(${setting.padding.left + k * (setting.yAxis.width + setting.yAxis.labelMargin + setting.yAxis.labelHeight) + (k - 1) * (xAxisWidth + setting.padding.middleX)}, ${setting.padding.top + setting.title.fontHeight + setting.title.marginY + (j - 1) * (setting.padding.middleY + yAxisHeight + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)})`);
    });



    // drawing bars
    chart.selectAll("g.plot_groups")
    .each(function(d_, t){
        d3.select(this)
        .selectAll("g.bar_groups")
        .each(function(d, i) {
            d3.select(this)
            .selectAll("g")
            .data(data_[t][i])
            .enter()
            .append("g")
            .each(function(d, j) {
                let y = 0;
                let yPositive = 0;
                let yNegative = 0;
                let m = (t % 2);
                let n = Math.floor(t / 2);
                d3.select(this)
                .attr("data-content", d[metadata.chart.level_1])
                .attr("class", "bar")
                .attr("transform", `translate(${(distribution[t].barSpace + distribution[t].barWidth) * j + m * (xAxisWidth + setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width + setting.yAxis.lineWidth)}, ${setting.title.fontHeight + setting.title.marginY + n * (setting.padding.middleY + yAxisHeight + setting.xTicks.row1Margin + setting.xTicks.lineSeparatorMargin + setting.xTicks.row2Margin + setting.xTicks.fontHeight * 2 + setting.title.fontHeight + setting.title.marginY)})`);
                d3.select(this)
                .selectAll("rect")
                .data(attrList)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("width", distribution[t].barWidth)
                .attr("height", cat => Math.abs(scaleY[t](0) - scaleY[t](d[cat])))
                .attr("fill", cat => scaleColor(cat))
                .attr("data-field", cat => cat)
            // adjusting bar positions
                .each(function(_, k) {
                    if(d[attrList[k]] > 0) {
                        yPositive = yPositive + (scaleY[t](0) - scaleY[t](d[attrList[k]]));
                        y = yPositive;
                    } else {
                        yNegative = yNegative + (scaleY[t](0) - scaleY[t](d[attrList[k]]));
                        y = yNegative;
                    }
                    
                    d3.select(this)
                    .attr("y", () => {
                        if(d[attrList[k]] > 0) {
                            return scaleY[t](0) - y + setting.padding.top;
                        } else {
                            return 2*scaleY[t](0) - y - scaleY[t](d[attrList[k]]) + setting.padding.top;
                        }
                    });
                });
            });
        });
    });



    // positiong the group
    let barGroupWidth = data_.map(d => new Array());
    let barGroupPos = data_.map(d => d.map(g => 0));
    /* **************************************************** */
    groupPosition_bar_multi(chart, barGroupWidth, barGroupPos, setting, distribution);
    /* **************************************************** */
    chart.selectAll("g.plot_groups")
    .each(function(_, i) {
        d3.select(this)
        .selectAll("g.bar_groups")
        .each(function(d,j) {
            d3.select(this)
            .attr("transform", `translate(${barGroupPos[i][j]},0)`);
        });
    });



    // add ticks for x axis
    /* **************************************************** */
    ticks_horizontal_bar_multi(chart, data, data_, metadata, yAxisHeight, setting, distribution);
    /* **************************************************** */



    // add ticks level 2 for x axis
    /* **************************************************** */
    ticks_2_horizontal_if_ticks_horizontal_bar_multi(chart, level_2, metadata, yAxisHeight, xAxisWidth, setting, barGroupWidth);
    /* **************************************************** */



    // add plot title
    /* **************************************************** */
    plotTitle_multi(chart, setting, yAxisHeight, xAxisWidth, level_3);
    /* **************************************************** */
}
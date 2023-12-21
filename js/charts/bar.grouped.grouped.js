"use strict";

function bar_grouped_grouped(data, metadata, colors, settings, language, chartContainer) {

    // setting
    let setting = settings[metadata.chart.type];



    // consts
    const yAxisHeight = setting.dimension.height - (setting.padding.top + setting.padding.bottom + setting.xTicks.row1Margin + setting.xTicks.row2Margin + setting.xTicks.line1SeparatorMargin + setting.xTicks.line2SeparatorMargin + setting.xTicks.fontHeight * 2),
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
    let color = mapColor(colors, level_1);
    let colorList = color.map(x => x.color);
    /* **************************************************** */

    

    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(level_1)
    .range(colorList);



    // scale for label
    let scaleLabel = d3.scaleOrdinal()
    .domain(attrList)
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
        innerGroupSpace: null,
        outerGroupSpace: null,
        barWidth: null,
        innerGroupSpaceNumber: 0,
        outerGroupSpaceNumber: data_.length - 1,
        barSpaceNumber: 0,
        barNumber: data.length,
        preSpace: xAxisWidth * (setting.distribution.preSpacePercent/100)
    }
    /* **************************************************** */
    distributionCalculation_bar_grouped(distribution, data_, xAxisWidth, setting);
    /* **************************************************** */

    
        
    // add grid lines for y axis
    /* **************************************************** */
    yAxisGrid_bar(chart, xAxisWidth, scaleY);
    /* **************************************************** */  
    chart.select("g.grid")
    .attr("transform", `translate(${setting.padding.left + setting.yAxis.labelHeight + setting.yAxis.labelMargin + setting.yAxis.width}, ${setting.padding.top})`);


    
    //drawing bars
    chart.selectAll("g.bar_groups")
    .each(function(d__, t) {
        d3.select(this)
        .selectAll("g")
        .data(data_[t])
        .enter()
        .append("g")
        .each(function(d_, i) {
            d3.select(this)
            .attr("data-content", level_2[i])
            .attr("class", "bar")
            .selectAll("rect")
            .data(data_[t][i])
            .enter()
            .append("rect")
            .each(function(d, j) {
                let y = 0;
                let yPositive = 0;
                let yNegative = 0;
                d3.select(this)
                .attr("transform", `translate(${(distribution.barSpace + distribution.barWidth) * j}, 0)`)
                .data(attrList)
                .attr("data-content", level_1[j])
                .attr("x", 0)
                .attr("width", distribution.barWidth)
                .attr("height", cat => scaleY(0) - scaleY(d[cat]))
                .attr("fill", cat => scaleColor(d[metadata.chart.level_1]))
                .attr("data-field", cat => cat[attrList])
                // adjusting bar positions
                .each(function(_,k) {
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
                            return 2*scaleY(0) - y - scaleY(d[attrList[k]]) + setting.padding.top;
                        }
                    });
                })
            });
        });
    }); 
    
    


    let barInnerGroupWidth = [];
    let barOuterGroupWidth = [];
    let barGroupPos = data_.map(d => 0);
    /* **************************************************** */
    groupPosition_bar_grouped(chart, barInnerGroupWidth, barOuterGroupWidth, barGroupPos, setting, distribution);
    /* **************************************************** */
    chart.selectAll("g.bar_groups")
    .each(function(_, i) {
        d3.select(this)
        .attr("transform", `translate(${barGroupPos[i]}, 0)`)
    });
    



    // add ticks level 1 for x axis
    /* **************************************************** */
    ticks_grouped_grouped_horizontal_bar(chart, level_2, metadata, yAxisHeight, setting, barInnerGroupWidth);
    /* **************************************************** */




    // add ticks level 2 for x axis
    /* **************************************************** */
    ticks_2_grouped_grouped_horizontal_bar(chart, level_3, metadata, yAxisHeight, setting, barOuterGroupWidth);
    /* **************************************************** */
    
}
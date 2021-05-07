"use strict";

function multiGroupStackedBarChartDoubleComparison(data, data2, metadata, colors) {
    
    let chart = d3.select("body svg#multi");
    let level_2_List = data.map(d => d[metadata.chart.level_2]), // sorting by aggregation level 2 in separate array
        level_3_List = data.map(d => d[metadata.chart.level_3]), // sorting by aggregation level 3 in separate array
        data_ = [],
        colorList = [],
        // creating list for legend filtering
        attrList = Object.keys(data[0]).filter(e => (e != metadata.chart.level_1) && (e != metadata.chart.level_2) && (e != metadata.chart.level_3)),
        attrListLegened = attrList.map(x => x).reverse();
        level_2_List = level_2_List.filter(function(item, pos) {
            return level_2_List.indexOf(item) == pos;
        });
        level_3_List = level_3_List.filter(function(item, pos) {
            return level_3_List.indexOf(item) == pos;
        });

    const width = 1800, height = 1200,
          padding = {
            top: 30,
            right: 30, // space between legend and chart 
            bottom: 30,
            left: 30, // y axis label to left
            middleX: 50,
            middleY: 65
          },
          legendLineSpace = 20,
          legendColorBoxWidth = 15,
          legendBoxToText = 20,
          yAxisLabelMargin = 20, // y axis label to the y axis
          yAxisLineWidth = 1,
          mainTickMargin = 10,
          secondTickLineMargin = 10,
          secondTickMargin = 10,
          minTickFontHeight = 10, // fixed
          secondTickLineExtra = 0,
          chartTitleFontHeight = 20, // fixed
          chartTitleMarginX = 20,
          chartTitleMarginY = 10,
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

    // data re arrange by aggregation level 2 & level 3
    level_3_List.forEach(e => {
        let data__ = [];
        level_2_List.forEach(d => {
            let temp = data.filter(g => (g[metadata.chart.level_3] == e)).filter(g => (g[metadata.chart.level_2] == d))
            if(temp.length != 0) {
                data__.push(temp);
            }
        })
        data_.push(data__);
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
        .attr("data-content", level_3_List[i])
        .attr("class", "chart_groups")
        .selectAll("g")
        .data(data_[i])
        .enter()
        .append("g")
        .each(function(__, j) {
            d3.select(this)
            .attr("data-content", level_2_List[j])
            .attr("class", "bar_groups");
        });
    });

    // chart Title
    chart.append("g")
    .attr("class", "figureTitle")
    .append("text")
    .text("fig " + metadata.chart.section + " - " + metadata.chart.title);
    let titleWidth = chart.select("g.figureTitle").node().getBBox().width;
    let titleHeight = chart.select("g.figureTitle").node().getBBox().height;


    // scale for Y
    let scaleY = [];
    let yAxisHeight;
    level_3_List.forEach((d,i) => {
        let _data = data.filter(g => g[metadata.chart.level_3] == d);
        let j = Math.floor(level_3_List.length / 2) + 1;
        if(yAxisHeight == undefined) yAxisHeight = (height - padding.top - padding.bottom - titleHeight - figureTitleMargin - (j - 1) * (padding.middleY) - j * (mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)) / j;
        scaleY.push(d3.scaleLinear()
        .domain([0, d3.max(_data, d_ => d_.sum) + 0])
        .range([yAxisHeight, 0]));
    });
    

    // add the y axis
    chart.selectAll("g.chart_groups")
    .each(function(d,i){
            d3.select(this)
            .append("g")
            .attr("class", "y_axis")
            .append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(scaleY[i]));
    });

    //yAxis Label
    chart.selectAll("g.y_axis")
    .each(function(d,i) {
        d3.select(this)
        .append("g")
        .attr("class", "text")
        .append("text")
        .text(metadata.chart.yLabel);
    });


    let yAxisWidth = [];
    chart.selectAll("g.y_axis > .axis")
    .each(function(d,i) {
        yAxisWidth.push(d3.select(this).node().getBBox().width);
    });
    let yAxisWidthMax = Math.max(...yAxisWidth);
    let yAxisLabelHeight = chart.select("g.y_axis > .text").node().getBBox().height;
    let yAxisLabelWidth = chart.select("g.y_axis  > .text").node().getBBox().width;

    chart.selectAll("g.y_axis > .text")
    .each(function(d, i) {
        d3.select(this)
        .attr("transform", `translate(${-1 * (yAxisLabelMargin + yAxisWidth[i])}, ${(yAxisHeight) / 2 + yAxisLabelWidth / 2}) rotate(-90)`);
    });

    //scale for X
    let xAxisWidth = (width - 2 * (yAxisWidthMax + yAxisLabelMargin + yAxisLabelHeight + yAxisLineWidth) - padding.left - padding.middleX - padding.right) / 2;
    let scaleX = d3.scaleLinear()
    .domain([0, xAxisWidth])
    .range([0, xAxisWidth]);

    chart.selectAll("g.y_axis")
    .each(function(d,i) {
        let j = Math.floor(i / 2) + 1;
        let k = (i % 2) + 1;
        d3.select(this)
        .attr("transform", `translate(${padding.left + k * (yAxisWidthMax + yAxisLabelMargin + yAxisLabelHeight) + (k - 1) * (xAxisWidth + padding.middleX)}, ${padding.top + chartTitleFontHeight + chartTitleMarginY + (j - 1) * (yAxisHeight + padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)})`);
    });

    // add the x axis
    chart.selectAll("g.chart_groups")
    .each(function(d,i){
        let j = Math.floor(i / 2) + 1;
        let k = (i % 2) + 1;
        d3.select(this)
        .append("g")
        .attr("class", "x_axis")
        .attr("transform", `translate(${padding.left + k * (yAxisWidthMax + yAxisLabelMargin + yAxisLabelHeight) + (k - 1) * (xAxisWidth + padding.middleX)}, ${padding.top + chartTitleFontHeight + chartTitleMarginY + yAxisHeight + (j - 1) * (yAxisHeight + padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)})`)
        .call(d3.axisBottom(scaleX).ticks(0));
    });

    // bar optimization calculations
    const preSpacePercent = 0.02,
          barSpacePercent = 0.06,
          groupSpacePercent = 0.09,
          barWidthPercent = 0.81;

    let groupSpaceNumber = [],
        barSpaceNumber = [],
        barNumber = [],
        barSpace = [],
        groupSpace = [],
        preSpace = xAxisWidth * preSpacePercent,
        barWidth = [];

        level_3_List.forEach((d,i) => {
            groupSpaceNumber.push(data_[i].length - 1);
            barSpaceNumber.push(0);
            barNumber.push(data.filter(g => g[metadata.chart.level_3] == d).length);
        });
        

        data_.forEach((d,i) => {
            d.forEach(g => {
                barSpaceNumber[i] = barSpaceNumber[i] + (g.length - 1);
            });
        });
        
        level_3_List.forEach((d,i) => {
            barSpace.push(barSpaceNumber[i] ? (xAxisWidth * barSpacePercent) / barSpaceNumber[i] : 0);
            groupSpace.push(groupSpaceNumber[i] ? (xAxisWidth * groupSpacePercent) / groupSpaceNumber[i] : 0);
            barWidth.push((xAxisWidth * barWidthPercent) / barNumber[i]);
        });
        
    // add grid lines for y axis
    chart.selectAll("g.chart_groups")
    .each(function(d,i){
        let j = Math.floor(i / 2) + 1;
        let k = (i % 2) + 1;
        d3.select(this)
        .append("g")
        .lower()
        .attr("class", "grid")
        .attr("transform", `translate(${padding.left + k * (yAxisWidthMax + yAxisLabelMargin + yAxisLabelHeight) + (k - 1) * (xAxisWidth + padding.middleX)}, ${padding.top + chartTitleFontHeight + chartTitleMarginY + (j - 1) * (padding.middleY + yAxisHeight + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)})`)
        .call(d3.axisLeft(scaleY[i])
            .tickSize(-xAxisWidth)
            .tickFormat("")
        );
    });

    chart.selectAll("g.grid line")
    .each(function() {
        d3.select(this)
        .attr("stroke-dasharray", "3, 3");
    });


    // drawing bars
    chart.selectAll("g.chart_groups")
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
                let m = (t % 2);
                let n = Math.floor(t / 2);
                d3.select(this)
                .attr("data-content", d[metadata.chart.level_1])
                .attr("class", "bar")
                .attr("transform", `translate(${(barSpace[t] + barWidth[t]) * j + m * (xAxisWidth + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisWidthMax + yAxisLineWidth)}, ${chartTitleFontHeight + chartTitleMarginY + n * (padding.middleY + yAxisHeight + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)})`);
                d3.select(this)
                .selectAll("rect")
                .data(attrList)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", cat => (scaleY[t](0) - (scaleY[t](0) - scaleY[t](d[cat]))))
                .attr("width", barWidth[t])
                .attr("height", cat => scaleY[t](0) - scaleY[t](d[cat]))
                .attr("fill", cat => scaleColor(cat))
                .attr("data-field", cat => cat)
            // adjusting bar positions
                .each(function(_, k) {
                    y = y + (scaleY[t](0) - scaleY[t](d[attrList[k]]));
                    d3.select(this)
                    .attr("y", scaleY[t](0) - y + padding.top);
                });
            });
        });
    });


    
    let barGroupWidth = [];
    data_.forEach(g => barGroupWidth.push(new Array()));
    
    chart.selectAll("g.chart_groups")
    .each(function(_, i) {
        d3.select(this)
        .selectAll("g.bar_groups")
        .each(function(d, j) {
            barGroupWidth[i].push(d3.select(this).node().getBBox().width);
        });
    });
    

    let barGroupPos = [];
    data_.forEach(g => barGroupPos.push(new Array()));
    data_.forEach((g,i) => {
        g.forEach(d => {
            barGroupPos[i].push(0);
        });
    });
    

    
    barGroupPos.forEach((d,j) => {
        let m =  (j % 2) + 1;
        d.forEach((d_,i) => {
            for(let k=0; k<i; k++) {
                barGroupPos[j][i] = barGroupPos[j][i] + barGroupWidth[j][k];
            };
            barGroupPos[j][i] = barGroupPos[j][i] + i*groupSpace[j] + yAxisLabelHeight + yAxisLabelMargin + yAxisWidthMax + yAxisLineWidth + preSpace + padding.left + (m - 1) * (padding.middleX - padding.left)  ;
        });
    });

    // positiong the group
    chart.selectAll("g.chart_groups")
    .each(function(_, i) {
        d3.select(this)
        .selectAll("g.bar_groups")
        .each(function(d,j) {
            d3.select(this)
            .attr("transform", `translate(${barGroupPos[i][j]},0)`);
        });
    });
    
    // add ticks for x axis
    chart.selectAll("g.chart_groups")
    .each(function(_,i) {
        let __ = d3.select(this).attr("data-content");
        d3.select(this)
        .selectAll("g.bar_groups")
        .each(function(_d,j) {
            let ___ = d3.select(this).attr("data-content"); 
            d3.select(this)
            .selectAll("g.bar")
            .each(function(d,k) {
                d3.select(this)
                .append("g")
                .attr("class","tick_x")
                .append("text")
                .text(data.filter(h => h[metadata.chart.level_3] == __).filter(m => m[metadata.chart.level_2] == ___)[k][metadata.chart.level_1])
                .attr("y", yAxisHeight + padding.top + mainTickMargin + minTickFontHeight);
            });
        });
    });

    let tickWidth = [];
    chart.selectAll("g.chart_groups")
    .each(function(_,i) {
        tickWidth.push(new Array());
    });
    chart.selectAll("g.chart_groups")
    .each(function(_, i){
        d3.select(this)
        .selectAll("g.tick_x text")
        .each(function(d,j){
            tickWidth[i].push(d3.select(this).node().getBBox().width);
        });
    });

    chart.selectAll("g.chart_groups")
    .each(function(_,i) {
        d3.select(this)
        .selectAll("g.tick_x text")
        .each(function(d,j) {
            d3.select(this)
            .attr("x", barWidth[i] / 2 - tickWidth[i][j] / 2)
        });
    });

    // level_2 filter
    chart.selectAll("g.chart_groups")
    .each(function(_,j){
        let m =  (j % 2);
        d3.select(this)
        .selectAll("g.bar_groups")
        .data(level_2_List)
        .each(function(d, i) {
            let m = (j % 2);
            let n = Math.floor(j / 2);
            let g = d3.select(this)
            .append("g").attr("class", metadata.chart.level_2 + "_group");
            g.append("line")
            .attr("x1", secondTickLineExtra + m*(xAxisWidth + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisLineWidth + yAxisWidthMax))
            .attr("x2", barGroupWidth[j][i] + secondTickLineExtra + m*(xAxisWidth + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisLineWidth + yAxisWidthMax))
            .attr("y1", yAxisHeight*(n+1) + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight + chartTitleFontHeight + chartTitleMarginY)
            .attr("y2", yAxisHeight*(n+1) + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight + chartTitleFontHeight + chartTitleMarginY)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7)
            // .attr("stroke-dasharray", "4, 4");

            g.append("line")
            .attr("x1", secondTickLineExtra + m*(xAxisWidth + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisLineWidth + yAxisWidthMax))
            .attr("x2", secondTickLineExtra + m*(xAxisWidth + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisLineWidth + yAxisWidthMax))
            .attr("y1", yAxisHeight*(n+1) + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight + chartTitleFontHeight + chartTitleMarginY - 4)
            .attr("y2", yAxisHeight*(n+1) + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight + chartTitleFontHeight + chartTitleMarginY)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7);

            g.append("line")
            .attr("x1", barGroupWidth[j][i] + secondTickLineExtra + m*(xAxisWidth + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisLineWidth + yAxisWidthMax))
            .attr("x2", barGroupWidth[j][i] + secondTickLineExtra + m*(xAxisWidth + padding.left + yAxisLabelHeight + yAxisLabelMargin + yAxisLineWidth + yAxisWidthMax))
            .attr("y1", yAxisHeight*(n+1) + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight + chartTitleFontHeight + chartTitleMarginY)
            .attr("y2", yAxisHeight*(n+1) + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n + padding.top + mainTickMargin + secondTickLineMargin + minTickFontHeight + chartTitleFontHeight + chartTitleMarginY - 4)
            .attr("stroke", "#999")
            .attr("stroke-width", 0.7);

            g.append("text")
            .text(d => d);
            let textWidth = g.select("text").node().getBBox().width;
            g.select("text")
            .attr("x", barGroupWidth[j][i] / 2 - textWidth / 2 + m*(padding.left + xAxisWidth + yAxisLabelHeight + yAxisLabelMargin + yAxisLineWidth + yAxisWidthMax))
            .attr("y", yAxisHeight*(n+1) + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n + padding.top + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)
        });
    });

    // chart group title
    chart.selectAll("g.chart_groups")
    .data(level_3_List)
    .each(function(_,j) {
        let m = (j % 2);
        let n = Math.floor(j / 2);
        d3.select(this)
        .append("g")
        .attr("class", "title")
        .append("text")
        .text((d => d))
        .attr("x", padding.left + yAxisWidthMax + yAxisLineWidth + yAxisLabelMargin + yAxisLabelHeight + chartTitleMarginX + m*(xAxisWidth + padding.middleX + yAxisWidthMax + yAxisLineWidth + yAxisLabelMargin + yAxisLabelHeight))
        .attr("y", padding.top + chartTitleFontHeight + yAxisHeight*n + (padding.middleY + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY)*n)
    });

    chart.select("g.figureTitle")
    .attr("transform", `translate(${width / 2 - titleWidth / 2},${padding.top + titleHeight + figureTitleMargin + (Math.floor(data_.length / 2) + 1)*(yAxisHeight + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY) + (Math.floor(data_.length / 2))*(padding.middleY)})`)

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
    
    chart.select("g.legend")
    .attr("transform", `translate(${width - (data_.length % 2) * (xAxisWidth + yAxisWidthMax + yAxisLabelHeight + yAxisLabelMargin) - padding.right}, ${padding.top + titleHeight + chartTitleMarginY + (Math.floor(data_.length / 2))*(yAxisHeight + mainTickMargin + secondTickLineMargin + secondTickMargin + minTickFontHeight * 2 + chartTitleFontHeight + chartTitleMarginY + padding.middleY)})`);
};
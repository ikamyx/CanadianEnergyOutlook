"use strict";

function legend(chart, maxLegend, data, setting, scaleColor, scaleLabel) {
    let linesCount = 0;
    chart.append("g")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("class", "legend")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return `translate(${0}, ${i * setting.legend.lineSpace})`
    })
    .attr("class", "legened_item")
    .attr("data-content", d => scaleLabel(d))
    .each(function(d, i) {

        d3.select(this)
        .attr("transform", function(d, j) {
            if (i == 0) {
                return `translate(${0}, ${linesCount * setting.legend.lineSpace})`
            }
            else {
                return `translate(${0}, ${(linesCount * setting.legend.lineSpace) + (i * setting.legend.lineBetweenSpace)})`
            }
        });
        
        d3.select(this)
        .append("text")
        .text(scaleLabel(d))
        .attr("x", setting.legend.boxToText + setting.legend.colorBoxWidth)
        .attr("y", 12);
        
        d3.select(this)
        .append("rect")
        .attr("fill", d => scaleColor(d))
        .attr("width", setting.legend.colorBoxWidth)
        .attr("height", setting.legend.colorBoxWidth)
        .attr("x", 0)
        .attr("y", 0);
        
        let lineWidth = d3.select(this).select("text").node().getBBox().width;
        if (lineWidth > maxLegend) {
        let words = scaleLabel(d).split(" ");
        d3.select(this).select("text").text("");
        let newLine = true;
        let j = -1;
        do {
            if(newLine) {
                j++;
                linesCount ++;
                d3.select(this).select("text")
                .append("tspan")
                .text(words[0])
                .attr("x", setting.legend.boxToText + setting.legend.colorBoxWidth)
                .attr("y", 12 + (j * (setting.legend.lineSpace)));
                words.shift();
                let $tspan = d3.select(this).select("tspan:last-child"),
                    tspanWidth = $tspan.node().getBBox().width;
                if(tspanWidth < maxLegend) {
                    newLine = false;
                }

            } else {
                let $tspan = d3.select(this).select("tspan:last-child"),
                    text = $tspan.text();
                $tspan.text(`${text} ${words[0]}`);
                let wordTemp = words[0];
                words.shift();
                let tspanWidth = $tspan.node().getBBox().width;
                if(tspanWidth > maxLegend) {
                    $tspan.text(`${text}`);
                    newLine = true;
                    words.splice(0, 0, wordTemp);
                }
            } 
        }
        while (words.length);

        } else {
            linesCount++;
        }
    });
}
"use strict";

function settingLoader(chartType) {
    switch(chartType) {
        case "multi group stacked bar chart":
            return {
                width: 1800, 
                height: 3600,
                padding: {
                  top: 30,
                  right: 30, // space between legend and chart 
                  bottom: 30,
                  left: 30, // y axis label to left
                  middleX: 50,
                  middleY: 65
                },
                legendLineSpace: 20,
                legendColorBoxWidth: 15,
                legendBoxToText: 20,
                yAxisLabelMargin: 20, // y axis label to the y axis
                yAxisLineWidth: 1,
                mainTickMargin: 10,
                secondTickLineMargin: 10,
                secondTickMargin: 10,
                minTickFontHeigh: 10, // fixed
                secondTickLineExtra: 0,
                chartTitleFontHeight: 20, // fixed
                chartTitleMarginX: 20,
                chartTitleMarginY: 10,
                figureTitleMargin: 30
            }
            break;
    }
}
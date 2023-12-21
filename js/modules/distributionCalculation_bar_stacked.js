"use strict";

function distributionCalculation_bar_stacked(distribution, xAxisWidth, setting) {
    distribution.barSpace = distribution.barSpaceNumber ? (xAxisWidth * (setting.distribution.barSpacePercent/100)) / distribution.barSpaceNumber : 0;
    distribution.barWidth = (xAxisWidth * (setting.distribution.barWidthPercent/100)) / distribution.barNumber;
}
    
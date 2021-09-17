"use strict";

function distributionCalculation_bar(distribution, data_, xAxisWidth, setting) {
    data_.forEach(d => {
        distribution.barSpaceNumber = distribution.barSpaceNumber + (d.length - 1)
    });
    distribution.barSpace = distribution.barSpaceNumber ? (xAxisWidth * (setting.distribution.barSpacePercent/100)) / distribution.barSpaceNumber : 0;
    distribution.groupSpace = distribution.groupSpaceNumber ? (xAxisWidth * (setting.distribution.groupSpacePercent/100)) / distribution.groupSpaceNumber : 0;
    distribution.barWidth = (xAxisWidth * (setting.distribution.barWidthPercent/100)) / distribution.barNumber;
}
    
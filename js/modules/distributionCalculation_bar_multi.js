"use strict";

function distributionCalculation_bar_multi(distribution, data_, xAxisWidth, setting) {
    data_.forEach((d,i) => {
        d.forEach(g => {
            distribution[i].barSpaceNumber = distribution[i].barSpaceNumber + (g.length - 1);
        });
        distribution[i].barSpace = distribution[i].barSpaceNumber ? (xAxisWidth * (setting.distribution.barSpacePercent/100)) / distribution[i].barSpaceNumber : 0;
        distribution[i].groupSpace = distribution[i].groupSpaceNumber ? (xAxisWidth * (setting.distribution.groupSpacePercent/100)) / distribution[i].groupSpaceNumber : 0;
        distribution[i].barWidth = (xAxisWidth * (setting.distribution.barWidthPercent/100)) / distribution[i].barNumber;
    });
}
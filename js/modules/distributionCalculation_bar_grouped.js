"use strict";

function distributionCalculation_bar_grouped(distribution, data_, xAxisWidth, setting) {
    data_.forEach(d => {
        distribution.innerGroupSpaceNumber = distribution.innerGroupSpaceNumber + (d.length - 1)
        d.forEach(d_ => {
            distribution.barSpaceNumber = distribution.barSpaceNumber + (d_.length - 1)
        });
    });
    distribution.barSpaceNumber = distribution.barSpaceNumber + distribution.innerGroupSpaceNumber + distribution.outerGroupSpaceNumber;
    distribution.barSpace = distribution.barSpaceNumber ? (xAxisWidth * (setting.distribution.barSpacePercent/100)) / distribution.barSpaceNumber : 0;
    distribution.innerGroupSpace = distribution.innerGroupSpaceNumber ? (xAxisWidth * (setting.distribution.innerGroupSpacePercent/100)) / distribution.innerGroupSpaceNumber : 0;
    distribution.outerGroupSpace = distribution.outerGroupSpaceNumber ? (xAxisWidth * (setting.distribution.outerGroupSpacePercent/100)) / distribution.outerGroupSpaceNumber : 0;
    distribution.barWidth = (xAxisWidth * (setting.distribution.barWidthPercent/100)) / distribution.barNumber;
}
    
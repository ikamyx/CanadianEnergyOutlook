"use strict";

function bar_grouped_stacked_double_joiner(content, colors, settings, language, chartContainer) {
    content.forEach((element, i) => {
        bar_grouped_stacked_double(element.data, element.metadata, colors, settings, language,  i+1, chartContainer)
    });
}
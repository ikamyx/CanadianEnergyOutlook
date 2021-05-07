"use strict";

function parseColors(data) {
        // colors conversion characters
        data.forEach(g => {
            g.label = g.label.replaceAll("_", ",");
            g.label = g.label.replaceAll("%", " ");
        })

        return data;
}
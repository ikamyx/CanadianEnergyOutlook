"use strict";

function parseColors(data) {
        // colors conversion characters
        data.forEach(g => {
            g.variable = g.variable.replaceAll("_", ",");
            g["english"] = g["english"].replaceAll("_", ",");
            g["french"] = g["french"].replaceAll("_", ",");
        })

        return data;
}
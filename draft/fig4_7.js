
"use strict";

function fig4_7(data) {

    let chart = d3.select("body main > figure").append("svg").attr("width", 900)
    .attr("viewBox", "0 0 900 275");
    
    let filterBy_Year = [],
        data_ = [],
        // creating list for legend filtering
        attrList_Cat = Object.keys(data[0]).filter(e => (e !="Year") && (e != "Scenario"));

    // time format
    let parseTime = d3.timeParse("%Y");

    // data conversion
    data.forEach(e => {
        let sum = 0;
        e.Year = +e.Year;
        e["Electric systems"] = +e["Electric systems"];
        e["Heatpumps - Electricity"] = +e["Heatpumps - Electricity"];
        e["Heatpumps - Natural gas"] = +e["Heatpumps - Natural gas"];
        e["Central heat systems"] = +e["Central heat systems"];
        e["Heating oil systems"] = +e["Heating oil systems"];
        e["Natural gas systems"] = +e["Natural gas systems"];
        e["LPG systems"] = +e["LPG systems"];
        e["Geothermal systems"] = +e["Geothermal systems"];
        e["Solar systems"] = +e["Solar systems"];
        // adding sum of each row of data
        attrList_Cat.forEach(d => {
            sum = e[d] + sum;
            e.sum = sum;
        });
    });

    // filtering sorting factor in separate array
    data.forEach(element => {
        if(filterBy_Year.indexOf(element.Year) == -1) {
            filterBy_Year.push(element.Year);
        }
    });
    // data re arrange by sorting factor
    filterBy_Year.forEach(e => {
        data_.push(data.filter(g => g.Year == e))
    })

    // scale for Y
    let scaleY = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.sum)+30])
    .range([275, 0]);

    // scale for X
    // let scaleX = d3.scaleOrdinal()
    // .domain(data.map(d=>d.Co))
    // .range([0,1,2,3,4,5,6,7,8,9,10]);

    // console.log(scaleX.range())

    // scale for color
    let scaleColor = d3.scaleOrdinal()
    .domain(attrList_Cat)
    .range(["#F72585", "#7209B7", "#3A0CA3", "#4361EE", "#4CC9F0", "#594F3B", "#776258"]);
    
    // initialize
    chart.selectAll("g")
    .data(data_)
    .enter()
    .append("g")
    .each(function(_, i) {
        d3.select(this)
        .attr("data-content", filterBy_Year[i])
        .attr("transform", `translate(${0}, 0)`);
    });

    // drawing bars
    chart.selectAll("g")
    .each(function(d, i) {
        d3.select(this)
        .selectAll("g")
        .data(data_[i])
        .enter()
        .append("g")
        .each(function(d, j) {
            let y = 0;
            d3.select(this)
            .attr("data-content", d.Scenario);
            d3.select(this)
            .selectAll("rect")
            .data(attrList_Cat)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", cat => (scaleY(0) - (scaleY(0) - scaleY(d[cat]))))
            .attr("width", "68")
            .attr("height", cat => scaleY(0) - scaleY(d[cat]))
            .attr("fill", cat => scaleColor(cat))
            .attr("data-field", cat => cat)
            // adjusting bar positions
            .each(function(_, k) {
                y = y + (scaleY(0) - scaleY(d[attrList_Cat[k]]));
                d3.select(this)
                .attr("y", scaleY(0) - y);
            });
        });  
    });

    // positiong the group
    chart.selectAll("g g")
    .each(function(_, t) {
        d3.select(this)
        .attr("transform", _ => `translate(${t * 73}, 0)`);
    });

    // add the y axis
    chart.append("g")
    .attr("transform", `translate(100, 0)`)
    .attr("class", "y_axis")
    .call(d3.axisLeft(scaleY)
    .tickValues([0, 100, 200, 300, 400, 500, 600]));

    // add the x axis
    // chart.append("g")
    // .attr("transform", "translate(100, 100)")
    // .attr("class", "x_axis")
    // .call(d3.axisBottom(scaleX));

    d3.select("body main > figure")
    .append("figcaption").text("Fig 4.7 - Space heating systems in the commercial sector");
}
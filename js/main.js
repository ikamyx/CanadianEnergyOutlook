"use strict";

(function (d3) {
    /***** settings *****/
    let figures, currentFocus, colors, settings_default, setting_3Bar, setting_3BarOffset, setting_5BarOffset, setting_singleBar,
    settings_singleBarOffset, settings_2Bar, settings_map, language;
    const fileInput = document.querySelector("input[type='file']");

    /***** DOM *****/
    let $buttonPNG = document.querySelector("button#png"),
    $select = document.querySelector("select"),
    $buttonClear = document.querySelector("button#clear"),
    $figure = document.querySelector("figure"),
    $showTitle = document.querySelector("#showtitle"),
    $showSource = document.querySelector("#showsource"),
    $showFiligrane = document.querySelector("#showfiligrane");

    /***** bind events *****/
    // fileInput.addEventListener("input",  async () => {
    //     autoComplete(fileInput, figures);
    // });
    fileInput.addEventListener("keydown", async function(e) {
        keydown(e);
    });
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
    $buttonPNG.addEventListener("click", saveToPng);
    $buttonClear.addEventListener("click", clearChart);

    fileInput.addEventListener("change", async (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles.length > 0) {
            // Process each selected file
            for (const file of selectedFiles) {
                // Handle each file as needed
                fileLoad(file);
            }
        }
    });
    // $file.addEventListener("click", fileReset);

    /***** loading data *****/
    var promises = [];
    promises.push(d3.csv("./data/figures.csv")); 
    promises.push(d3.csv("./data/colors.csv"));
    promises.push(d3.csv("./data/setting_default.csv")); // 2
    promises.push(d3.csv("./data/setting_3Bar.csv")); // 3 
    promises.push(d3.csv("./data/setting_3BarOffset.csv")); // 4
    promises.push(d3.csv("./data/setting_5BarOffset.csv")); // 5
    promises.push(d3.csv("./data/setting_singleBar.csv")); // 6
    promises.push(d3.csv("./data/setting_singleBarOffset.csv")); // 7
    promises.push(d3.csv("./data/setting_2Bar.csv")); // 7
    promises.push(d3.csv("./data/settings_map.csv")); // 8

    Promise.all(promises)
    
        /***** after load *****/
        .then(function (data) {

            /***** data preprocessing *****/
            figures = data[0].map(d => d.figure + " - " + d.type);
            colors = parseColors(data[1]);
            settings_default = parserSettings(data[2]);
            setting_3Bar = parserSettings(data[3]);
            setting_3BarOffset = parserSettings(data[4]);
            setting_5BarOffset = parserSettings(data[5]);
            setting_singleBar = parserSettings(data[6]);
            settings_singleBarOffset = parserSettings(data[7]);
            settings_2Bar = parserSettings(data[8]);
            settings_map = data[9];
            
            /***** initiate *****/
        });

    /***** functions *****/

    function keydown(e) {
        let parent = document.getElementById("autocomplete-list");
        if(parent) parent = parent.getElementsByTagName("div");
        if(e.key == 40) {
            currentFocus++;
            addActive(parent);
        } else if(e.key == 38) {
            currentFocus--;
            addActive(parent);
        } else if(e.key == 13) {
            e.preventDefault();
            if(currentFocus > -1) {
                if(parent) parent[currentFocus].click();
            };
        };
    };

    function addActive(el) {
        if(!el) return false;
        removeActive(el);
        if(currentFocus >= el.length) currentFocus = 0;
        if(currentFocus < 0) currentFocus = (el.length - 1);
        el[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(el) {
        for(let i = 0; i < el.length; i++) {
            el[i].classList.remove("autocomplete-active");
        };
    }

    function closeAllLists(el) {
        let items = document.getElementsByClassName("autocomplete-items");
        for(let i=0;i<items.length;i++) {
            if(el != items[i] && el != fileInput) {
                items[i].parentNode.removeChild(items[i]);
            };
        };
    }


    function saveToPng() {
        console.log(fileInput);
        if(language == "label_en"){language = "en"}
        else if(language == "label_fr"){language = "fr"}
        let containers = document.querySelectorAll(".chart-container");
        containers.forEach((container) => {
            // Get file name based on the container class
            let fileName = container.classList[1].replace(".txt", "")
            let svg = container.querySelector("svg");
            let top = 0;
            let height = svg.viewBox.baseVal.height;
            if (svg.querySelector(".figureTitle")) { // Rectifier la hauteur si titre présent
                top = -100/2;
                height += 100; 
            }
            else if (!svg.querySelector(".figureTitle")&& svg.querySelector(".source")) { // Rectifier la hauteur si source présente (mais pas titre)
                top = -20/2;
                height += 20; 
            }
            saveSvgAsPng(svg, `${language}_${fileName}.png`, {scale: 8, backgroundColor: "#FFFFFF", height: height, top:top})
        })
    }

    function clearChart() {
        // Find all chart containers and remove them
        const chartContainers = document.querySelectorAll(".chart-container");
        chartContainers.forEach((container) => {
            // Remove the chart container, including its contained SVG
            container.remove();
        });
    
        // Clear the input value and reset other elements as needed
        fileInput.value = "";
        // Add any additional reset logic here
        console.clear()
    }
    
    function fileLoad(file) {
        // Check if the selected file is of the desired type (e.g., text)
        const textType = /text.*/;
        if (file.type.match(textType)) {
            const reader = new FileReader();
    
            reader.onload = function (e) {
                const content = reader.result;
    
                // Parse and display the chart for this file
                const parsedData = parser(content);
                
                // Choose the appropriate setting file for the settings
                let generationType = settings_map.filter(e => e.no == file.name.replace(".txt", ""));
                let settings = [];
                switch (generationType.generation) {
                    case undefined:
                        settings = settings_default;
                        break;
                    case "3Bar":
                        settings = settings_3Bar;
                        break;
                    case "3BarOffset":
                        settings = settings_3BarOffset;
                        break;
                    case "5BarOffset":
                        settings = settings_5BarOffset;
                        break;
                    case "singleBarOffset":
                        settings = settings_singleBarOffset;
                        break;
                    case "singleBar":
                        settings = settings_singleBar;
                        break;
                    case "2Bar":
                        settings = settings_2Bar;
                        break;
                }
                
                // Create a new container for this chart (and add class of title)
                const chartContainer = document.createElement("div");
                chartContainer.classList.add("chart-container", file.name.replace(".txt", ""));
                $figure.appendChild(chartContainer);
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                chartContainer.appendChild(svg);

    
                // Draw the chart inside this container
                if($select.value == "english"){language = "label_en"}
                else if($select.value == "french"){language = "label_fr"}
                draw(parsedData, language, chartContainer, settings);
            };
    
            // Read the content of the selected file
            reader.readAsText(file);
        } else {
            // Handle the case where the file type is not supported
            console.log("File not supported: " + file.name);
        }
    }
    
    
    function draw(content, language, chartContainer, settings) {
        //clearChart();
        //console.clear();
        // Remove the hide class from the chart container's SVG
        chartContainer.querySelector("svg").classList.remove("hide");
        document.querySelector("svg").classList.remove("hide");
            let parsed = content;
            let chartTitle = parsed.metadata.chart.title;
            let chartSource = parsed.metadata.chart.source;
            switch(parsed.metadata.chart.type) {
                case "bar.grouped.stacked":
                    bar_grouped_stacked(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped.stacked.mosaic":
                    bar_grouped_stacked(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped.stacked.percent":
                    bar_grouped_stacked_percent(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped.stacked.multi":
                    bar_grouped_stacked_multi(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped.stacked.double":
                    bar_grouped_stacked_double_joiner(content, colors, settings, language, chartContainer);
                    break;
                case "bar.stacked":
                    bar_stacked(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.stacked.center":
                    bar_stacked_center(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped":
                    bar_grouped(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped.overlap":
                    bar_grouped_overlap(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped.horizontal":
                    bar_grouped_horizontal(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "bar.grouped.grouped":
                    bar_grouped_grouped(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break; 
                case "line":
                    line(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "area":
                    area(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "fan":
                    fan(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;
                case "fan.mosaic":
                fan(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                break;
                case "scatter":
                    scatter(parsed.data, parsed.metadata, colors, settings, language, chartContainer);
                    break;   
            }
            // ADD SVG container for source and title
            if ($showTitle.checked) {showTitle(chartContainer, chartTitle)}
            if ($showSource.checked) {showSource(chartContainer, chartSource)};
            if ($showFiligrane.checked) {showFiligrane(chartContainer)};
    }

    function showTitle(chartContainer, title) { // Ajoute le titre le padding nécessaire sur le graphique si la case est cochée
        const titlePad = 100;
        let svg = chartContainer.querySelector("svg");
        d3.select(chartContainer).select("svg")
        .attr("height", svg.viewBox.baseVal.height+titlePad);
        d3.select(svg)
        .append("g")
        .attr("class", "figureTitle")
        .append("text")
        .attr("x", svg.viewBox.baseVal.width/2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .text(title);
    }

    function showSource(chartContainer, source) { // Affiche la source et le padding nécessaire sur le graphique si la case est cochée
        const heightPadSource = 20;
        const titlePad = 100;
        const leftPadSource = 15;
        const svg = chartContainer.querySelector("svg");
        if (!$showTitle.checked) { // Padding différent si showTitle activé
            d3.select(chartContainer).select("svg")
            .attr("height", svg.viewBox.baseVal.height+heightPadSource);
            d3.select(svg)
            .append("g")
            .attr("class", "source")
            .append('text')
            .attr("text-anchor", "start")
            .attr("x", leftPadSource)
            .attr("y", svg.viewBox.baseVal.height+heightPadSource/3)
            .text("Source: " + source);
        } else {
            d3.select(svg)
            .append("g")
            .attr("class", "source")
            .append('text')
            .attr("text-anchor", "start")
            .attr("x", leftPadSource)
            .attr("y", svg.viewBox.baseVal.height+titlePad/2-heightPadSource/2)
            .text("Source: " + source);
        }
    }

    function showFiligrane(chartContainer) { // Ajoute un filigrane sur le graphique si la case est cochée
        const svg = chartContainer.querySelector("svg");
        d3.select(svg)
        .append("g")
        .attr("class", "filigrane")
        .append('text')
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 0)
        .text("Institut de l'énergie Trottier")
        .attr('transform', 'translate('+svg.viewBox.animVal.width/2+','+svg.viewBox.animVal.height/2+')rotate(-30)')
    }

})(d3);
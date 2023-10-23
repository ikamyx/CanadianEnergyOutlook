"use strict";

(function (d3) {
    /***** settings *****/
    let figures, currentFocus, colors, settings, language;
    const fileInput = document.querySelector("input[type='file']");

    /***** DOM *****/
    let $buttonPNG = document.querySelector("button#png"),
    $select = document.querySelector("select"),
    $buttonClear = document.querySelector("button#clear"),
    $figure = document.querySelector("figure");

    /***** bind events *****/
    // fileInput.addEventListener("input",  async () => {
    //     autoComplete(fileInput, figures);
    // });
    // fileInput.addEventListener("keydown", async function(e) {
    //     keydown(e);
    // });
    // document.addEventListener("click", function(e) {
    //     closeAllLists(e.target);
    // });
    // document.addEventListener("click", function(e) {
    //     closeAllLists(e.target);
    // });
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
    promises.push(d3.csv("./data/setting.csv"));
    Promise.all(promises)
    
        /***** after load *****/
        .then(function (data) {

            /***** data preprocessing *****/
            figures = data[0].map(d => d.figure + " - " + d.type);
            colors = parseColors(data[1]);
            settings = parserSettings(data[2]);
            
            /***** initiate *****/
            // autoComplete($input, figures);
        });

    /***** functions *****/
    // function autoComplete(input, data) {
    //     let list, el, i, val = input.value;
    //     closeAllLists();
    //     if (!val) {
    //         return false;
    //     }
    //     currentFocus = -1;
    //     list = document.createElement("DIV");
    //     list.setAttribute("id", `autocomplete-list`);
    //     list.setAttribute("class", "autocomplete-items");
    //     input.parentNode.append(list);

    //     for(let i=0; i<data.length; i++){
    //         if(data[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
    //             el = document.createElement("DIV");
    //             el.innerHTML = `<strong>${data[i].substr(0, val.length)}</strong>`;
    //             el.innerHTML += data[i].substr(val.length);
    //             el.innerHTML += `<input type="hidden" value="${data[i]}">`;
    //             el.addEventListener("click", function(e) {
    //                 input.value = this.getElementsByTagName("input")[0].value;
    //                 closeAllLists();
    //                 fileReset();
    //             });
    //             list.appendChild(el);
    //         };
    //     };
    // }



    // function keydown(e) {
    //     let parent = document.getElementById("autocomplete-list");
    //     if(parent) parent = parent.getElementsByTagName("div");
    //     if(e.key == 40) {
    //         currentFocus++;
    //         addActive(parent);
    //     } else if(e.key == 38) {
    //         currentFocus--;
    //         addActive(parent);
    //     } else if(e.key == 13) {
    //         e.preventDefault();
    //         if(currentFocus > -1) {
    //             if(parent) parent[currentFocus].click();
    //         };
    //     };
    // };



    // function addActive(el) {
    //     if(!el) return false;
    //     removeActive(el);
    //     if(currentFocus >= el.length) currentFocus = 0;
    //     if(currentFocus < 0) currentFocus = (el.length - 1);
    //     el[currentFocus].classList.add("autocomplete-active");
    // }



    // function removeActive(el) {
    //     for(let i = 0; i < el.length; i++) {
    //         el[i].classList.remove("autocomplete-active");
    //     };
    // }


    // function closeAllLists(el) {
    //     let items = document.getElementsByClassName("autocomplete-items");
    //     for(let i=0;i<items.length;i++) {
    //         if(el != items[i] && el != fileInput) {
    //             items[i].parentNode.removeChild(items[i]);
    //         };
    //     };
    // }


    function saveToPng() {
        console.log(fileInput);
        if(language == "label_en"){language = "en"}
        else if(language == "label_fr"){language = "fr"}
        let containers = document.querySelectorAll(".chart-container");
        containers.forEach((container) => {
            // Get file name based on the container class
            let fileName = container.classList[1].replace(".txt", "")
            let svg = container.querySelector("svg:not(.hide)");
            saveSvgAsPng(svg, `${language}_${fileName}.png`, {scale: 8, backgroundColor: "#FFFFFF"})
        })
    }

    // function saveToSvg() {
    //     if(language == "label_en"){language = "en"}
    //     else if(language == "label_fr"){language = "fr"}
    //     let svgs = document.querySelectorAll("svg");
    //     saveSvg(svgs);
    // }


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
    }

    // function resetChart() {
    //     document.querySelector("svg").innerHTML = "";
    //     document.querySelector("svg").classList.add("hide");
    //     fileInput.value = "";
    //     fileReset();
    //     if(document.querySelector("figcaption")) document.querySelector("figcaption").remove();
    // }

    
    function fileLoad(file) {
        // Check if the selected file is of the desired type (e.g., text)
        const textType = /text.*/;
        if (file.type.match(textType)) {
            const reader = new FileReader();
    
            reader.onload = function (e) {
                const content = reader.result;
    
                // Parse and display the chart for this file
                const parsedData = parser(content);
    
                // Create a new container for this chart (and add class of title)
                const chartContainer = document.createElement("div");
                chartContainer.classList.add("chart-container", file.name.replace(".txt", ""));
                $figure.appendChild(chartContainer);
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                chartContainer.appendChild(svg);

    
                // Draw the chart inside this container
                if($select.value == "english"){language = "label_en"}
                else if($select.value == "french"){language = "label_fr"}
                draw(parsedData, language, chartContainer);
            };
    
            // Read the content of the selected file
            reader.readAsText(file);
        } else {
            // Handle the case where the file type is not supported
            console.log("File not supported: " + file.name);
        }
    }
    
    
    // function fileReset() {
    //     fileInput.value = null;
    // }

    
    function draw(content, language, chartContainer) {
        //clearChart();
        //console.clear();
        // Remove the hide class from the chart container's SVG
        chartContainer.querySelector("svg").classList.remove("hide");
        document.querySelector("svg").classList.remove("hide");
            let parsed = content;
            let chartTitle = parsed.metadata.chart.title;
            chartTitle = chartTitle.substring(0, chartTitle.length - 4);
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
    }

})(d3);
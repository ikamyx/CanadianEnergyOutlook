"use strict";

(function (d3) {
    /***** settings *****/
    let figures, currentFocus, colors, fileData, className;

    /***** DOM *****/
    let $input = document.querySelector("input[type='text'"),
    $buttonShow = document.querySelector("button#show"),
    $buttonPrint = document.querySelector("button#print"),
    $buttonClear = document.querySelector("button#clear"),
    $figure = document.querySelector("figure"),
    $file = document.querySelector("input[type='file']");

    /***** bind events *****/
    $input.addEventListener("input",  async () => {
        autoComplete($input, figures);
    });
    $input.addEventListener("keydown", async function(e) {
        keydown(e);
    });
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
    $buttonShow.addEventListener("click", loadData);
    $buttonPrint.addEventListener("click", saveToPng);
    $buttonClear.addEventListener("click", clearChart);
    // $file.addEventListener("input", resetInput);
    $file.addEventListener("change", fileLoad);
    $file.addEventListener("click", fileReset);

    /***** loading data *****/
    var promises = [];
    promises.push(d3.csv("./data/figures.csv"));
    promises.push(d3.csv("./data/colors.csv"));
    Promise.all(promises)
    
        /***** after load *****/
        .then(function (data) {

            /***** data preprocessing *****/
            figures = data[0].map(d => d.figure);
            colors = parseColors(data[1]);

            /***** initiate *****/
            // autoComplete($input, figures);
        });

    /***** functions *****/
    function autoComplete(input, data) {
        let list, el, i, val = input.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        list = document.createElement("DIV");
        list.setAttribute("id", `autocomplete-list`);
        list.setAttribute("class", "autocomplete-items");
        input.parentNode.append(list);

        for(let i=0; i<data.length; i++){
            if(data[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                el = document.createElement("DIV");
                el.innerHTML = `<strong>${data[i].substr(0, val.length)}</strong>`;
                el.innerHTML += data[i].substr(val.length);
                el.innerHTML += `<input type="hidden" value="${data[i]}">`;
                el.addEventListener("click", function(e) {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    fileReset();
                });
                list.appendChild(el);
            };
        };
    }



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
            if(el != items[i] && el != $input) {
                items[i].parentNode.removeChild(items[i]);
            };
        };
    }

    function loadData() {
        let value = $input.value;
        if(figures.includes(value)) {
                     
            let textfile;
            if(window.XMLHttpRequest) {
                textfile = new XMLHttpRequest();
            }
            textfile.onreadystatechange = function() {
                if(textfile.readyState == 4 && textfile.status == 200) {
                    let content = textfile.responseText;
                    let parsed = parser(content);
                    $figure.classList = "";
                    $figure.classList.add(value);
                    draw(parsed);
                }
            }
            textfile.open("GET", `./data/${value}.txt`);
            textfile.send();
        } else if(fileData) {
            $figure.classList = "";
            $figure.classList.add(className);
            draw(fileData);
        }
    }

    function saveToPng() {
        let svg = document.querySelector("svg:not(.hide)");
        saveSvgAsPng(svg, `${$figure.classList}.png`, {scale: 2, backgroundColor: "#FFFFFF"});
    }

    function clearChart() {
        document.querySelector("svg#single").innerHTML = "";
        document.querySelector("svg#multi").innerHTML = "";
        $input.value = "";
        fileReset();
        if(document.querySelector("figcaption")) document.querySelector("figcaption").remove();
    }

    
    function fileLoad(e) {
        $input.value = "";
        fileData = e.target.files[0];
        className = fileData.name.substring(0, fileData.name.length - 4);
        let textType = /text.*/;
    
        if (fileData.type.match(textType)) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let content = reader.result;
                //Here the content has been read successfuly
                fileData = parser(content);
            }
            reader.readAsText(fileData);	
        } else {
        fileDisplayArea.innerText = "File not supported!"
        }
    }

    function fileReset() {
        $file.value = null;
    }

    function draw(parsed) {
        
        clearChart();
        // let setting = settingLoader(parsed.metadata.chart.type);
        switch(parsed.metadata.chart.type) {
            case "bar.grouped.stacked":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                groupStackedBarChart(parsed.data, parsed.metadata, colors);
                break;
            case "bar.grouped":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                groupBarChart(parsed.data, parsed.metadata, colors);
                break;
            case "bar.grouped.horizontal":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                groupBarChartHorizontal(parsed.data, parsed.metadata, colors);
                break;
            case "bar.grouped.overlap":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                groupBarChartOverlap(parsed.data, parsed.metadata, colors);
                break;
            case "bar.grouped.grouped":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                groupBarChart(parsed.data, parsed.metadata, colors);
                break;
            case "bar.grouped.stacked.multi":
                document.querySelector("svg#multi").classList.remove("hide");
                document.querySelector("svg#single").classList.add("hide");
                document.querySelector("svg#double").classList.add("hide");
                multiGroupStackedBarChart(parsed.data,parsed.metadata, colors);
                break;
            case "bar.grouped.stacked.double":
                document.querySelector("svg#double").classList.remove("hide");
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.add("hide");
                multiGroupStackedBarChartDoubleComparison(parsed.data, parsed.metadata, colors);
                break;
            case "bar.stacked":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                stackedBarChart(parsed.data, parsed.metadata, colors);
                break;
            case "bar.grouped.stacked.percent":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                groupStackedBarChartByPercent(parsed.data, parsed.metadata, colors);
                break;
            case "bar.stacked.narrow":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                stackedBarChartNarrow(parsed.data, parsed.metadata, colors);
                break;
            case "line":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                lineChart(parsed.data, parsed.metadata, colors);
                break;
            case "area":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                areaChart(parsed.data, parsed.metadata, colors);
                break;
            case "scatter":
                document.querySelector("svg#multi").classList.add("hide");
                document.querySelector("svg#single").classList.remove("hide");
                document.querySelector("svg#double").classList.add("hide");
                scatterPlot(parsed.data, parsed.metadata);
                break;
        }
    }
})(d3);
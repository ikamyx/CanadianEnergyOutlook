"use strict";

(function (d3) {
    /***** settings *****/
    let figures, currentFocus, colors, className, settings, language, files;
    let fileData = [];

    /***** DOM *****/
    let $input = document.querySelector("input[type='text']"),
    $select = document.querySelector("select"),
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
    $buttonShow.addEventListener("click", fileLoad);
    $buttonPrint.addEventListener("click", saveToPng);
    $buttonClear.addEventListener("click", resetChart);
    // $file.addEventListener("input", resetInput);
    $file.addEventListener("change", fileLoad);
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
        if($select.value == "english"){language = "label_en"}
        else if($select.value == "french"){language = "label_fr"}
        let firstSpace = value.indexOf(" ");
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
                    $figure.classList.add(value.substring(0, firstSpace));
                    draw(new Array(parsed), language);
                }
            }
            textfile.open("GET", `./data/${value.substring(0, firstSpace)}.txt`);
            textfile.send();
            
        } else if(fileData) {
            $figure.classList = "";
            $figure.classList.add(className);
            draw(fileData, language);
        }
    }


    function saveToPng() {
        if(language == "label_en"){language = "en"}
        else if(language == "label_fr"){language = "fr"}
        let svg = document.querySelector("svg:not(.hide)");
        saveSvgAsPng(svg, `${language}_${$figure.classList}.png`, {scale: 8, backgroundColor: "#FFFFFF"});
    }

    // function saveToSvg() {
    //     if(language == "label_en"){language = "en"}
    //     else if(language == "label_fr"){language = "fr"}
    //     let svgs = document.querySelectorAll("svg");
    //     saveSvg(svgs);
    // }


    function clearChart() {
        document.querySelector("svg").innerHTML = "";
        document.querySelector("svg").classList.add("hide");
        $input.value = "";
        // fileReset();
        if(document.querySelector("figcaption")) document.querySelector("figcaption").remove();
    }

    function resetChart() {
        document.querySelector("svg").innerHTML = "";
        document.querySelector("svg").classList.add("hide");
        $input.value = "";
        fileReset();
        if(document.querySelector("figcaption")) document.querySelector("figcaption").remove();
    }

    
    function fileLoad(e) {
        $input.value = "";
        let textType = /text.*/;
        fileData = [];
        if(e.target != $buttonShow) {
            files = e.target.files;
        }
        Array.from(files).forEach((element,i) => {
            fileData.push(element);
            className = fileData[i].name.substring(0, fileData[i].name.length - 4);
            if(fileData[i].type.match(textType)) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let content = reader.result;
                    // here the content has been read successfuly
                    fileData[i] = parser(content);
                    clearChart();
                    loadData();
                }
                reader.readAsText(fileData[i]);
            } else {
                fileDisplayArea.innerText = "File not supported!";
            }
        });
    }


    function fileReset() {
        $file.value = null;
    }


    function draw(content, language) {
        clearChart();
        console.clear();
        document.querySelector("svg").classList.remove("hide");
            let parsed = content[0];
            switch(parsed.metadata.chart.type) {
                case "bar.grouped.stacked":
                    bar_grouped_stacked(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.grouped.stacked.percent":
                    bar_grouped_stacked_percent(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.grouped.stacked.multi":
                    bar_grouped_stacked_multi(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.grouped.stacked.double":
                    bar_grouped_stacked_double_joiner(content, colors, settings, language);
                    break;
                case "bar.stacked":
                    bar_stacked(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.stacked.center":
                    bar_stacked_center(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.grouped":
                    bar_grouped(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.grouped.overlap":
                    bar_grouped_overlap(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.grouped.horizontal":
                    bar_grouped_horizontal(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "bar.grouped.grouped":
                    bar_grouped_grouped(parsed.data, parsed.metadata, colors, settings, language);
                    break; 
                case "line":
                    line(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "area":
                    area(parsed.data, parsed.metadata, colors, settings, language);
                    break;
                case "fan":
                    fan(parsed.data, parsed.metadata, colors, settings, language);
                    break; 
                case "scatter":
                    scatter(parsed.data, parsed.metadata, colors, settings, language);
                    break;   
            }
    }

    function showData() {
        // let content = textfile.responseText;
        // let parsed = parser(content);
        // draw(new Array(parsed), language);
        // loadData();
    }

    // function saveSvg(svgEl, name) {
    //     svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    //     var svgData = svgEl.outerHTML;
    //     var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    //     var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    //     var svgUrl = URL.createObjectURL(svgBlob);
    //     var downloadLink = document.createElement("a");
    //     downloadLink.href = svgUrl;
    //     downloadLink.download = name;
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    //     document.body.removeChild(downloadLink);
    // }
})(d3);
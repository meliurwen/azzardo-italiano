var event_json_loaded = new Event('json_loaded');

var data;

var a = document.getElementById("svg_azzardo");

// Adding this listener the svg will load asynchronously
a.addEventListener("load", function() {


    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "dataset/dati-azzardo.json", true);
    oReq.send();

    function reqListener(e) {
        data = JSON.parse(this.responseText);
        a.dispatchEvent(event_json_loaded);
    }


}, false);




a.addEventListener('json_loaded', function(e) {

    var min_max = get_min_max(data, "RACCOLTA_TOT_PROCAPITE_2016");

    var minimum = min_max["min"];
    var maximum = min_max["max"];

    //console.log(minimum + " AA " + maximum);

    // get the inner DOM of italia_regioni-province-comuni.svg
    var svgDoc = a.contentDocument;

    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        try {
            // get the inner element by id
            svgDoc.getElementById("g_reg" + data[key]["CODICE_ISTAT_REGIONE"] + "-pro" + data[key]["CODICE_ISTAT_PROVINCIA"] + "-com" + data[key]["CODICE_ISTAT_COMUNE"]).style.fill = getColorForPercentage(calc_percent(parseFloat(data[key]["RACCOLTA_TOT_PROCAPITE_2016"]), 0, 1500) / 100);
        } catch (err) {
            console.log("g_reg" + data[key]["CODICE_ISTAT_REGIONE"] + "-pro" + data[key]["CODICE_ISTAT_PROVINCIA"] + "-com" + data[key]["CODICE_ISTAT_COMUNE"]);
        }

    }


}, false);




var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

function getColorForPercentage(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
}




function get_min_max(json_data, tema) {


    var minimum;
    var maximum;

    var first_time_flag = true;

    var keys = Object.keys(json_data);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (first_time_flag) {
            maximum = parseFloat(json_data[key][tema]);
            minimum = parseFloat(json_data[key][tema]);
            first_time_flag = false;
        }


        if (parseFloat(json_data[key][tema]) > maximum) {
            maximum = parseFloat(json_data[key][tema]);
        }

        if (parseFloat(json_data[key][tema]) < minimum) {
            minimum = parseFloat(json_data[key][tema]);
        }



    }

    return {
        'min': minimum,
        'max': maximum
    };

}




function calc_percent(value, minimum, maximum) {
    return (value - minimum) * (100 / maximum);
}

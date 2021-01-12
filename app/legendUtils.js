define(["require", "exports", "esri/symbols/support/symbolUtils", "./config"], function (require, exports, symbolUtils, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rampContainer = document.getElementById("ramp-container");
    var upperLabel = document.getElementById("right-label");
    var lowerLabel = document.getElementById("left-label");
    var centerLabel = document.getElementById("center-label");
    var legendTitle = document.getElementById("legend-title");
    function createLegend(params) {
        var colors = params.colors, gradient = params.gradient, labels = params.labels, title = params.title;
        rampContainer.innerHTML = null;
        var rampElement = symbolUtils.renderColorRampPreviewHTML(colors, {
            align: "horizontal",
            gradient: gradient,
            width: 300,
            height: 15
        });
        rampContainer.appendChild(rampElement);
        if (labels) {
            lowerLabel.innerHTML = labels[0];
            centerLabel.innerHTML = labels.length === 3 ? labels[1] : null;
            upperLabel.innerHTML = labels.length === 3 ? labels[2] : labels[1];
        }
        if (title) {
            legendTitle.innerHTML = title;
        }
    }
    exports.createLegend = createLegend;
    var currentYear = document.getElementById("current-year");
    var demCandidate = document.getElementById("dem-candidate");
    var demVotes = document.getElementById("dem-votes");
    var repCandidate = document.getElementById("rep-candidate");
    var repVotes = document.getElementById("rep-votes");
    var demResults = document.getElementById("dem-results");
    var repResults = document.getElementById("rep-results");
    function updateResultsDisplay(year) {
        var result = config_1.results[year];
        currentYear.innerHTML = year.toString();
        var demWinner = result.democrat.electoralVotes > result.republican.electoralVotes;
        demCandidate.innerHTML = result.democrat.candidate;
        demVotes.innerHTML = result.democrat.electoralVotes;
        repCandidate.innerHTML = result.republican.candidate;
        repVotes.innerHTML = result.republican.electoralVotes;
        if (demWinner) {
            demResults.style.fontWeight = "bolder";
            repResults.style.fontWeight = null;
        }
        else {
            demResults.style.fontWeight = null;
            repResults.style.fontWeight = "bolder";
        }
    }
    exports.updateResultsDisplay = updateResultsDisplay;
});
//# sourceMappingURL=legendUtils.js.map
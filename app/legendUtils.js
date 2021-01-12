define(["require", "exports", "esri/symbols/support/symbolUtils"], function (require, exports, symbolUtils) {
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
});
//# sourceMappingURL=legendUtils.js.map
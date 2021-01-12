define(["require", "exports", "esri/symbols/support/symbolUtils"], function (require, exports, symbolUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rampContainer = document.getElementById("ramp-container");
    var upperLabel = document.getElementById("right-label");
    var lowerLabel = document.getElementById("left-label");
    function createLegend(params) {
        var colors = params.colors, gradient = params.gradient, labels = params.labels;
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
            upperLabel.innerHTML = labels[1];
        }
    }
    exports.createLegend = createLegend;
});
//# sourceMappingURL=legendUtils.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/Color", "esri/symbols/support/symbolUtils", "esri/symbols/support/cimSymbolUtils", "esri/widgets/Histogram", "esri/smartMapping/statistics/histogram", "esri/smartMapping/statistics/summaryStatistics", "./config"], function (require, exports, Color, symbolUtils, cimSymbolUtils, Histogram, histogram, summaryStatistics, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rampContainer = document.getElementById("ramp-container");
    var upperLabel = document.getElementById("right-label");
    var lowerLabel = document.getElementById("left-label");
    var centerLabel = document.getElementById("center-label");
    var legendTitle = document.getElementById("legend-title");
    var histogramContainer = document.getElementById("histogram");
    // {
    //   2004: {
    //     rep: {},
    //     dem: {},
    //     oth: {}
    //   }
    // }
    var histograms = {};
    var histogramChart;
    var histMin = -20;
    var histMax = 20;
    function createLegend(params) {
        var layer = params.layer, view = params.view, year = params.year, party = params.party;
        rampContainer.innerHTML = null;
        var colors, gradient, labels, title, colorVariable;
        var rampHeight = 15;
        var renderer = layer.renderer;
        if (renderer.visualVariables.some(function (vv) { return vv.type === "color"; })) {
            colorVariable = renderer.visualVariables.find(function (vv) { return vv.type === "color"; });
            colors = colorVariable.stops.map(function (stop) { return stop.color; });
            labels = colorVariable.stops
                .filter(function (stop) { return stop.label; })
                .map(function (stop) { return stop.label; });
            title = colorVariable.valueExpressionTitle || colorVariable.legendOptions && colorVariable.legendOptions.title;
            gradient = true;
            rampHeight = 3;
            updateHistogram({
                layer: layer,
                view: view,
                colorVariable: colorVariable,
                year: year,
                party: party
            });
            histogramContainer.style.display = "block";
        }
        if (renderer.type === "unique-value") {
            colors = renderer.uniqueValueInfos
                // .filter( info => info.value !== "other")
                .map(function (info) {
                var symbol = info.symbol;
                if (symbol.type === "cim") {
                    return cimSymbolUtils.getCIMSymbolColor(symbol);
                }
                return symbol.color;
            });
            labels = renderer.uniqueValueInfos
                // .filter( info => info.value !== "other" && info.label)
                .map(function (info) { return info.label; });
            title = renderer.valueExpressionTitle || renderer.legendOptions && renderer.legendOptions.title;
            gradient = false;
            rampHeight = 15;
            histogramContainer.style.display = "none";
        }
        var rampElement = symbolUtils.renderColorRampPreviewHTML(colors, {
            align: "horizontal",
            gradient: gradient,
            width: 300,
            height: rampHeight
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
    var allFeatures;
    var allBars = [];
    function updateHistogram(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, colorVariable, year, party, view, valueExpression, query, features, histogramParams, avg, histogramResult, _a, bins, average;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layer = params.layer, colorVariable = params.colorVariable, year = params.year, party = params.party, view = params.view;
                        valueExpression = colorVariable.valueExpression;
                        if (!!allFeatures) return [3 /*break*/, 2];
                        query = layer.createQuery();
                        query.maxRecordCountFactor = 5;
                        query.returnGeometry = false;
                        query.where = "1=1";
                        query.outFields = ["*"];
                        return [4 /*yield*/, layer.queryFeatures(query)];
                    case 1:
                        features = (_b.sent()).features;
                        allFeatures = features;
                        _b.label = 2;
                    case 2:
                        if (!(histograms[year] && histograms[year][party])) return [3 /*break*/, 3];
                        histogramChart.bins = histograms[year][party].bins;
                        return [3 /*break*/, 6];
                    case 3:
                        histogramParams = {
                            layer: layer,
                            valueExpression: valueExpression,
                            view: view,
                            features: allFeatures,
                            numBins: 100,
                            minValue: histMin,
                            maxValue: histMax
                        };
                        return [4 /*yield*/, summaryStatistics(histogramParams)];
                    case 4:
                        avg = (_b.sent()).avg;
                        return [4 /*yield*/, histogram(histogramParams)];
                    case 5:
                        histogramResult = _b.sent();
                        histograms[year] = {};
                        histograms[year][party] = {
                            bins: histogramResult.bins,
                            average: avg
                        };
                        _b.label = 6;
                    case 6:
                        _a = histograms[year][party], bins = _a.bins, average = _a.average;
                        if (!histogramChart) {
                            histogramChart = new Histogram({
                                container: "histogram",
                                min: histMin,
                                max: histMax,
                                bins: bins,
                                average: average,
                                dataLines: [
                                    {
                                        value: 0
                                    }
                                ],
                                dataLineCreatedFunction: function (element, label, index) {
                                    if (index === 0) {
                                        element.setAttribute("y2", "75%");
                                    }
                                },
                                labelFormatFunction: function (value, type, index) {
                                    var sign = value > 0 ? "+" : "";
                                    return type === "average" ? sign + value.toFixed(1) + " pts" : value.toString();
                                },
                                barCreatedFunction: function (index, element) {
                                    allBars[index] = element;
                                    var bin = histogramChart.bins[index];
                                    var midValue = (bin.maxValue - bin.minValue) / 2 + bin.minValue;
                                    var color = getColorFromValue({
                                        value: midValue,
                                        colorVariable: colorVariable
                                    });
                                    element.setAttribute("fill", color.toHex());
                                }
                            });
                        }
                        else {
                            histogramChart.bins = bins;
                            histogramChart.average = average;
                            allBars.forEach(function (bar, index) {
                                var bin = histogramChart.bins[index];
                                var midValue = (bin.maxValue - bin.minValue) / 2 + bin.minValue;
                                var color = getColorFromValue({
                                    value: midValue,
                                    colorVariable: colorVariable
                                });
                                bar.setAttribute("fill", color.toHex());
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function getColorFromValue(params) {
        var value = params.value, colorVariable = params.colorVariable;
        var stops = colorVariable.stops;
        var minStop = stops[0];
        var maxStop = stops[stops.length - 1];
        var minStopValue = minStop.value;
        var maxStopValue = maxStop.value;
        if (value < minStopValue) {
            return minStop.color;
        }
        if (value > maxStopValue) {
            return maxStop.color;
        }
        var exactMatches = stops.filter(function (stop) { return stop.value === value; });
        if (exactMatches.length > 0) {
            return exactMatches[0].color;
        }
        minStop = null;
        maxStop = null;
        stops.forEach(function (stop, i) {
            if (!minStop && !maxStop && stop.value >= value) {
                minStop = stops[i - 1];
                maxStop = stop;
            }
        });
        var weightedPosition = (value - minStop.value) / (maxStop.value - minStop.value);
        return Color.blendColors(minStop.color, maxStop.color, weightedPosition);
    }
});
//# sourceMappingURL=legendUtils.js.map
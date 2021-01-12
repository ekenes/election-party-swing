define(["require", "exports", "esri/renderers", "esri/Color", "esri/renderers/visualVariables/ColorVariable", "esri/renderers/visualVariables/SizeVariable", "esri/renderers/visualVariables/support/SizeStop", "./symbolUtils"], function (require, exports, renderers_1, Color, ColorVariable, SizeVariable, SizeStop, symbolUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.countyChangeAllRenderer = function (params) {
        var year = params.year;
        var previousYear = year - 4;
        return new renderers_1.UniqueValueRenderer({
            valueExpression: "\n      var all" + year + " = $feature[\"rep_" + year + "\"] + $feature[\"oth_" + year + "\"] + $feature[\"dem_" + year + "\"];\n      var all" + previousYear + " = $feature[\"rep_" + previousYear + "\"] + $feature[\"oth_" + previousYear + "\"] + $feature[\"dem_" + previousYear + "\"];\n\n      var demShare" + previousYear + " = ($feature[\"dem_" + previousYear + "\"] / all" + previousYear + ") * 100;\n      var demShare" + year + " = ($feature[\"dem_" + year + "\"] / all" + year + ") * 100;\n\n      var repShare" + previousYear + " = ($feature[\"rep_" + previousYear + "\"] / all" + previousYear + ") * 100;\n      var repShare" + year + " = ($feature[\"rep_" + year + "\"] / all" + year + ") * 100;\n\n      var othShare" + previousYear + " = ($feature[\"oth_" + previousYear + "\"] / all" + previousYear + ") * 100;\n      var othShare" + year + " = ($feature[\"oth_" + year + "\"] / all" + year + ") * 100;\n\n      var repChange = repShare" + year + " - repShare" + previousYear + ";\n      var demChange = demShare" + year + " - demShare" + previousYear + ";\n      var othChange = othShare" + year + " - othShare" + previousYear + ";\n\n      return Decode(Max(repChange, demChange, othChange),\n        repChange, \"republican\",\n        demChange, \"democrat\",\n        \"other\"\n      );\n    ",
            valueExpressionTitle: "Predominant voter shift ${previousYear}-${year}",
            uniqueValueInfos: [{
                    value: "democrat",
                    label: "More Democrat",
                    symbol: createSymbol(new Color("rgba(60, 108, 204, 1)"))
                }, {
                    value: "other",
                    label: "More Other",
                    symbol: createSymbol(new Color("rgba(181, 166, 0, 1)"))
                }, {
                    value: "republican",
                    label: "More Republican",
                    symbol: createSymbol(new Color("rgba(220, 75, 0, 1)"))
                }],
            visualVariables: [
                new SizeVariable({
                    valueExpression: "\n          var all" + year + " = $feature[\"rep_" + year + "\"] + $feature[\"oth_" + year + "\"] + $feature[\"dem_" + year + "\"];\n          var all" + previousYear + " = $feature[\"rep_" + previousYear + "\"] + $feature[\"oth_" + previousYear + "\"] + $feature[\"dem_" + previousYear + "\"];\n\n          var demShare" + previousYear + " = ($feature[\"dem_" + previousYear + "\"] / all" + previousYear + ") * 100;\n          var demShare" + year + " = ($feature[\"dem_" + year + "\"] / all" + year + ") * 100;\n\n          var repShare" + previousYear + " = ($feature[\"rep_" + previousYear + "\"] / all" + previousYear + ") * 100;\n          var repShare" + year + " = ($feature[\"rep_" + year + "\"] / all" + year + ") * 100;\n\n          var othShare" + previousYear + " = ($feature[\"oth_" + previousYear + "\"] / all" + previousYear + ") * 100;\n          var othShare" + year + " = ($feature[\"oth_" + year + "\"] / all" + year + ") * 100;\n\n          var repChange = repShare" + year + " - repShare" + previousYear + ";\n          var demChange = demShare" + year + " - demShare" + previousYear + ";\n          var othChange = othShare" + year + " - othShare" + previousYear + ";\n\n          return Max(repChange, demChange, othChange)\n        ",
                    valueExpressionTitle: "Shift in percentage points",
                    minDataValue: 0,
                    maxDataValue: 40,
                    maxSize: {
                        type: "size",
                        valueExpression: "$view.scale",
                        stops: [
                            new SizeStop({ size: 38.6, value: 288895 }),
                            new SizeStop({ size: 38.6, value: 2311162 }),
                            new SizeStop({ size: 24, value: 18489297 }),
                            new SizeStop({ size: 11, value: 147914381 })
                        ]
                    },
                    minSize: {
                        type: "size",
                        valueExpression: "$view.scale",
                        stops: [
                            new SizeStop({ size: 1, value: 288895 }),
                            new SizeStop({ size: 1, value: 2311162 }),
                            new SizeStop({ size: 0.8, value: 18489297 }),
                            new SizeStop({ size: 0.4, value: 147914381 })
                        ]
                    }
                })
            ]
        });
    };
    exports.countyChangePartyRenderer = function (params) {
        var year = params.year, party = params.party;
        if (party === "all") {
            throw new Error("You must specify a party");
        }
        var previousYear = year - 4;
        var ramps = {
            rep: ["#78716e", "#a19b96", "rgba(214, 201, 195, 1)", "rgba(214, 146, 111, 1)", "rgba(220, 75, 0, 1)"],
            dem: ["#78716e", "#a19b96", "rgba(186, 195, 214, 1)", "rgba(129, 156, 212, 1)", "rgba(60, 108, 204, 1)"],
            oth: ["#78716e", "#a19b96", "rgba(184, 182, 169, 1)", "rgba(176, 169, 95, 1)", "rgba(181, 166, 0, 1)"]
        };
        var partyLabels = {
            rep: ["Less Republican", "More Republican"],
            dem: ["Less Democrat", "More Democrat"],
            oth: ["Fewer other votes", "More other votes"]
        };
        var colors = ramps[party];
        var labels = partyLabels[party];
        // const colors = [ "#667181", "#97a2b3", "#ebd9d8", "#d5857f", "#be3027" ];
        // const colors = [ "#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040" ];
        // const colors = [ "#78716e", "#a19b96", "#ced9d9", "#54c5d5", "#009db3" ];
        // const colors = [ "#faefdb", "#a19c8f", "#00708d", "#40b2c6", "#80f3ff" ];
        // const colors = [ "#ffff00", "#a4a41c", "#424038", "#8a8a8a", "#cccccc" ];
        return new renderers_1.ClassBreaksRenderer({
            valueExpression: "\n      var all" + year + " = $feature[\"rep_" + year + "\"] + $feature[\"oth_" + year + "\"] + $feature[\"dem_" + year + "\"];\n      var all" + previousYear + " = $feature[\"rep_" + previousYear + "\"] + $feature[\"oth_" + previousYear + "\"] + $feature[\"dem_" + previousYear + "\"];\n\n      var " + party + "Share" + previousYear + " = ($feature[\"" + party + "_" + previousYear + "\"] / all" + previousYear + ") * 100;\n      var " + party + "Share" + year + " = ($feature[\"" + party + "_" + year + "\"] / all" + year + ") * 100;\n\n      return " + party + "Share" + year + " - " + party + "Share" + previousYear + ";\n    ",
            valueExpressionTitle: "Predominant voter shift " + previousYear + "-" + year,
            classBreakInfos: [{
                    minValue: -9007199254740991,
                    maxValue: 0,
                    symbol: symbolUtils_1.belowSymbol //createSymbol(new Color(colors[0]))
                }, {
                    minValue: 0,
                    maxValue: 9007199254740991,
                    symbol: symbolUtils_1.aboveSymbol // createSymbol(new Color(colors[4]))
                }],
            visualVariables: [
                new ColorVariable({
                    valueExpression: "\n          var all" + year + " = $feature[\"rep_" + year + "\"] + $feature[\"oth_" + year + "\"] + $feature[\"dem_" + year + "\"];\n          var all" + previousYear + " = $feature[\"rep_" + previousYear + "\"] + $feature[\"oth_" + previousYear + "\"] + $feature[\"dem_" + previousYear + "\"];\n\n          var " + party + "Share" + previousYear + " = ($feature[\"" + party + "_" + previousYear + "\"] / all" + previousYear + ") * 100;\n          var " + party + "Share" + year + " = ($feature[\"" + party + "_" + year + "\"] / all" + year + ") * 100;\n\n          return " + party + "Share" + year + " - " + party + "Share" + previousYear + ";\n        ",
                    valueExpressionTitle: "Shift in party votes",
                    stops: [
                        { value: -15, color: colors[0], label: labels[0] },
                        { value: -5, color: colors[1] },
                        { value: 0, color: colors[2] },
                        { value: 5, color: colors[3] },
                        { value: 15, color: colors[4], label: labels[1] }
                    ]
                }),
                new SizeVariable({
                    valueExpression: "\n          var all" + year + " = $feature[\"rep_" + year + "\"] + $feature[\"oth_" + year + "\"] + $feature[\"dem_" + year + "\"];\n          var all" + previousYear + " = $feature[\"rep_" + previousYear + "\"] + $feature[\"oth_" + previousYear + "\"] + $feature[\"dem_" + previousYear + "\"];\n\n          var " + party + "Share" + previousYear + " = ($feature[\"" + party + "_" + previousYear + "\"] / all" + previousYear + ") * 100;\n          var " + party + "Share" + year + " = ($feature[\"" + party + "_" + year + "\"] / all" + year + ") * 100;\n\n          return " + party + "Share" + year + " - " + party + "Share" + previousYear + ";\n        ",
                    valueExpressionTitle: "Shift in percentage points",
                    stops: [
                        { value: -40, size: 24 },
                        { value: -20, size: 12 },
                        { value: 0, size: 1 },
                        { value: 20, size: 12 },
                        { value: 40, size: 24 }
                    ]
                })
            ]
        });
    };
    function createSymbol(color) {
        return {
            type: "simple-marker",
            color: color,
            style: "circle",
            outline: {
                width: 0.5,
                color: [255, 255, 255, 0.3]
            }
        };
    }
});
//# sourceMappingURL=rendererUtils.js.map
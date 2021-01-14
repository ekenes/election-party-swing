define(["require", "exports", "./config"], function (require, exports, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.votesStateNextBase = function () {
        return "\n    var dem = $feature." + config_1.fieldInfos.democrat.state.next.name + ";\n    var rep = $feature." + config_1.fieldInfos.republican.state.next.name + ";\n    var oth = $feature." + config_1.fieldInfos.other.state.next.name + ";\n    var all = [dem, rep, oth];\n  ";
    };
    exports.votesCountyNextBase = function () {
        return "\n    var dem = $feature." + config_1.fieldInfos.democrat.county.next.name + ";\n    var rep = $feature." + config_1.fieldInfos.republican.county.next.name + ";\n    var oth = $feature." + config_1.fieldInfos.other.county.next.name + ";\n    var all = [dem, rep, oth];\n  ";
    };
    exports.diffTextBase = "\n  var diff = votesNext - votesPrevious;\n  var change = ( (votesNext - votesPrevious) / votesPrevious );\n  var diffText = IIF(diff > 0, Text(diff, '+#,###'), Text(diff, '#,###'));\n  var changeText = IIF(change > 0, Text(change, '\u2191#,###.#%'), Text(abs(change), '\u2193#,###.#%'));\n";
    exports.colorDiffPopupBase = "\n  var diff = votesNext - votesPrevious;\n  var change = ( (votesNext - votesPrevious) / votesPrevious );\n  return IIF(diff > 0, \"green\", \"red\");\n";
    exports.diffLabelText = "\n  var change = valueNext - valuePrevious;\n  IIF(change > 0, Text(change, '+#,###'), Text(change, '#,###'));\n";
    exports.colorShiftPopupBase = "\n  return IIF(shift > 0, \"green\", \"red\");\n";
    exports.shareTextBase = "\n  var share = (votes / allNext);\n  return Text(share, '##.0%');\n";
    exports.allCountyNextBase = function () {
        return "\n    var demNext = $feature." + config_1.fieldInfos.democrat.county.next.name + ";\n    var repNext = $feature." + config_1.fieldInfos.republican.county.next.name + ";\n    var othNext = $feature." + config_1.fieldInfos.other.county.next.name + ";\n    var allNext = Sum([demNext, repNext, othNext]);\n  ";
    };
    exports.allCountyPreviousBase = function () {
        return "\n    var demPrevious = $feature." + config_1.fieldInfos.democrat.county.previous.name + ";\n    var repPrevious = $feature." + config_1.fieldInfos.republican.county.previous.name + ";\n    var othPrevious = $feature." + config_1.fieldInfos.other.county.previous.name + ";\n    var allPrevious = Sum([demPrevious, repPrevious, othPrevious]);\n  ";
    };
    exports.shiftCounties = function () {
        return "\n    var demNext = $feature." + config_1.fieldInfos.democrat.county.next.name + ";\n    var repNext = $feature." + config_1.fieldInfos.republican.county.next.name + ";\n    var othNext = $feature." + config_1.fieldInfos.other.county.next.name + ";\n    var allNext = Sum([demNext, repNext, othNext]);\n\n    var demPrevious = $feature." + config_1.fieldInfos.democrat.county.previous.name + ";\n    var repPrevious = $feature." + config_1.fieldInfos.republican.county.previous.name + ";\n    var othPrevious = $feature." + config_1.fieldInfos.other.county.previous.name + ";\n    var allPrevious = Sum([demPrevious, repPrevious, othPrevious]);\n\n\n    var percentNext = (votesNext / allNext) * 100;\n    var percentPrevious = (votesPrevious / allPrevious) * 100;\n    var shift = percentNext - percentPrevious;\n  ";
    };
    exports.shiftCountyTextBase = function () {
        return "\n    " + exports.shiftCounties() + "\n\n    var shiftText = IIF(shift > 0, Text(shift, '+#,###.0'), Text(shift, '#,###.0'));\n    return shiftText + \"%\";\n  ";
    };
});
//# sourceMappingURL=expressionUtils.js.map
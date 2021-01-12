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
});
//# sourceMappingURL=expressionUtils.js.map
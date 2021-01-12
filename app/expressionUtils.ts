import { fieldInfos } from "./config";

export const votesStateNextBase = () => {
  return `
    var dem = $feature.${fieldInfos.democrat.state.next.name};
    var rep = $feature.${fieldInfos.republican.state.next.name};
    var oth = $feature.${fieldInfos.other.state.next.name};
    var all = [dem, rep, oth];
  `
};

export const votesCountyNextBase = () => {
  return `
    var dem = $feature.${fieldInfos.democrat.county.next.name};
    var rep = $feature.${fieldInfos.republican.county.next.name};
    var oth = $feature.${fieldInfos.other.county.next.name};
    var all = [dem, rep, oth];
  `
};

export const diffTextBase = `
  var diff = votesNext - votesPrevious;
  var change = ( (votesNext - votesPrevious) / votesPrevious );
  var diffText = IIF(diff > 0, Text(diff, '+#,###'), Text(diff, '#,###'));
  var changeText = IIF(change > 0, Text(change, '↑#,###.#%'), Text(abs(change), '↓#,###.#%'));
`;

export const colorDiffPopupBase = `
  var diff = votesNext - votesPrevious;
  var change = ( (votesNext - votesPrevious) / votesPrevious );
  return IIF(diff > 0, "green", "red");
`;

export const diffLabelText = `
  var change = valueNext - valuePrevious;
  IIF(change > 0, Text(change, '+#,###'), Text(change, '#,###'));
`;

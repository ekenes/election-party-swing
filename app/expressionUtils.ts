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

export const colorShiftPopupBase = `
  return IIF(shift > 0, "green", "red");
`;

export const shareTextBase = `
  var share = (votes / allNext);
  return Text(share, '##.0%');
`;

export const allCountyNextBase = () => {
  return `
    var demNext = $feature.${fieldInfos.democrat.county.next.name};
    var repNext = $feature.${fieldInfos.republican.county.next.name};
    var othNext = $feature.${fieldInfos.other.county.next.name};
    var allNext = Sum([demNext, repNext, othNext]);
  `
}

export const allCountyPreviousBase = () => {
  return `
    var demPrevious = $feature.${fieldInfos.democrat.county.previous.name};
    var repPrevious = $feature.${fieldInfos.republican.county.previous.name};
    var othPrevious = $feature.${fieldInfos.other.county.previous.name};
    var allPrevious = Sum([demPrevious, repPrevious, othPrevious]);
  `
}

export const shiftCounties = () => {
  return `
    var demNext = $feature.${fieldInfos.democrat.county.next.name};
    var repNext = $feature.${fieldInfos.republican.county.next.name};
    var othNext = $feature.${fieldInfos.other.county.next.name};
    var allNext = Sum([demNext, repNext, othNext]);

    var demPrevious = $feature.${fieldInfos.democrat.county.previous.name};
    var repPrevious = $feature.${fieldInfos.republican.county.previous.name};
    var othPrevious = $feature.${fieldInfos.other.county.previous.name};
    var allPrevious = Sum([demPrevious, repPrevious, othPrevious]);


    var percentNext = (votesNext / allNext) * 100;
    var percentPrevious = (votesPrevious / allPrevious) * 100;
    var shift = percentNext - percentPrevious;
  `;
}

export const shiftCountyTextBase = () => {
  return `
    ${shiftCounties()}

    var shiftText = IIF(shift > 0, Text(shift, '+#,###.0'), Text(shift, '#,###.0'));
    return shiftText + "%";
  `;
}

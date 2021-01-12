import { ClassBreaksRenderer, UniqueValueRenderer } from "esri/renderers";
import Color = require("esri/Color");
import ColorVariable = require("esri/renderers/visualVariables/ColorVariable");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import SizeStop = require("esri/renderers/visualVariables/support/SizeStop");
import { SimpleFillSymbol } from "esri/symbols";
import { years, fieldInfos, dColor, rColor, selectedYear } from "./config";
import { aboveSymbol, belowSymbol } from "./symbolUtils";

////////////////////////////////////////////////////
//
// COUNTY CHANGE
//
///////////////////////////////////////////////////

export interface RendererParams {
  year: 2004 | 2008 | 2012 | 2016 | 2020 | number;
  party?: "all" | "rep" | "dem" | "oth";
}

export const countyChangeAllRenderer = (params: RendererParams) => {
  const { year } = params;
  const previousYear = year - 4;

  return new UniqueValueRenderer({
    valueExpression: `
      var all${year} = $feature["rep_${year}"] + $feature["oth_${year}"] + $feature["dem_${year}"];
      var all${previousYear} = $feature["rep_${previousYear}"] + $feature["oth_${previousYear}"] + $feature["dem_${previousYear}"];

      var demShare${previousYear} = ($feature["dem_${previousYear}"] / all${previousYear}) * 100;
      var demShare${year} = ($feature["dem_${year}"] / all${year}) * 100;

      var repShare${previousYear} = ($feature["rep_${previousYear}"] / all${previousYear}) * 100;
      var repShare${year} = ($feature["rep_${year}"] / all${year}) * 100;

      var othShare${previousYear} = ($feature["oth_${previousYear}"] / all${previousYear}) * 100;
      var othShare${year} = ($feature["oth_${year}"] / all${year}) * 100;

      var repChange = repShare${year} - repShare${previousYear};
      var demChange = demShare${year} - demShare${previousYear};
      var othChange = othShare${year} - othShare${previousYear};

      return Decode(Max(repChange, demChange, othChange),
        repChange, "republican",
        demChange, "democrat",
        "other"
      );
    `,
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
        valueExpression: `
          var all${year} = $feature["rep_${year}"] + $feature["oth_${year}"] + $feature["dem_${year}"];
          var all${previousYear} = $feature["rep_${previousYear}"] + $feature["oth_${previousYear}"] + $feature["dem_${previousYear}"];

          var demShare${previousYear} = ($feature["dem_${previousYear}"] / all${previousYear}) * 100;
          var demShare${year} = ($feature["dem_${year}"] / all${year}) * 100;

          var repShare${previousYear} = ($feature["rep_${previousYear}"] / all${previousYear}) * 100;
          var repShare${year} = ($feature["rep_${year}"] / all${year}) * 100;

          var othShare${previousYear} = ($feature["oth_${previousYear}"] / all${previousYear}) * 100;
          var othShare${year} = ($feature["oth_${year}"] / all${year}) * 100;

          var repChange = repShare${year} - repShare${previousYear};
          var demChange = demShare${year} - demShare${previousYear};
          var othChange = othShare${year} - othShare${previousYear};

          return Max(repChange, demChange, othChange)
        `,
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

export const countyChangePartyRenderer = (params: RendererParams) => {
  const { year, party } = params;

  if(party === "all"){
    throw new Error("You must specify a party");
  }

  const previousYear = year - 4;

  const ramps = {
    rep: [ "#78716e", "#a19b96", "rgba(214, 201, 195, 1)", "rgba(214, 146, 111, 1)", "rgba(220, 75, 0, 1)" ],
    dem: [ "#78716e", "#a19b96", "rgba(186, 195, 214, 1)", "rgba(129, 156, 212, 1)", "rgba(60, 108, 204, 1)" ],
    oth: [ "#78716e", "#a19b96", "rgba(184, 182, 169, 1)", "rgba(176, 169, 95, 1)", "rgba(181, 166, 0, 1)"]
  }

  const partyLabels = {
    rep: [ "Less Republican", "More Republican" ],
    dem: [ "Less Democrat", "More Democrat" ],
    oth: [ "Fewer other votes", "More other votes" ]
  }

  const colors = ramps[party];
  const labels = partyLabels[party];

  // const colors = [ "#667181", "#97a2b3", "#ebd9d8", "#d5857f", "#be3027" ];
  // const colors = [ "#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040" ];
  // const colors = [ "#78716e", "#a19b96", "#ced9d9", "#54c5d5", "#009db3" ];
  // const colors = [ "#faefdb", "#a19c8f", "#00708d", "#40b2c6", "#80f3ff" ];
  // const colors = [ "#ffff00", "#a4a41c", "#424038", "#8a8a8a", "#cccccc" ];

  return new ClassBreaksRenderer({
    valueExpression: `
      var all${year} = $feature["rep_${year}"] + $feature["oth_${year}"] + $feature["dem_${year}"];
      var all${previousYear} = $feature["rep_${previousYear}"] + $feature["oth_${previousYear}"] + $feature["dem_${previousYear}"];

      var ${party}Share${previousYear} = ($feature["${party}_${previousYear}"] / all${previousYear}) * 100;
      var ${party}Share${year} = ($feature["${party}_${year}"] / all${year}) * 100;

      return ${party}Share${year} - ${party}Share${previousYear};
    `,
    valueExpressionTitle: `Predominant voter shift ${previousYear}-${year}`,
    classBreakInfos: [{
      minValue: -9007199254740991,
      maxValue: 0,
      symbol: belowSymbol //createSymbol(new Color(colors[0]))
    }, {
      minValue: 0,
      maxValue: 9007199254740991,
      symbol: aboveSymbol   // createSymbol(new Color(colors[4]))
    }],
    visualVariables: [
      new ColorVariable({
        valueExpression: `
          var all${year} = $feature["rep_${year}"] + $feature["oth_${year}"] + $feature["dem_${year}"];
          var all${previousYear} = $feature["rep_${previousYear}"] + $feature["oth_${previousYear}"] + $feature["dem_${previousYear}"];

          var ${party}Share${previousYear} = ($feature["${party}_${previousYear}"] / all${previousYear}) * 100;
          var ${party}Share${year} = ($feature["${party}_${year}"] / all${year}) * 100;

          return ${party}Share${year} - ${party}Share${previousYear};
        `,
        valueExpressionTitle: `Shift in party votes`,
        stops: [
          { value: -15, color: colors[0], label: labels[0] },
          { value: -5, color: colors[1] },
          { value: 0, color: colors[2] },
          { value: 5, color: colors[3] },
          { value: 15, color: colors[4], label: labels[1] }
        ]
      }),
      new SizeVariable({
        valueExpression: `
          var all${year} = $feature["rep_${year}"] + $feature["oth_${year}"] + $feature["dem_${year}"];
          var all${previousYear} = $feature["rep_${previousYear}"] + $feature["oth_${previousYear}"] + $feature["dem_${previousYear}"];

          var ${party}Share${previousYear} = ($feature["${party}_${previousYear}"] / all${previousYear}) * 100;
          var ${party}Share${year} = ($feature["${party}_${year}"] / all${year}) * 100;

          return ${party}Share${year} - ${party}Share${previousYear};
        `,
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

function createSymbol(color: Color){
  return {
    type: "simple-marker",
    color,
    style: "circle",
    outline: {
      width: 0.5,
      color: [ 255,255,255,0.3 ]
    }
  }
}
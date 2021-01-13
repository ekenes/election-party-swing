import { ClassBreaksRenderer, UniqueValueRenderer } from "esri/renderers";
import Color = require("esri/Color");
import ColorVariable = require("esri/renderers/visualVariables/ColorVariable");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import SizeStop = require("esri/renderers/visualVariables/support/SizeStop");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import { SimpleFillSymbol } from "esri/symbols";
import { years, fieldInfos, dColor, rColor, selectedYear } from "./config";
import { aboveSymbol, belowSymbol, caretCircleDown, caretCircleUp, caretDown, caretUp, minusSymbol, plusSymbol } from "./symbolUtils";

////////////////////////////////////////////////////
//
// COUNTY CHANGE
//
///////////////////////////////////////////////////

export interface RendererParams {
  year?: 2004 | 2008 | 2012 | 2016 | 2020 | number;
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
    valueExpressionTitle: `Predominant party shift ${previousYear}-${year}`,
    uniqueValueInfos: [{
      value: "democrat",
      label: "Democrat",
      symbol: createArrowSymbol({
        color: new Color("rgba(60, 108, 204, 1)"),
        rotation: 45
      })
    }, {
      value: "other",
      label: "Other",
      symbol: createArrowSymbol({
        color: new Color("rgba(181, 166, 0, 1)"),
        rotation: 0
      })
    }, {
      value: "republican",
      label: "Republican",
      symbol: createArrowSymbol({
        color: new Color("rgba(220, 75, 0, 1)"),
        rotation: -45
      })
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
            new SizeStop({ size: 45, value: 288895 }),
            new SizeStop({ size: 38, value: 2311162 }),
            new SizeStop({ size: 30, value: 18489297 }),
            new SizeStop({ size: 18, value: 147914381 })
          ]
        },
        minSize: {
          type: "size",
          valueExpression: "$view.scale",
          stops: [
            new SizeStop({ size: 6, value: 288895 }),
            new SizeStop({ size: 4, value: 2311162 }),
            new SizeStop({ size: 3, value: 18489297 }),
            new SizeStop({ size: 2, value: 147914381 })
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
    oth: [ "Less third party", "More third party" ]
  }

  const partyLong = {
    rep: "Republican",
    dem: "Democrat",
    oth: "other",
  }

  const colors = ramps[party];
  const labels = partyLabels[party];

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
      symbol: caretCircleDown //belowSymbol  // belowSymbol //createSymbol(new Color(colors[0]))
    }, {
      minValue: 0,
      maxValue: 9007199254740991,
      symbol: caretCircleUp// aboveSymbol  //aboveSymbol   // createSymbol(new Color(colors[4]))
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
        valueExpressionTitle: `Shift in ${partyLong[party]} votes ${previousYear}-${year}`,
        stops: [
          { value: -15, color: colors[0], label: `-20% pts` },
          { value: -7.5, color: colors[1] },
          { value: 0, color: colors[2], label: `no shift` },
          { value: 7.5, color: colors[3] },
          { value: 15, color: colors[4], label: `+20% pts` }
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
          { value: -40, size: 28 },
          { value: -20, size: 15 },
          { value: 0, size: 3 },
          { value: 20, size: 15 },
          { value: 40, size: 28 }
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

interface ArrowSymbol {
  color: Color;
  rotation: number;
}
function createArrowSymbol(params: ArrowSymbol){
  const { color, rotation } = params;
  const symbol = aboveSymbol.clone();
  cimSymbolUtils.applyCIMSymbolColor(symbol, color);
  cimSymbolUtils.applyCIMSymbolRotation(symbol, rotation);
  return symbol;
}
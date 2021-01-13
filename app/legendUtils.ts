import esri = __esri;
import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");
import cimSymbolUtils = require("esri/symbols/support/cimSymbolUtils");
import Histogram = require("esri/widgets/Histogram");
import histogram = require("esri/smartMapping/statistics/histogram");
import summaryStatistics = require("esri/smartMapping/statistics/summaryStatistics");
import { results } from "./config";
import { RendererParams } from "./rendererUtils";

const rampContainer = document.getElementById("ramp-container") as HTMLDivElement;
const upperLabel = document.getElementById("right-label") as HTMLDivElement;
const lowerLabel = document.getElementById("left-label") as HTMLDivElement;
const centerLabel = document.getElementById("center-label") as HTMLDivElement;
const legendTitle = document.getElementById("legend-title") as HTMLDivElement;
const histogramContainer = document.getElementById("histogram") as HTMLDivElement;

// {
//   2004: {
//     rep: {},
//     dem: {},
//     oth: {}
//   }
// }
let histograms = {};
let histogramChart: Histogram;
const histMin = -20;
const histMax = 20;

interface CreateLegendParams {
  layer: esri.FeatureLayer;
  view: esri.MapView;
  year: RendererParams["year"];
  party: RendererParams["party"];
}

export function createLegend(params: CreateLegendParams){
  const { layer, view, year, party } = params;
  rampContainer.innerHTML = null;

  let colors: Color[],
      gradient: boolean,
      labels: string[],
      title: string,
      colorVariable: esri.ColorVariable;

  let rampHeight = 15;

  const renderer = layer.renderer as esri.RendererWithVisualVariables;

  if(renderer.visualVariables.some( vv => vv.type === "color")){
    colorVariable = renderer.visualVariables.find(vv => vv.type === "color") as esri.ColorVariable;
    colors = colorVariable.stops.map( stop => stop.color);

    labels = colorVariable.stops
      .filter( stop => stop.label )
      .map( stop => stop.label );
    title = colorVariable.valueExpressionTitle || colorVariable.legendOptions && colorVariable.legendOptions.title;
    gradient = true;
    rampHeight = 3;
    updateHistogram({
      layer,
      view,
      colorVariable,
      year,
      party
    });
    histogramContainer.style.display = "block";
  }

  if(renderer.type === "unique-value"){
    colors = renderer.uniqueValueInfos
      // .filter( info => info.value !== "other")
      .map( info => {
        const symbol = info.symbol;
        if(symbol.type === "cim"){
          return cimSymbolUtils.getCIMSymbolColor(symbol as esri.CIMSymbol);
        }
        return symbol.color;
      });

    labels = renderer.uniqueValueInfos
      // .filter( info => info.value !== "other" && info.label)
      .map( info => info.label);

    title = renderer.valueExpressionTitle || renderer.legendOptions && renderer.legendOptions.title;
    gradient = false;
    rampHeight = 15;
    histogramContainer.style.display = "none";
  }

  const rampElement = symbolUtils.renderColorRampPreviewHTML(colors, {
    align: "horizontal",
    gradient,
    width: 300,
    height: rampHeight
  });

  rampContainer.appendChild(rampElement);

  if(labels){
    lowerLabel.innerHTML = labels[0];
    centerLabel.innerHTML = labels.length === 3 ? labels[1] : null;
    upperLabel.innerHTML = labels.length === 3 ? labels[2] : labels[1];
  }

  if(title){
    legendTitle.innerHTML = title;
  }
}

const currentYear = document.getElementById("current-year") as HTMLDivElement;
const demCandidate = document.getElementById("dem-candidate") as HTMLDivElement;
const demVotes = document.getElementById("dem-votes") as HTMLDivElement;
const repCandidate = document.getElementById("rep-candidate") as HTMLDivElement;
const repVotes = document.getElementById("rep-votes") as HTMLDivElement;
const demResults = document.getElementById("dem-results") as HTMLDivElement;
const repResults = document.getElementById("rep-results") as HTMLDivElement;

export function updateResultsDisplay(year: RendererParams["year"]){
  const result = results[year];

  currentYear.innerHTML = year.toString();

  const demWinner = result.democrat.electoralVotes > result.republican.electoralVotes;

  demCandidate.innerHTML = result.democrat.candidate;
  demVotes.innerHTML = result.democrat.electoralVotes;

  repCandidate.innerHTML = result.republican.candidate;
  repVotes.innerHTML = result.republican.electoralVotes;

  if(demWinner){
    demResults.style.fontWeight = "bolder";
    repResults.style.fontWeight = null;
  } else {
    demResults.style.fontWeight = null;
    repResults.style.fontWeight = "bolder";
  }
}

interface HistogramParams {
  layer: esri.FeatureLayer;
  view: esri.MapView;
  colorVariable: esri.ColorVariable;
  year: RendererParams["year"];
  party: RendererParams["party"];
}

let allFeatures: esri.Graphic[];
let allBars: HTMLElement[] = [];

async function updateHistogram(params: HistogramParams){
  const {
    layer,
    colorVariable,
    year,
    party,
    view
  } = params;
  const { valueExpression } = colorVariable;

  if(!allFeatures){
    const query = layer.createQuery();
    query.maxRecordCountFactor = 5;
    query.returnGeometry = false;
    query.where = "1=1";
    query.outFields = [ "*" ];

    const { features } = await layer.queryFeatures(query);
    allFeatures = features;
  }

  if(histograms[year] && histograms[year][party]){
    histogramChart.bins = histograms[year][party].bins;
  } else {
    const histogramParams = {
      layer,
      valueExpression,
      view,
      features: allFeatures,
      numBins: 100,
      minValue: histMin,
      maxValue: histMax
    };

    const { avg } = await summaryStatistics(histogramParams);
    const histogramResult = await histogram(histogramParams);
    histograms[year] = {};
    histograms[year][party] = {
      bins: histogramResult.bins,
      average: avg
    };
  }

  const { bins, average } = histograms[year][party];

  if (!histogramChart) {

    histogramChart = new Histogram({
      container: "histogram",
      min: histMin,
      max: histMax,
      bins,
      average,
      dataLines: [
        {
          value: 0
        }
      ],
      dataLineCreatedFunction: (element, label, index) => {
        if (index === 0) {
          element.setAttribute("y2", "75%");
        }
      },
      labelFormatFunction: (value: number, type?: string, index?: number) => {
        const sign = value > 0 ? "+" : "";
        return type === "average" ? sign + value.toFixed(1) + " pts": value.toString();
      },
      barCreatedFunction: (index, element) => {
        allBars[index] = element;
        const bin = histogramChart.bins[index];
        const midValue = (bin.maxValue - bin.minValue) / 2 + bin.minValue;
        const color = getColorFromValue({
          value: midValue,
          colorVariable
        });
        element.setAttribute("fill", color.toHex());
      }
    });
  } else {
    histogramChart.bins = bins;
    histogramChart.average = average;
    allBars.forEach( (bar, index) => {
      const bin = histogramChart.bins[index];
      const midValue = (bin.maxValue - bin.minValue) / 2 + bin.minValue;
      const color = getColorFromValue({
        value: midValue,
        colorVariable
      });
      bar.setAttribute("fill", color.toHex());
    })
  }
}

interface ValueColorParams {
  value: number;
  colorVariable: esri.ColorVariable;
}

function getColorFromValue(params: ValueColorParams) {
  const { value, colorVariable } = params;

  const stops = colorVariable.stops;
  let minStop = stops[0];
  let maxStop = stops[stops.length - 1];

  let minStopValue = minStop.value;
  let maxStopValue = maxStop.value;

  if (value < minStopValue) {
    return minStop.color;
  }

  if (value > maxStopValue) {
    return maxStop.color;
  }

  const exactMatches = stops.filter((stop) => stop.value === value);

  if (exactMatches.length > 0) {
    return exactMatches[0].color;
  }

  minStop = null;
  maxStop = null;
  stops.forEach((stop, i) => {
    if (!minStop && !maxStop && stop.value >= value) {
      minStop = stops[i - 1];
      maxStop = stop;
    }
  });

  const weightedPosition =
    (value - minStop.value) / (maxStop.value - minStop.value);

  return Color.blendColors(
    minStop.color,
    maxStop.color,
    weightedPosition
  );
}
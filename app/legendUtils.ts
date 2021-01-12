import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");

const rampContainer = document.getElementById("ramp-container") as HTMLDivElement;
const upperLabel = document.getElementById("right-label") as HTMLDivElement;
const lowerLabel = document.getElementById("left-label") as HTMLDivElement;
const centerLabel = document.getElementById("center-label") as HTMLDivElement;
const legendTitle = document.getElementById("legend-title") as HTMLDivElement;

interface CreateLegendParams {
  colors: Color[];
  gradient?: boolean;
  labels?: string[];
  title?: string;
}

export function createLegend(params: CreateLegendParams){
  const { colors, gradient, labels, title } = params;
  rampContainer.innerHTML = null;

  const rampElement = symbolUtils.renderColorRampPreviewHTML(colors, {
    align: "horizontal",
    gradient,
    width: 300,
    height: 15
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
import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");

const rampContainer = document.getElementById("ramp-container") as HTMLDivElement;
const upperLabel = document.getElementById("right-label") as HTMLDivElement;
const lowerLabel = document.getElementById("left-label") as HTMLDivElement;

interface CreateLegendParams {
  colors: Color[];
  gradient?: boolean;
  labels?: string[];
}

export function createLegend(params: CreateLegendParams){
  const { colors, gradient, labels } = params;
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
    upperLabel.innerHTML = labels[1];
  }
}
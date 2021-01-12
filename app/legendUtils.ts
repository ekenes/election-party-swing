import Color = require("esri/Color");
import symbolUtils = require("esri/symbols/support/symbolUtils");
import { results } from "./config";
import { RendererParams } from "./rendererUtils";

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
import esri = __esri;
import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Expand = require("esri/widgets/Expand");
import FeatureEffect = require("esri/views/layers/support/FeatureEffect");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");

import { referenceScale, maxScale, basemapPortalItem, countiesLayerPortalItem, years, setSelectedYear, getUrlParams, selectedYear, yearSlider, selectedParty, setSelectedParty, statesLayerPortalItem, fieldInfos, results } from "./config";
import { countyChangeAllRenderer, countyChangePartyRenderer, RendererParams, stateElectoralResultsRenderer } from "./rendererUtils";
import { createLegend, updateResultsDisplay } from "./legendUtils";
import { countyPopupTemplate, statePopupTemplate } from "./popupUtils";
import { Extent } from "esri/geometry";

( async () => {

  const map = new EsriMap({
    basemap: {
      portalItem: {
        id: basemapPortalItem
      }
    }
  });

  const initialExtent = new Extent({
    spatialReference: {
      wkid: 102100
    },
    xmin: -14827488,
    ymin: 2871580,
    xmax: -7008078,
    ymax: 6990447
  });

  const view = new MapView({
    container: `viewDiv`,
    map: map,
    extent: initialExtent,
    scale: referenceScale * 8,
    constraints: {
      minScale: 24992582*2,
      maxScale,
      snapToZoom: false,
      rotationEnabled: false,
      geometry: initialExtent
    },
    highlightOptions: {
      fillOpacity: 0
    },
    breakpoints: {
      large: 1200,
      medium: 992,
      small: 768,
      xsmall: 544
    },
    popup: {
      collapseEnabled: false,
      dockEnabled: true,
      dockOptions: {
        breakpoint: false,
        position: "bottom-right"
      }
    }
  });

  view.ui.add(new Expand({
    view,
    expanded: true,
    content: document.getElementById("infoDiv"),
    expandIconClass: "esri-icon-sliders"
  }), "top-right");

  view.ui.add(new Expand({
    view,
    expanded: !isMobileBrowser(),
    content: document.getElementById("legend-container"),
    expandIconClass: "esri-icon-chart"
  }), "bottom-left");

  const commonLayerOptions = {
    outFields: ["*"]
  };

  const countyChangeLayer = new FeatureLayer(commonLayerOptions);
  const stateElectoralResultsLayer = new FeatureLayer(commonLayerOptions);

  const btns = Array.from(document.getElementsByTagName("button"));

  btns.forEach( btn => {
    btn.addEventListener("click", () => {
      setSelectedParty(btn.id as RendererParams["party"]);

      updateLayers({
        year: selectedYear,
        party: selectedParty
      });
    });
  });

  function updateLayers(params: RendererParams){

    const { party } = params;

    stateElectoralResultsLayer.set({
      portalItem: {
        id: statesLayerPortalItem
      },
      title: `Results by state`,
      opacity: 1,
      renderer: stateElectoralResultsRenderer(),
      popupTemplate: statePopupTemplate()
    });

    countyChangeLayer.set({
      portalItem: {
        id: countiesLayerPortalItem
      },
      legendEnabled: false,
      renderer: party && party !== "all" ? countyChangePartyRenderer(params) : countyChangeAllRenderer(params),
      labelsVisible: false,
      popupTemplate: countyPopupTemplate()
    });

    createLegend({
      layer: countyChangeLayer,
      view,
      year: selectedYear,
      party: selectedParty
    })

    updateResultsDisplay(selectedYear);
    updateSwingStates();
  }

  async function updateSwingStates(){
    const stateLayerView = await view.whenLayerView(stateElectoralResultsLayer) as esri.FeatureLayerView;
    const countyLayerView = await view.whenLayerView(countyChangeLayer) as esri.FeatureLayerView;

    const dem_n = fieldInfos.democrat.state.next.name;
    const dem_p = fieldInfos.democrat.state.previous.name;
    const rep_n = fieldInfos.republican.state.next.name;
    const rep_p = fieldInfos.republican.state.previous.name;
    const oth_n = fieldInfos.other.state.next.name;
    const oth_p = fieldInfos.other.state.previous.name;

    // where clause indicating states that did not flip;
    const where = `

      (
        ((${rep_n} > ${dem_n}) AND (${rep_n} > ${oth_n}) AND (${rep_p} > ${dem_p}) AND (${rep_p} > ${oth_p})) OR
        ((${dem_n} > ${rep_n}) AND (${dem_n} > ${oth_n}) AND (${dem_p} > ${rep_p}) AND (${dem_p} > ${oth_p})) OR
        ((${oth_n} > ${dem_n}) AND (${oth_n} > ${rep_n}) AND (${oth_p} > ${dem_p}) AND (${oth_p} > ${rep_p}))
      )
    `;

    //  AND (${oth_n} IS NOT NULL AND ${oth_n} != 0) AND (${oth_p} IS NOT NULL AND ${oth_n} != 0))

    stateLayerView.effect = new FeatureEffect({
      filter: new FeatureFilter({
        where
      }),
      includedEffect: "opacity(0.15)",
      excludedEffect: "hue-rotate(-20deg) saturate(200%) drop-shadow(5px, 5px, 10px, black) opacity(0.4)"
    });

    countyChangeLayer.blendMode = "multiply";

    // "hue-rotate(-20deg) bloom(0.5, 1px, 20%) drop-shadow(5px, 5px, 10px, black) opacity(0.75)"

    countyLayerView.effect = new FeatureEffect({
      filter: new FeatureFilter({
        where: "state IN (" + results[selectedYear].swingstates.map((s:any) => `'${s}'`).toString() + ")"
      }),
      excludedEffect: "opacity(0.6)",
      includedEffect: "saturate(100%)"// drop-shadow(1px, 1px, 2px, gray)"
    })
  }

  let { year, party } = getUrlParams();
  setSelectedParty(party || "all");
  setSelectedYear(year || 2020);
  updateLayers({ year: selectedYear, party: selectedParty });

  view.map.add(stateElectoralResultsLayer);
  view.map.add(countyChangeLayer);

  yearSlider.watch("values", ([ year ]) => {
    setSelectedYear(year);
    updateLayers({year, party: selectedParty });
  });

  if(isMobileBrowser()){
    view.constraints.minScale *= 1.5;
  }

})();

function isMobileBrowser() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||(window as any).opera);
  return check;
};

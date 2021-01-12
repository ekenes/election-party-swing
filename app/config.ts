import Color = require("esri/Color");
import Slider = require("esri/widgets/Slider");
import { RendererParams } from "./rendererUtils";


// function to retrieve query parameters (in this case only id)
interface UrlParams {
  year?: 2004 | 2008 | 2012 | 2016 | 2020 | number,
}

const validYears = [ 2000, 2004, 2008, 2012, 2016, 2020 ];

function getUrlParams() {
  const queryParams = document.location.search.substr(1);
  let result: UrlParams = {};

  queryParams.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = parseInt(decodeURIComponent(item[1]));
  });

  return result.year;
}

// function to set an id as a url param
export function setUrlParams(year: UrlParams["year"]) {
  window.history.pushState("", "", `${window.location.pathname}?year=${year}`);
}

let year = getUrlParams();

export const yearSlider = new Slider({
  container: document.getElementById("slider"),
  min: 2004,
  max: 2020,
  visibleElements: {
    labels: false
  },
  labelInputsEnabled: false,
  rangeLabelInputsEnabled: false,
  steps: 4,
  tickConfigs: [{
    mode: "position",
    values: [ 2004, 2008, 2012, 2016, 2020 ],
    labelsVisible: true
  }]
});

if(!year){
  year = 2020;
  setUrlParams(year);
  yearSlider.values = [ year ];
} else {
  if ( year && validYears.indexOf(year) === -1 ){
    alert("You must enter a valid U.S. presidential election year (e.g. 2004, 2008, 20012, 2016, 2020)")
    year = 2020;
    setUrlParams(year);
  }
  yearSlider.values = [ year ];
}

export const basemapPortalItem = "fbfb62f3599f41e5a77845f863e2872f";
export const countiesLayerPortalItem = "fe9e032e4a854c74890750214a3edd8b";

export const maxScale = 4622324/16;
export const referenceScale = 2311162;
export const scaleThreshold = 9244600;  // 9244649;

export let selectedYear = year;
export let selectedParty: RendererParams["party"] = "all";

export function setSelectedParty(party: RendererParams["party"]){
  selectedParty = party;
  // const btn = document.getElementById(party) as HTMLButtonElement;
  const btns = Array.from(document.getElementsByTagName("button"));
  btns.forEach(btn => {
    if(party === btn.id){
      btn.classList.remove(`${btn.id}-inactive`);
      btn.classList.add(`${party}-active`);
    } else {
      btn.classList.remove(`${btn.id}-active`);
      btn.classList.add(`${btn.id}-inactive`);
    }
  });
  // if(btn.classList.contains(`${party}-inactive`)){
  //   btn.classList.remove(`${party}-inactive`);
  //   btn.classList.add(`${party}-active`);
  // }
}

export let years = {
  previous: selectedYear - 4,
  next: selectedYear
};

export let fieldInfos = {
  title: {
    state: `{state}`,
    county: `{county} County, {state}`
  },
  democrat: {
    county: {
      previous: {
        name: `dem_${years.previous}`,
        label: `${years.previous} Democrat votes`
      },
      next: {
        name: `dem_${years.next}`,
        label: `${years.next} Democrat votes`
      },
    },
    state: {
      previous: {
        name: `SUM_dem_${years.previous}`,
        label: `${years.previous} Democrat votes`
      },
      next: {
        name: `SUM_dem_${years.next}`,
        label: `${years.next} Democrat votes`
      }
    }
  },
  republican: {
    county: {
      previous: {
        name: `rep_${years.previous}`,
        label: `${years.previous} Republican votes`
      },
      next: {
        name: `rep_${years.next}`,
        label: `${years.next} Republican votes`
      }
    },
    state: {
      previous: {
        name: `SUM_rep_${years.previous}`,
        label: `${years.previous} Republican votes`
      },
      next: {
        name: `SUM_rep_${years.next}`,
        label: `${years.next} Republican votes`
      }
    }
  },
  other: {
    county: {
      previous: {
        name: `oth_${years.previous}`,
        label: `${years.previous} Other votes`
      },
      next: {
        name: `oth_${years.next}`,
        label: `${years.next} Other votes`
      }
    },
    state: {
      previous: {
        name: `SUM_oth_${years.previous}`,
        label: `${years.previous} Other votes`
      },
      next: {
        name: `SUM_oth_${years.next}`,
        label: `${years.next} Other votes`
      }
    }
  },
  normalizationFields: {
    county: {
      previous: `TOTAL_STATE_VOTES_${years.previous}`,
      next: `TOTAL_STATE_VOTES_${years.next}`
    },
    state: {
      previous: ``,
      next: ``
    }
  }
};

// Renderer config

export const rColor = new Color("rgba(220, 75, 0, 1)");
export const dColor = new Color("rgba(60, 108, 204,1)");
export const oColor = new Color("rgba(181, 166, 0, 1)");
export const haloColor = new Color("#f7f7f7");
export const haloSize = 1;

export function setSelectedYear(year: UrlParams["year"]) {
  selectedYear = year;

  years = {
    previous: selectedYear - 4,
    next: selectedYear
  };

  fieldInfos = {
    title: {
      state: `{state}`,
      county: `{county} County, {state}`
    },
    democrat: {
      county: {
        previous: {
          name: `dem_${years.previous}`,
          label: `${years.previous} Democrat votes`
        },
        next: {
          name: `dem_${years.next}`,
          label: `${years.next} Democrat votes`
        },
      },
      state: {
        previous: {
          name: `SUM_dem_${years.previous}`,
          label: `${years.previous} Democrat votes`
        },
        next: {
          name: `SUM_dem_${years.next}`,
          label: `${years.next} Democrat votes`
        }
      }
    },
    republican: {
      county: {
        previous: {
          name: `rep_${years.previous}`,
          label: `${years.previous} Republican votes`
        },
        next: {
          name: `rep_${years.next}`,
          label: `${years.next} Republican votes`
        }
      },
      state: {
        previous: {
          name: `SUM_rep_${years.previous}`,
          label: `${years.previous} Republican votes`
        },
        next: {
          name: `SUM_rep_${years.next}`,
          label: `${years.next} Republican votes`
        }
      }
    },
    other: {
      county: {
        previous: {
          name: `oth_${years.previous}`,
          label: `${years.previous} Other votes`
        },
        next: {
          name: `oth_${years.next}`,
          label: `${years.next} Other votes`
        }
      },
      state: {
        previous: {
          name: `SUM_oth_${years.previous}`,
          label: `${years.previous} Other votes`
        },
        next: {
          name: `SUM_oth_${years.next}`,
          label: `${years.next} Other votes`
        }
      }
    },
    normalizationFields: {
      county: {
        previous: `TOTAL_STATE_VOTES_${years.previous}`,
        next: `TOTAL_STATE_VOTES_${years.next}`
      },
      state: {
        previous: ``,
        next: ``
      }
    }
  };
}
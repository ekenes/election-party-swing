import Color = require("esri/Color");
import Slider = require("esri/widgets/Slider");
import { RendererParams } from "./rendererUtils";

const validYears = [ 2000, 2004, 2008, 2012, 2016, 2020 ];
const validParties = [ "rep", "dem", "oth", "all" ];

export let selectedYear: number;
export let selectedParty: RendererParams["party"];

export function getUrlParams() {
  const queryParams = document.location.search.substr(1);
  let result: RendererParams = {};

  queryParams.split("&").forEach(function(part) {
    var item = part.split("=");
    var paramName = item[0];
    result[item[0]] = paramName === "year" ? parseInt(decodeURIComponent(item[1])) : decodeURIComponent(item[1]);
  });

  return result;
}

// function to set an id as a url param
export function setUrlParams(params: RendererParams) {
  let { year, party } = params;
  year = year || selectedYear;
  party = party || selectedParty;
  window.history.pushState("", "", `${window.location.pathname}?year=${year}&party=${party}`);
}

let { year, party } = getUrlParams();

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
  setUrlParams({year});
  yearSlider.values = [ year ];
} else {
  if ( year && validYears.indexOf(year) === -1 ){
    alert("You must enter a valid U.S. presidential election year (e.g. 2004, 2008, 20012, 2016, 2020)")
    year = 2020;
    setUrlParams({year});
  }
  yearSlider.values = [ year ];
}

if(!party){
  party = "all";
  setUrlParams({ party });
} else {
  if ( party && validParties.indexOf(party) === -1 ){
    alert("You must enter a valid party (e.g. 'rep', 'dem', 'oth', 'all')")
    party = "all";
    setUrlParams({party});
  }
}

export const basemapPortalItem = "fbfb62f3599f41e5a77845f863e2872f";
export const statesLayerPortalItem = "f2825b56dfc14bb892604637dab45104";
export const countiesLayerPortalItem = "fe9e032e4a854c74890750214a3edd8b";

export const maxScale = 4622324/16;
export const referenceScale = 2311162;
export const scaleThreshold = 9244600;  // 9244649;

export function setSelectedParty(party: RendererParams["party"]){
  selectedParty = party;
  setUrlParams({ party });
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

export function setSelectedYear(year: RendererParams["year"]) {
  selectedYear = year;
  setUrlParams({ year });
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


export const results = {
  2000: {
    republican: {
      candidate: "Bush",
      electoralVotes: 271
    },
    democrat: {
      candidate: "Gore",
      electoralVotes: 266
    },
    other: {
      candidate: "Other",
      electoralVotes: 0
    }
  },
  2004: {
    republican: {
      candidate: "Bush",
      electoralVotes: 286
    },
    democrat: {
      candidate: "Kerry",
      electoralVotes: 251
    },
    other: {
      candidate: "Other",
      electoralVotes: 0
    },
    swingstates: [ "New Hampshire", "Iowa", "New Mexico", "Florida" ]
  },
  2008: {
    republican: {
      candidate: "McCain",
      electoralVotes: 173
    },
    democrat: {
      candidate: "Obama",
      electoralVotes: 365
    },
    other: {
      candidate: "Other",
      electoralVotes: 0
    },
    swingstates: [ "Nevada", "Iowa", "New Mexico", "Colorado", "Indiana", "Ohio", "Virginia", "North Carolina", "Florida" ]
  },
  2012: {
    republican: {
      candidate: "Romney",
      electoralVotes: 206
    },
    democrat: {
      candidate: "Obama",
      electoralVotes: 332
    },
    other: {
      candidate: "Other",
      electoralVotes: 0
    },
    swingstates: [ "Indiana", "North Carolina" ]
  },
  2016: {
    republican: {
      candidate: "Trump",
      electoralVotes: 304
    },
    democrat: {
      candidate: "Clinton",
      electoralVotes: 227
    },
    other: {
      candidate: "Other",
      electoralVotes: 0
    },
    swingstates: [ "Iowa", "Wisconsin", "Michigan", "Ohio", "Pennsylvania", "Florida" ]
  },
  2020: {
    republican: {
      candidate: "Trump",
      electoralVotes: 232
    },
    democrat: {
      candidate: "Biden",
      electoralVotes: 306
    },
    other: {
      candidate: "Other",
      electoralVotes: 0
    },
    swingstates: [ "Arizona", "Wisconsin", "Michigan", "Pennsylvania", "Georgia" ]
  }
}

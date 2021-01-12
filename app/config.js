define(["require", "exports", "esri/Color", "esri/widgets/Slider"], function (require, exports, Color, Slider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validYears = [2000, 2004, 2008, 2012, 2016, 2020];
    function getUrlParams() {
        var queryParams = document.location.search.substr(1);
        var result = {};
        queryParams.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = parseInt(decodeURIComponent(item[1]));
        });
        return result.year;
    }
    // function to set an id as a url param
    function setUrlParams(year) {
        window.history.pushState("", "", window.location.pathname + "?year=" + year);
    }
    exports.setUrlParams = setUrlParams;
    var year = getUrlParams();
    exports.yearSlider = new Slider({
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
                values: [2004, 2008, 2012, 2016, 2020],
                labelsVisible: true
            }]
    });
    if (!year) {
        year = 2020;
        setUrlParams(year);
        exports.yearSlider.values = [year];
    }
    else {
        if (year && validYears.indexOf(year) === -1) {
            alert("You must enter a valid U.S. presidential election year (e.g. 2004, 2008, 20012, 2016, 2020)");
            year = 2020;
            setUrlParams(year);
        }
        exports.yearSlider.values = [year];
    }
    exports.basemapPortalItem = "fbfb62f3599f41e5a77845f863e2872f";
    exports.countiesLayerPortalItem = "fe9e032e4a854c74890750214a3edd8b";
    exports.maxScale = 4622324 / 16;
    exports.referenceScale = 2311162;
    exports.scaleThreshold = 9244600; // 9244649;
    exports.selectedYear = year;
    exports.selectedParty = "all";
    function setSelectedParty(party) {
        exports.selectedParty = party;
        // const btn = document.getElementById(party) as HTMLButtonElement;
        var btns = Array.from(document.getElementsByTagName("button"));
        btns.forEach(function (btn) {
            if (party === btn.id) {
                btn.classList.remove(btn.id + "-inactive");
                btn.classList.add(party + "-active");
            }
            else {
                btn.classList.remove(btn.id + "-active");
                btn.classList.add(btn.id + "-inactive");
            }
        });
        // if(btn.classList.contains(`${party}-inactive`)){
        //   btn.classList.remove(`${party}-inactive`);
        //   btn.classList.add(`${party}-active`);
        // }
    }
    exports.setSelectedParty = setSelectedParty;
    exports.years = {
        previous: exports.selectedYear - 4,
        next: exports.selectedYear
    };
    exports.fieldInfos = {
        title: {
            state: "{state}",
            county: "{county} County, {state}"
        },
        democrat: {
            county: {
                previous: {
                    name: "dem_" + exports.years.previous,
                    label: exports.years.previous + " Democrat votes"
                },
                next: {
                    name: "dem_" + exports.years.next,
                    label: exports.years.next + " Democrat votes"
                },
            },
            state: {
                previous: {
                    name: "SUM_dem_" + exports.years.previous,
                    label: exports.years.previous + " Democrat votes"
                },
                next: {
                    name: "SUM_dem_" + exports.years.next,
                    label: exports.years.next + " Democrat votes"
                }
            }
        },
        republican: {
            county: {
                previous: {
                    name: "rep_" + exports.years.previous,
                    label: exports.years.previous + " Republican votes"
                },
                next: {
                    name: "rep_" + exports.years.next,
                    label: exports.years.next + " Republican votes"
                }
            },
            state: {
                previous: {
                    name: "SUM_rep_" + exports.years.previous,
                    label: exports.years.previous + " Republican votes"
                },
                next: {
                    name: "SUM_rep_" + exports.years.next,
                    label: exports.years.next + " Republican votes"
                }
            }
        },
        other: {
            county: {
                previous: {
                    name: "oth_" + exports.years.previous,
                    label: exports.years.previous + " Other votes"
                },
                next: {
                    name: "oth_" + exports.years.next,
                    label: exports.years.next + " Other votes"
                }
            },
            state: {
                previous: {
                    name: "SUM_oth_" + exports.years.previous,
                    label: exports.years.previous + " Other votes"
                },
                next: {
                    name: "SUM_oth_" + exports.years.next,
                    label: exports.years.next + " Other votes"
                }
            }
        },
        normalizationFields: {
            county: {
                previous: "TOTAL_STATE_VOTES_" + exports.years.previous,
                next: "TOTAL_STATE_VOTES_" + exports.years.next
            },
            state: {
                previous: "",
                next: ""
            }
        }
    };
    // Renderer config
    exports.rColor = new Color("rgba(220, 75, 0, 1)");
    exports.dColor = new Color("rgba(60, 108, 204,1)");
    exports.oColor = new Color("rgba(181, 166, 0, 1)");
    exports.haloColor = new Color("#f7f7f7");
    exports.haloSize = 1;
    function setSelectedYear(year) {
        exports.selectedYear = year;
        exports.years = {
            previous: exports.selectedYear - 4,
            next: exports.selectedYear
        };
        exports.fieldInfos = {
            title: {
                state: "{state}",
                county: "{county} County, {state}"
            },
            democrat: {
                county: {
                    previous: {
                        name: "dem_" + exports.years.previous,
                        label: exports.years.previous + " Democrat votes"
                    },
                    next: {
                        name: "dem_" + exports.years.next,
                        label: exports.years.next + " Democrat votes"
                    },
                },
                state: {
                    previous: {
                        name: "SUM_dem_" + exports.years.previous,
                        label: exports.years.previous + " Democrat votes"
                    },
                    next: {
                        name: "SUM_dem_" + exports.years.next,
                        label: exports.years.next + " Democrat votes"
                    }
                }
            },
            republican: {
                county: {
                    previous: {
                        name: "rep_" + exports.years.previous,
                        label: exports.years.previous + " Republican votes"
                    },
                    next: {
                        name: "rep_" + exports.years.next,
                        label: exports.years.next + " Republican votes"
                    }
                },
                state: {
                    previous: {
                        name: "SUM_rep_" + exports.years.previous,
                        label: exports.years.previous + " Republican votes"
                    },
                    next: {
                        name: "SUM_rep_" + exports.years.next,
                        label: exports.years.next + " Republican votes"
                    }
                }
            },
            other: {
                county: {
                    previous: {
                        name: "oth_" + exports.years.previous,
                        label: exports.years.previous + " Other votes"
                    },
                    next: {
                        name: "oth_" + exports.years.next,
                        label: exports.years.next + " Other votes"
                    }
                },
                state: {
                    previous: {
                        name: "SUM_oth_" + exports.years.previous,
                        label: exports.years.previous + " Other votes"
                    },
                    next: {
                        name: "SUM_oth_" + exports.years.next,
                        label: exports.years.next + " Other votes"
                    }
                }
            },
            normalizationFields: {
                county: {
                    previous: "TOTAL_STATE_VOTES_" + exports.years.previous,
                    next: "TOTAL_STATE_VOTES_" + exports.years.next
                },
                state: {
                    previous: "",
                    next: ""
                }
            }
        };
    }
    exports.setSelectedYear = setSelectedYear;
});
//# sourceMappingURL=config.js.map
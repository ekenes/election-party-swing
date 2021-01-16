define(["require", "exports", "esri/Color", "esri/widgets/Slider"], function (require, exports, Color, Slider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validYears = [2000, 2004, 2008, 2012, 2016, 2020];
    var validParties = ["rep", "dem", "oth", "all"];
    function getUrlParams() {
        var queryParams = document.location.search.substr(1);
        var result = {};
        queryParams.split("&").forEach(function (part) {
            var item = part.split("=");
            var paramName = item[0];
            result[item[0]] = paramName === "year" ? parseInt(decodeURIComponent(item[1])) : decodeURIComponent(item[1]);
        });
        return result;
    }
    exports.getUrlParams = getUrlParams;
    // function to set an id as a url param
    function setUrlParams(params) {
        var year = params.year, party = params.party;
        year = year || exports.selectedYear;
        party = party || exports.selectedParty;
        window.history.pushState("", "", window.location.pathname + "?year=" + year + "&party=" + party);
    }
    exports.setUrlParams = setUrlParams;
    var _a = getUrlParams(), year = _a.year, party = _a.party;
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
        setUrlParams({ year: year });
        exports.yearSlider.values = [year];
    }
    else {
        if (year && validYears.indexOf(year) === -1) {
            alert("You must enter a valid U.S. presidential election year (e.g. 2004, 2008, 20012, 2016, 2020)");
            year = 2020;
            setUrlParams({ year: year });
        }
        exports.yearSlider.values = [year];
    }
    if (!party) {
        party = "all";
        setUrlParams({ party: party });
    }
    else {
        if (party && validParties.indexOf(party) === -1) {
            alert("You must enter a valid party (e.g. 'rep', 'dem', 'oth', 'all')");
            party = "all";
            setUrlParams({ party: party });
        }
    }
    exports.basemapPortalItem = "fbfb62f3599f41e5a77845f863e2872f";
    exports.statesLayerPortalItem = "f2825b56dfc14bb892604637dab45104";
    exports.countiesLayerPortalItem = "fe9e032e4a854c74890750214a3edd8b";
    exports.maxScale = 4622324 / 16;
    exports.referenceScale = 2311162;
    exports.scaleThreshold = 9244600; // 9244649;
    function setSelectedParty(party) {
        exports.selectedParty = party;
        setUrlParams({ party: party });
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
        setUrlParams({ year: year });
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
    exports.results = {
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
            }
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
            }
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
            }
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
            }
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
            }
        }
    };
});
//# sourceMappingURL=config.js.map
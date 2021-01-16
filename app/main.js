var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Expand", "esri/views/layers/support/FeatureEffect", "esri/views/layers/support/FeatureFilter", "./config", "./rendererUtils", "./legendUtils", "./popupUtils", "esri/geometry"], function (require, exports, EsriMap, MapView, FeatureLayer, Expand, FeatureEffect, FeatureFilter, config_1, rendererUtils_1, legendUtils_1, popupUtils_1, geometry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        function updateLayers(params) {
            var party = params.party;
            stateElectoralResultsLayer.set({
                portalItem: {
                    id: config_1.statesLayerPortalItem
                },
                title: "Results by state",
                opacity: 1,
                renderer: rendererUtils_1.stateElectoralResultsRenderer(),
                popupTemplate: popupUtils_1.statePopupTemplate()
            });
            countyChangeLayer.set({
                portalItem: {
                    id: config_1.countiesLayerPortalItem
                },
                legendEnabled: false,
                renderer: party && party !== "all" ? rendererUtils_1.countyChangePartyRenderer(params) : rendererUtils_1.countyChangeAllRenderer(params),
                labelsVisible: false,
                popupTemplate: popupUtils_1.countyPopupTemplate()
            });
            legendUtils_1.createLegend({
                layer: countyChangeLayer,
                view: view,
                year: config_1.selectedYear,
                party: config_1.selectedParty
            });
            legendUtils_1.updateResultsDisplay(config_1.selectedYear);
            updateSwingStates();
        }
        function updateSwingStates() {
            return __awaiter(this, void 0, void 0, function () {
                var stateLayerView, dem_n, dem_p, rep_n, rep_p, oth_n, oth_p, where;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.whenLayerView(stateElectoralResultsLayer)];
                        case 1:
                            stateLayerView = _a.sent();
                            dem_n = config_1.fieldInfos.democrat.state.next.name;
                            dem_p = config_1.fieldInfos.democrat.state.previous.name;
                            rep_n = config_1.fieldInfos.republican.state.next.name;
                            rep_p = config_1.fieldInfos.republican.state.previous.name;
                            oth_n = config_1.fieldInfos.other.state.next.name;
                            oth_p = config_1.fieldInfos.other.state.previous.name;
                            where = "\n\n      (\n        ((" + rep_n + " > " + dem_n + ") AND (" + rep_n + " > " + oth_n + ") AND (" + rep_p + " > " + dem_p + ") AND (" + rep_p + " > " + oth_p + ")) OR\n        ((" + dem_n + " > " + rep_n + ") AND (" + dem_n + " > " + oth_n + ") AND (" + dem_p + " > " + rep_p + ") AND (" + dem_p + " > " + oth_p + ")) OR\n        ((" + oth_n + " > " + dem_n + ") AND (" + oth_n + " > " + rep_n + ") AND (" + oth_p + " > " + dem_p + ") AND (" + oth_p + " > " + rep_p + "))\n      )\n    ";
                            //  AND (${oth_n} IS NOT NULL AND ${oth_n} != 0) AND (${oth_p} IS NOT NULL AND ${oth_n} != 0))
                            console.log(where);
                            stateLayerView.effect = new FeatureEffect({
                                filter: new FeatureFilter({
                                    where: where
                                }),
                                includedEffect: "opacity(0.15)",
                                excludedEffect: "hue-rotate(-20deg) saturate(100%) drop-shadow(5px, 5px, 10px, black) opacity(0.6)"
                            });
                            countyChangeLayer.blendMode = "multiply";
                            return [2 /*return*/];
                    }
                });
            });
        }
        var map, initialExtent, view, commonLayerOptions, countyChangeLayer, stateElectoralResultsLayer, btns, _a, year, party;
        return __generator(this, function (_b) {
            map = new EsriMap({
                basemap: {
                    portalItem: {
                        id: config_1.basemapPortalItem
                    }
                }
            });
            initialExtent = new geometry_1.Extent({
                spatialReference: {
                    wkid: 102100
                },
                xmin: -14827488,
                ymin: 2871580,
                xmax: -7008078,
                ymax: 6990447
            });
            view = new MapView({
                container: "viewDiv",
                map: map,
                extent: initialExtent,
                scale: config_1.referenceScale * 8,
                constraints: {
                    minScale: 24992582 * 2,
                    maxScale: config_1.maxScale,
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
                view: view,
                expanded: true,
                content: document.getElementById("infoDiv"),
                expandIconClass: "esri-icon-sliders"
            }), "top-right");
            view.ui.add(new Expand({
                view: view,
                expanded: !isMobileBrowser(),
                content: document.getElementById("legend-container"),
                expandIconClass: "esri-icon-chart"
            }), "bottom-left");
            commonLayerOptions = {
                outFields: ["*"]
            };
            countyChangeLayer = new FeatureLayer(commonLayerOptions);
            stateElectoralResultsLayer = new FeatureLayer(commonLayerOptions);
            btns = Array.from(document.getElementsByTagName("button"));
            btns.forEach(function (btn) {
                btn.addEventListener("click", function () {
                    config_1.setSelectedParty(btn.id);
                    updateLayers({
                        year: config_1.selectedYear,
                        party: config_1.selectedParty
                    });
                });
            });
            _a = config_1.getUrlParams(), year = _a.year, party = _a.party;
            config_1.setSelectedParty(party || "all");
            config_1.setSelectedYear(year || 2020);
            updateLayers({ year: config_1.selectedYear, party: config_1.selectedParty });
            view.map.add(stateElectoralResultsLayer);
            view.map.add(countyChangeLayer);
            config_1.yearSlider.watch("values", function (_a) {
                var year = _a[0];
                config_1.setSelectedYear(year);
                updateLayers({ year: year, party: config_1.selectedParty });
            });
            if (isMobileBrowser()) {
                view.constraints.minScale *= 1.5;
            }
            return [2 /*return*/];
        });
    }); })();
    function isMobileBrowser() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
    ;
});
//# sourceMappingURL=main.js.map
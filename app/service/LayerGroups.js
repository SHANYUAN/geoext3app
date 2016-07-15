"use strict";
var wmsPath = "http://haefen.i3mainz.hs-mainz.de" + "/geoserver/SPP/wms?";
var proxyPath = "http://haefen.i3mainz.hs-mainz.de/GeojsonProxy/layer?";
var mapboxAccessToken = "pk.eyJ1Ijoic2hhbnl1YW4iLCJhIjoiY2lmcWd1cnFlMDI0dXRqbHliN2FzdW9kNyJ9.wPkC7amwS2ma4qKWmmWuqQ";

/**
 * returns the image url for a specific layer
 */
function getLegendImg(layer, height, width) {
    height = height || 25;
    width = width || 25;
    return wmsPath + "REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=" + width + "&TRANSPARENT=true&HEIGHT=" + height + "&LAYER=" + layer +
                    "&legend_options=fontName:Arial;fontAntiAliasing:true;fontSize:6;dpi:180";
}

/**
 * singleton classes get created when they are defined. no need to Ext.create them.
 * access them via the class-name directly. e.g. LayerStyles.bluePoints
 * variable is globally available
 */
Ext.define("LayerGroups", {
    singleton: true,

    requires: [
        //"Layers",
        "LayerStyles"
    ],

    wmsPath: "http://haefen.i3mainz.hs-mainz.de" + "/geoserver/SPP/wms?",

    layers: {

        spp: new ol.layer.Vector({
            name: "SPP: Harbours",
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function(extent) {
                    return proxyPath +
                            "bereich=" + "SPP" +
                            "&layer=" + "spp_harbours_intern" +
                            "&bbox=" + extent.join(",") +
                            "&epsg=" + "4326";
                },
                strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                    maxZoom: 19
                })),
                wrapX: false  // dont repeat on X axis
            }),
            //style: LayerStyles.redPoints,
            legendUrl: getLegendImg("SPP:spp_harbours_intern"),
            style: LayerStyles.pointTypeStyleFunction, //LayerStyles.redPointLabelStyleFunction,
            description: "Data of the spp projects",
            visible: true
        }),

        sppOpen: new ol.layer.Vector({
            name: "SPP: Harbours (open)",
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function(extent) {
                    return proxyPath +
                            "bereich=" + "SPP" +
                            "&layer=" + "spp_harbours_open" +  // spp_harbours_open
                            "&bbox=" + extent.join(",") +
                            "&epsg=" + "4326";
                },
                strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                    maxZoom: 19
                })),
                wrapX: false  // dont repeat on X axis
            }),
            //style: LayerStyles.redPoints,
            legendUrl: getLegendImg("SPP:spp_harbours_intern"),
            style: LayerStyles.pointTypeStyleFunction, //LayerStyles.redPointLabelStyleFunction,
            description: "Data of the spp projects open to anyone interested.",
            visible: true
        }),

        agIntern: new ol.layer.Group({
            layers: [],
            name: "Project Internal",
            visible: false
        }),

        hydrology: new ol.layer.Group({
            name: "Hydrology",
            layers: new ol.Collection([

                new ol.layer.Tile({
                    name: "Lakes",  // title
                    source: new ol.source.TileWMS({
                        url: wmsPath,
                        params: {"LAYERS": "SPP:lakes", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    description: "Lakes.",
                    visible: false
                }),

                new ol.layer.Tile({
                    name: "Streams",  // title
                    source: new ol.source.TileWMS({
                        url: wmsPath,
                        params: {"LAYERS": "SPP:streams", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    description: "Streams.",
                    visible: false
                }),

                new ol.layer.Vector({
                    name: "Eckholdt 1980",
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: function(extent) {
                            return proxyPath +
                                    "bereich=" + "SPP" +
                                    "&layer=" + "Fluesse_Eckholdt" +
                                    "&bbox=" + extent.join(",") +
                                    "&epsg=" + "4326";
                        },
                        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                            maxZoom: 19
                        })),
                        wrapX: false  // dont repeat on X axis
                    }),
                    style: LayerStyles.eckholdtStyleFunction,
                    description: "Description Eckhold 1980",
                    visible: false
                }),

                new ol.layer.Tile({
                    name: "OpenSeaMap",
                    source: new ol.source.XYZ({
                        url: "http://t1.openseamap.org/seamark/{z}/{x}/{y}.png",
                        attributions: [new ol.Attribution({
                            html: "© <a href='http://www.openseamap.org/'>OpenSeaMap</a>"
                        })]
                    }),
                    legendUrl: "http://wiki.openseamap.org/images/thumb/e/ec/MapFullscreen.png/400px-MapFullscreen.png",
                    visible: false
                })
            ]),
            visible: false
        }),

        awmc: new ol.layer.Group({
            name: "AWMC",
            layers: new ol.Collection([
                new ol.layer.Tile({
                    name: "Basemap",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.map-knmctlkh/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                        wrapDateLine: true,
                        transitionEffect: "resize",
                        attribution: "Tiles &copy; <a href='http://mapbox.com/' target='_blank'>MapBox</a> | " +
                            "Data &copy; <a href='http://www.openstreetmap.org/' target='_blank'>OpenStreetMap</a> and contributors, CC-BY-SA |"+
                            " Tiles and Data &copy; 2013 <a href='http://www.awmc.unc.edu' target='_blank'>AWMC</a>" +
                            " <a href='http://creativecommons.org/licenses/by-nc/3.0/deed.en_US' target='_blank'>CC-BY-NC 3.0</a>"
                    }),

                    description: "The AWMC base map. In addition to imagery derived from OSM and Mapbox, this map has the Inland Water, River Polygons, Water Course Center Lines, Base Open Water Polygons, supplemental water polygons (not listed below, for areas far outside of the scope of the Barrington Atlas ) layers. Please see the individual listings below for data citations. It is suitable for most applications when left on its own, or  in combination with water polygons for a particular time period (archaic, Roman, etc).",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Coast Outline",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.eoupu8fr/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Roads",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.awmc-roads/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Benthos Water",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.s5l5l8fr/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Inland Water",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.awmc-inland-water/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "River Polygons",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.9e3lerk9/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Significant rivers, generally following the Barrington Atlas with additions from VMap0 and OSM and further work by the AWMC.",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Water Course Center Lines",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.awmc-water-courses/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Lines following ancient rivers, generally following the Barrington Atlas with additions from VMap0 and OSM and further work by the AWMC.",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Base Open Water Polygons",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.h0rdaemi/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Water polygons, generally following the Barrington Atlas with additions from VMap0 and OSM and further work by the AWMC. These are shared by all time periods.",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Archaic water",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.yyuba9k9/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Water polygons which differ for the Archaic period only, generally following the Barrington Atlas with further work by the AWMC.",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Classical water",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.l5xc4n29/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Water polygons which differ for the Classical period only, generally following the Barrington Atlas with further work by the AWMC.",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Hellenistic Water",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.gq0ssjor/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Water polygons which differ for the Hellenistic period only, generally following the Barrington Atlas with further work by the AWMC.",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Roman water",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.ymnrvn29/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Water polygons which differ for the Roman period only, generally following the Barrington Atlas with further work by the AWMC.",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Late Antiquity water",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/isawnyu.t12it3xr/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                    }),
                    description: "Water polygons which differ for the Late Antiquity period only, generally following the Barrington Atlas with further work by the AWMC.",
                    visible: false
                })
            ])
        }),

        darmc: new ol.layer.Group({
            //layers: Layers.darmc,
            name: "DARMC",
            layers: new ol.Collection([
                new ol.layer.Tile({
                    name: "Aqueducts",  // title
                    source: new ol.source.TileWMS({
                        url: wmsPath,
                        params: {"LAYERS": "SPP:darmc_aqueducts", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Bridges",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:darmc_bridges", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Roads",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:darmc_roads", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Cities",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:darmc_cities", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Baths",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:darmc_baths", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Ports",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:darmc_ports", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Harbours",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:darmc_harbours", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Canals",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:darmc_canals", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                })
            ]),
            visible: false
        }),

        fetch: new ol.layer.Group({
            name: "Fetch",
            layers: new ol.Collection([
                new ol.layer.Tile({
                    name: "Adria 45°(NE)",  // title
                    source: new ol.source.TileWMS({
                        url: wmsPath,
                        params: {"LAYERS": "SPP:fetch_045", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    description: "Fetch description!",
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Adria 90°(E)",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:fetch_090", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Adria 135°(SE)",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:fetch_135", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Adria 180°(S)",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:fetch_180", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Adria 225°(SW)",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:fetch_225", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Adria 270°(W)",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:fetch_270", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Adria 315°(NW)",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:fetch_315", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                }),
                new ol.layer.Tile({
                    name: "Adria 360°(N)",  // title
                    source: new ol.source.TileWMS({
                        url: this.wmsPath,
                        params: {"LAYERS": "SPP:fetch_360", "TILED": true},
                        serverType: "geoserver",
                        wrapX: false   // dont repeat on X axis
                    }),
                    //legendUrl = this.getLegendImg(legendName);
                    visible: false
                })
            ]),
            visible: false
        }),

        basemaps: new ol.layer.Group({
            name: "Basemaps",
            layers: new ol.Collection([

                new ol.layer.Tile({
                    name: "Mapbox OSM",
                    source: new ol.source.XYZ({
                        url: "http://api.tiles.mapbox.com/v4/shanyuan.cifqgurif027ut0lxxf08w6gz/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken,
                        attributions: [new ol.Attribution({
                            html: "© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> " +
                                "© <a href='http://www.openstreetmap.org/copyright'>" +
                                "OpenStreetMap contributors</a>"
                        })]
                    }),
                    legendUrl: "https://otile4-s.mqcdn.com/tiles/1.0.0/osm/4/4/7.jpg",
                    visible: true
                }),

                new ol.layer.Tile({
                    name: "MapQuest Satelite",
                    source: new ol.source.MapQuest({
                        layer: "sat",
                        wrapX: false
                    }),
                    legendUrl: "https://otile4-s.mqcdn.com/tiles/1.0.0/sat/4/4/7.jpg",
                    visible: false
                })

            ])
        }),

    },

    getLayerGroupByName: function(name) {
        for (var key in this.layers) {
            var group = this.layers[key];
            if (group instanceof ol.layer.Group) {
                if (group.get("name") === name) {
                    return group;
                }
            }
        }
    },

    /**
     * returns the layer based on the provided name.
     * this function is used to restore the origin layer's source.
     * multiple layers with the same name will not work
     */
    getLayerByName: function(layerName) {
        var result = [];

        for (var key in this.layers) {
            var group = this.layers[key];

            if (group instanceof ol.layer.Group) {  // is group
                var layers = group.getLayers();

                //var result = [];
                layers.forEach(function(layer) {
                    if (layer.get("name") === layerName) {
                        result.push(layer);
                    }
                })
            } else {  // single layer
                if (group.get("name") === layerName) {
                    result.push(group);
                }
            }


        }

        if (result.length > 1) {
            throw "Multiple layers with name: " + layerName + " found!";
        }
        return result[0];
    }

});

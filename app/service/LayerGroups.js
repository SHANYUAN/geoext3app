"use strict";
/**
 * singleton classes get created when they are defined. no need to Ext.create them.
 * access them via the class-name directly. e.g. LayerStyles.bluePoints
 * variable is globally available
 */
Ext.define("LayerGroups", {
    singleton: true,

    requires: [
        "Layers"
    ],

    spp: new ol.layer.Group({
        layers: Layers.spp,  // ol.collection
        name: "SPP",
        visible: true
    }),

    sppOpen: new ol.layer.Group({
        layers: Layers.sppOpen,
        name: "SPP (open)",
        visible: true
    }),

    agIntern: new ol.layer.Group({
        layers: [],
        name: "Project Internal",
        visible: false
    }),

    hydrology: new ol.layer.Group({
        layers: Layers.hydrology,
        name: "Hydrology",
        visible: false
    }),

    barrington: new ol.layer.Group({
        layers: Layers.barrington,
        name: "Barrington Atlas",
        visible: false
    }),

    darmc: new ol.layer.Group({
        layers: Layers.darmc,
        name: "DARMC",
        visible: false
    }),

    fetch: new ol.layer.Group({
        layers: Layers.fetch,
        name: "Fetch",
        visible: false
    }),

    // sort using OL3 groups
    basemaps: new ol.layer.Group({
        layers: Layers.basemaps,
        name: "Basemaps"
    })

});

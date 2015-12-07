"use strict";
// contains any view-related logic,
// event handling of the view, and any app logic. 


function getActiveLayers(onlyVectors) {
    /* returns a list of OL3 Layer objects 
    that includes all selected nodes. 
    isVector: if true, only active Vectorlayers are returned, 
    WMS layers are ommitted */
    onlyVectors = onlyVectors || false;  // set default to false

    var activeOlLayers = [];
    olMap.getLayers().forEach(function(layer, i) {
        if (layer instanceof ol.layer.Group) {  // all layers are nested inside a layergroup
            //console.log("is a layer group!"); 
            layer.getLayers().forEach(function(subLayer, j) {
                // actual layer level in this case
                //console.log("is a layer!"); 
                if (subLayer.getVisible() === true) {  // is active
                    if (onlyVectors) {
                        if (subLayer instanceof ol.layer.Vector) {  // skip WMS etcs
                            activeOlLayers.push(subLayer);
                        }  
                    } else {
                        activeOlLayers.push(subLayer);
                    } 
                }
            });
        }
    });
    return activeOlLayers;
}

function createVectorSource2(layername, filter) {
    // "http://haefen.i3mainz.hs-mainz.de/GeojsonProxy/layer?bereich=SPP&layer=road&bbox=-9.60676288604736,23.7369556427002,53.1956329345703,56.6836547851562&epsg=4326"
    filter = filter || "";

    var PROXY_URL = "http://haefen.i3mainz.hs-mainz.de/GeojsonProxy/layer?";
    var workspace = layername.split(":")[0];
    var layer = layername.split(":")[1];
    //var BBOX = "-9.60676288604736,23.7369556427002,53.1956329345703,56.6836547851562";
    var EPSG = "4326";

    var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent, resolution, projection) {
            return PROXY_URL + 
                "bereich=" + workspace + 
                "&layer=" + layer +  
                "&epsg=" + EPSG + 
                "&CQL_FILTER=" + filter;
        },
        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
            maxZoom: 19
        }))
    });
    return vectorSource;
}

function getQueryString(startDate, endDate) {
        /*
    '4th Century',   // 0, date_4_Jh
    '5th Century',   // 1
    '6th Century',   // 2
    '7th Century',   // 3
    '8th Century',   // 4
    '9th Century',   // 5
    '10th Century',  // 6
    '11th Century',  // 7
    '12th Century',  // 8
    '13th Century'   // 9  date_13_Jh // ja, nein
    */
    var startCentury = startDate + 4;
    var endCentury = endDate + 4;
    //var timeSpan = endCentury - startCentury;
    //console.log(timeSpan);

    var queryString = "";
    var counter = 0;
    for (var i = startCentury; i < endCentury + 1; i++) { 
        //console.log(i);
        if (counter === 0) {
            queryString += "date_" + i + "_Jh='ja'";
        } else {
            queryString += ";date_" + i + "_Jh='ja'";
        }
        counter += 1;  // keep track of ANDs
    } 
    return queryString;
}

Ext.define('SppAppClassic.view.main.MapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-map',

    //views: ['Map'],
    
    // get view variables 
    refs: [
        {ref: 'olMap', selector: 'olMap'},
        {ref: 'mapComponent', selector: 'mapComponent'},
        {ref: 'slider', selector: 'slider'}
    ],

    zoomIn: function() {
        var view = olMap.getView();
        var currentZoom = view.getZoom();
        view.setZoom(currentZoom + 1);
    },
    zoomOut: function() {
        var view = olMap.getView();
        var currentZoom = view.getZoom();
        view.setZoom(currentZoom - 1);
    }, 
    zoomAnimated: function() {
       var zoom = ol.animation.zoom({duration: 500, resolution: olMap.getView().getResolution()});
       //olMap.beforeRender(zoom);
       olMap.getView().setZoom(zoom);
    },

    /* zoomTomax extend -> get Center of map on start of app. 
    then set farthest zoom level */
    onCenter: function() {
        var view = olMap.getView();
        view.setCenter(MAP_CENTER);
        view.setZoom(4);
        view.setRotation(0);
    },
    onRotate: function() {
        console.log("rotate!");
        var view = olMap.getView();
        var currentRotation = view.getRotation();
        console.log(currentRotation);
        olMap.getView().setRotation(currentRotation + 0.5);
    },
    onToggleHover: function() {
        console.log("toggle hover!");
        var interactions = olMap.getInteractions();
        var selectInteraction; 
        interactions.forEach(function(interaction) {
            if (interaction instanceof ol.interaction.Select) {
                selectInteraction = interaction;
            }
        });
        // toogle on
        if (selectInteraction) {
            olMap.removeInteraction(selectInteraction);
            //Ext.getCmp("hoverButton").setText("end hover");
        // toogle off
        } else {
            var newInteraction = new ol.interaction.Select({
                condition: ol.events.condition.pointerMove  // empty -> select on click
            });
            olMap.addInteraction(newInteraction);
            //Ext.getCmp("hoverButton").setText("start hover");
        }
    },



    // slider handlers
    onSliderChangeComplete: function() {
        /* sources appear tp be empty, since they are loaded async */
        /* retrieving the previous source istn working because
        of the tile loading strategy. possible to grab features but not the
        source's parameters. therefore a new vector source has to be created each time */
        //console.log("changed slider!");

        /*
        '4th Century',   // 0, date_4_Jh
        '5th Century',   // 1
        '6th Century',   // 2
        '7th Century',   // 3
        '8th Century',   // 4
        '9th Century',   // 5
        '10th Century',  // 6
        '11th Century',  // 7
        '12th Century',  // 8
        '13th Century'   // 9  date_13_Jh // ja, nein
        */

        var startDate = slider.getValues()[0];
        var endDate = slider.getValues()[1];

        var activeLayers = getActiveLayers(true);
        var layerGroups = mapComponent.getLayers();
        layerGroups.forEach(function(layerGroup) {
            var layers = layerGroup.getLayers();
            layers.forEach(function(layer, i) {
                if (layer.getVisible()) {
                    var source = layer.getSource();
                    if (source instanceof ol.source.Vector) {  // layer has a vector source
                        // source is usually empty because of the 
                        // tile loading strategy
                        //var newSource = createVectorSource("SPP:v_public_offen", "date_4_Jh='ja'");
                        //console.log(startDate);
                        //var query = "date_6_Jh='ja'"
                        var filter = getQueryString(startDate, endDate);
                        console.log(filter);
                        var newSource = createVectorSource2("SPP:v_public_offen", filter);
                        layer.setSource(newSource);  // this refreshes automatically
                    }
                }
                
            });
        });
        
        //console.log(allLayers[1].getSource().getKeys()); 
        //console.log([1].getSource().getKeys());
        /*
        activeLayers.forEach(function(vectorLayer) {
            if (vectorLayer instanceof ol.layer.Vector) { // double check output
                var vectorSource = vectorLayer.getSource();
                if (vectorSource instanceof ol.source.Vector) { // double check output
                    console.log("has vector source!");
                    
                    console.log(vectorSource);
                    

                    //console.log(vectorSource.set(wrapX, true));
                    //console.log(vectorSource.clear(true));  // refresh layer
                    //return PROXY_URL + "bereich=" + workspace + "&layer=" + layer + "&bbox=" + extent.join(',') + "&epsg=" + EPSG;
                    
                    // set source of layer to newly created source

                    // getSource.clear(true) -> reloads layer
                    //update url of source
                }
            }
        });*/

        // filter for vectorLayers
        //console.log(currentParams);
    }

});

"use strict";

/*
function getLegendUrl(layer_name) {
    return GEOSERVER_URL + "REQUEST=GetLegendGraphic&" +
        "VERSION=1.0.0&" +
        "FORMAT=image/png&" +
        "WIDTH=50&HEIGHT=50&" +
        "TRANSPARENT=true&" +
        "LAYER=" + layer_name + "&" +
        "LEGEND_OPTIONS=" +
            "fontName:arial;" +
            "dpi:180";
}
*/
// contains any view-related logic,
// event handling of the view, and any app logic.

Ext.define("SppAppClassic.view.main.map.GeoExtMapController", {
    extend: "Ext.app.ViewController",
    alias: "controller.main-geoextmap",

    requires: [  // view not needed in requirements
        "SppAppClassic.view.main.Popup.Popup"
    ],

    // using lookupReference() instead of refs, see
    // <https://docs.sencha.com/extjs/6.0/application_architecture/view_controllers.html>

    // define listeners here instead of the view.
    // keeps view and controller logic seperated
    control: {
        "#": {  // matches the view itself
            click: "onMapClick",
            pointermove: "onPointerMove",
            destroy: "onDestroy"
        }
    },

    /**
     * show popup with feature infos when a feature is clicked.
     * checks if the clicked pixel contains a feature. if so
     * a popup window with all attributes opens.
     * by default, all visible layers will be tested
    */
    onMapClick: function(evt) {
        // this.map replaces olMap.map until GeoExt3 function exists
        var map = this.getView().map;
        var cookie = Ext.util.Cookies.get("sppCookie");
        //var pixel = map.getEventPixel(evt.originalEvent);
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                //console.log(feature.getKeys());
                return feature;
            }
        );

        var popupWindow = Ext.getCmp("popupWindow");
        // lazy instanciation
        if (!popupWindow) {
            Ext.create("SppAppClassic.store.FeatureInfos");
            /*var info = Ext.create("FeatureInfo", {
                attribute: 'original',
                value : '123'
            });*/
            //store.add(info);
            popupWindow = Ext.create("SppAppClassic.view.main.Popup.Popup");
        }

        if (feature) {   // clicked on feature

            if (cookie === "guest") {
                popupWindow.updateHTML(feature, true);
            } else {
                popupWindow.updateHTML(feature);
            }

            popupWindow.show();
            // TODO: show popup window next to feature
            //popupPanel.showAt(evt.getXY());

        } else {  // clicked somewhere else
            if (popupWindow !== undefined) {  // in case it got destroyed
                popupWindow.hide();
            }
        }
    },

    /**
     * changes mouse cursor to a "hand" when it's over a feature,
     * to indicate that the feature is clickable
    */
    onPointerMove: function(evt) {
        var map = this.getView().map;
        //var pixel = map.getEventPixel(evt.originalEvent);
        var hasFeature = map.forEachFeatureAtPixel(evt.pixel, function() {
            return true;
        });
        if (hasFeature) {
            map.getTarget().style.cursor = "pointer";
        } else {
            map.getTarget().style.cursor = "";
        }
    },

    /**
     * ensures that ol3Map is destroyed. doesnt work
     */
    onDestroy: function() {
        console.log("destroying geoextmap");
        this.getView().setMap(false);
    }
});

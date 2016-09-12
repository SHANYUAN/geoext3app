"use strict";
/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 */

Ext.define("SppAppClassic.view.main.Main", {
    extend: "Ext.panel.Panel",
    xtype: "app-main",
    reference: "mainpanel",  // used in MainController
    id: "mainpanel",
    requires: [
        "Ext.plugin.Viewport",              // plugins: "viewport"
        "SppAppClassic.view.main.LayerTree",  // xtype: "layertree",
        "SppAppClassic.view.main.MapToolbar",  // xtype: "maptoolbar"
        "GeoExt.component.Map", // xtype: "gx_component_map"
        "GeoExt.data.store.LayersTree",
        "OL3MapService",
        "ConfigService"
    ],

    controller: "main",
    //viewModel: "main",

    plugins: "viewport",
    title: ConfigService.texts.title,

    layout: {
        type: "border",
        padding: 5
    },
    border: true,

    initComponent: function () {

        // apply to layertree
        //this.setStore(treeStore);
        OL3MapService.initMap();  // TODO: set map in controller

        Ext.apply(this, {

            items: [{
                xtype: "layertree",
                region: "west",
                title: "Layers",
                //store: treeStore,
                id: "layerTree", // used to set store later
                autoScroll: true,
                width: 230,
                margin: "0 5 0 0",
            },{
                xtype: "panel",
                region: "west",
                width: 230,
                id: "descriptionPanel",
                title: "Description",
                collapsible: true,
                collapsed: true,
                //closable: true,
                closeAction: 'hide',
                margin: "0 5 0 0",
                bodyPadding: "10px"
            },{
                xtype: "filterpanel",
                region: "west",
                margin: "0 5 0 0",
                hidden: true
            },{
                xtype: "panel",
                id: "mappanel",
                region: "center",
                title: "Map",
                layout: "fit", // map fills entire panel
                items: {
                    xtype: "gx_component_map",  // GeoExt3 component
                    map: OL3MapService.getMap(),
                    id: "geoextMap"
                },
                dockedItems: {
                    xtype: "maptoolbar",
                    id: "maptoolbar"
                }
            }],

            tools: [{
                xtype: "label",
                id: "infoLabel",
                html: "News",
                style: {
                    "color": "#3892d4",
                    "font-size": "13px",
                    "font-weight": "bold",
                    "margin-right": "10px",
                    "cursor": "pointer"
                },
                listeners: {
                    element: "el", click: "onClickInfo"
                }
            },{
                xtype: "label",
                id: "logoutButtonlabel",
                style: {
                    "color": "#696969",
                    "font-size": "13px",
                    "font-weight": "normal",
                    "margin-right": "5px"
                }
            },{
                xtype: "label",
                html: "Logout",
                align: "right",
                style: {
                    "color": "#3892d4",
                    "font-size": "13px",
                    "font-weight": "bold",
                    "cursor": "pointer"
                },
                listeners: {
                    element: "el", click: "onClickLogout"
                }
            }]
        });

        SppAppClassic.view.main.Main.superclass.initComponent.call(this);
        //this.callParent();
    }

});

"use strict";

Ext.define("SppAppClassic.view.main.GridPanel", {
    extend: "Ext.grid.Panel",
    xtype: "gridpanel",
    //reference: "gridpanel",
    requires: [
        "SppAppClassic.store.Features",
        "GeoExt.grid.column.Symbolizer"
    ],
    //title: "Feature Grid",
    border: true,

    //store: Ext.data.StoreManager.lookup("featuresStore"),
    store: {type: "features"},  // reference store via its alias -> creates it
    //store: valuesStore,
    columns: [{
            xtype: "gx_symbolizercolumn",
            width: 40
        },{
            text: "Project",  // label
            dataIndex: "project",  // attribute to show
            flex: 1
        },
        {
            text: "Author",
            dataIndex: "author",
            //xtype: "numbercolumn",
            //format: "0,000",
            flex: 1
        },{
            text: "Public",
            dataIndex: "public",
            flex: 1
        },{
            text: "Status",
            dataIndex: "status",
            flex: 1
        },{
            text: "Year",
            dataIndex: "year",
            flex: 1
        },{
            text: "Country",
            dataIndex: "country",
            flex: 1
        },{
            text: "Type",
            dataIndex: "place_type",
            flex: 1
        }
    ]
});

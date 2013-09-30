var style = new ol.style.Style({rules: [
  new ol.style.Rule({
    filter: 'where == "outer"',
    symbolizers: [
      new ol.style.Stroke({
        color: ol.expr.parse('color'),
        width: 4,
        opacity: 1
      })
    ]
  }),
  new ol.style.Rule({
    filter: 'where == "inner"',
    symbolizers: [
      new ol.style.Stroke({
        color: '#013',
        width: 4,
        opacity: 1
      }),
      new ol.style.Stroke({
        color: ol.expr.parse('color'),
        width: 2,
        opacity: 1
      })
    ]
  }),
  new ol.style.Rule({
    filter: 'geometryType("point")',
    symbolizers: [
      new ol.style.Shape({
        size: 40,
        fill: new ol.style.Fill({color: '#013'})
      }),
      new ol.style.Text({
        color: '#bada55',
        text: ol.expr.parse('label'),
        fontFamily: 'Calibri,sans-serif',
        fontSize: 14
      })
    ]
  })
]});

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    //a tile grid layer for debugging purposes
//    new ol.layer.Tile({
//        source: new ol.source.TileDebug({
//            projection: 'EPSG:3857',
//            tileGrid: new ol.tilegrid.XYZ({
//                maxZoom: 22
//            })
//        })
//    }),
    new ol.layer.Tile({
       source: new ol.source.TileWMS({
          url: 'http://geoserver.rogue.lmnsolutions.com/geoserver/wms',
          params: {'LAYERS': 'geonode:centros_medicos'}
       })
    })
    ],
    controls: ol.control.defaults().extend([
        new ol.control.FullScreen(), 
        new ol.control.ZoomSlider()
    ]),
    interactions: ol.interaction.defaults().extend([
        new ol.interaction.DragRotate()
    ]),
    renderer: ol.RendererHint.CANVAS,
    target: 'map',
    view: new ol.View2D({
        center: [0, 0],
        zoom: 2
    })
});

var numBaseLayers = 3;

map.on('click', function(evt) {
    //this won't work until openlayers gets around to supporting wmsGetFeautureInfo
    console.log("map.onclick", evt.getPixel());
    map.getFeatureInfo({
        pixel: evt.getPixel(),
        success: function(featureInfo) {
            console.log("feature info ", featureInfo);
            //document.getElementById('info').innerHTML = featureInfoByLayer.join('');
        },
        error: function() {
            console.log("request failed");
        }
    });
});

var addLayer = function() {
    var layerName = $("#newLayerName").val();
    var formattedLayerName = $("#newLayerWorkspace").val() + ':' + layerName;
    
    var newLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: $("#newLayerURL").val(),
            params: {'LAYERS': formattedLayerName}
         })
      });
    console.log("new layer ", newLayer);
    map.addLayer(newLayer);
    
    $("#layerPanel-group").append(makeLayerPanel(layerName));
}

var addBaseLayer = function() {
    var layerName = $("#newBaseLayerName").val();
    var formattedLayerName = $("#newBaseLayerWorkspace").val() + ':' + layerName;
    
    /*map.addLayer(new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: $("#newBaseLayerURL").val(),
            params: {'LAYERS': formattedLayerName}
         })
      }));*/
    numBaseLayers++;
    $("#BaseLayerList").prepend(makeBaseLayer(layerName));
}

//generates the HTML for a layer panel
var makeLayerPanel = function(layerName) {
    return '<div id="layerPanel" class="panel">' +
        '<a class="panel-title panel-heading accordion-toggle collapsed" data-toggle="collapse" data-parent="#layerPanel-group" href="#' + layerName + '_panel">' +
            layerName +
        '</a>' +
        '<span class="layerSpan">' +
            '<input type="checkbox" id="' + layerName + '_checkbox"  checked="checked">' +
        '</span>' +
     
        '<div id="' + layerName + '_panel" class="panel-collapse collapse">'+
            'layer info ' +
            '<button data-toggle="button tooltip" title="Add a new feature" class="btn btn-sm btn-default">' +
                '<i class="glyphicon glyphicon-pencil"></i>' +
            '</button>' +
            '<button data-toggle="tooltip" title="Edit a feature" disabled="disabled" class="btn btn-sm btn-default">' +
                '<i class="glyphicon glyphicon-edit"></i>' +
            '</button>' +
            '<button data-toggle="tooltip" title="Save a feature" disabled="disabled" class="btn btn-sm btn-default">' +
                '<i class="glyphicon glyphicon-ok-sign"></i>' +
            '</button>' +
            '<button data-toggle="tooltip" title="Delete a feature" disabled="disabled" class="btn btn-sm btn-default">' +
                '<i class="glyphicon glyphicon-minus-sign"></i>' +
            '</button>' +
            '<button data-toggle="tooltip" title="Fix a polygon to have right angles" disabled="disabled" class="btn btn-sm btn-default">' +
                '<i class="glyphicon glyphicon-move rotate-45deg"></i>' +
            '</button>' +
        '</div>' +
    '</div>';
}

var makeBaseLayer = function(layerName) {
    return '<li id="baselayer'+ (numBaseLayers-1) +'" class="list-group-item">' +
    '<input class="pull-right" type="radio" name="baselayers" id="radio'+ numBaseLayers +'" value="option'+ numBaseLayers +'">' +
    '<input class="pull-right" type="checkbox" name="baselayers" id="checkbox'+ numBaseLayers +'" value="option'+ numBaseLayers +'" style="display: none;">' +
    layerName +
'</li>'
}

var startRemove = function() {
    var baseLayers = $("#BaseLayerList").children();
    $("#RemoveBaseButton").hide();
    $("#DeleteBaseButton").show();
    for(var index = 0; index < baseLayers.length-1; index++) {
        $("#" + baseLayers[index].children[0].id).hide();
        $("#" + baseLayers[index].children[1].id).show();
    }
}

var endRemove = function() {
    var checkedLayers = $('#BaseLayerList input[type="checkbox"]:checked'); 

    for(var index = 0; index < checkedLayers.length; index++) {
        $("#"+checkedLayers[index].id).parent().remove();
    }   
    $("#RemoveBaseButton").show();
    $("#DeleteBaseButton").hide();
    var baseLayers = $("#BaseLayerList").children();
    for(var index = 0; index < baseLayers.length-1; index++) {
        $("#" + baseLayers[index].children[0].id).show();
        $("#" + baseLayers[index].children[1].id).hide();
    }
}

var saveMap = function() {
    var mapName = $("#mapTitle").val();
    if(mapName !== "") {
        $("#MapName").text(mapName);
    }
    
    $("#mapinfo").modal('hide');
}

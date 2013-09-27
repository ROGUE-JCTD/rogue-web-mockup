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
    new ol.layer.Tile({
        source: new ol.source.TileDebug({
            projection: 'EPSG:3857',
            tileGrid: new ol.tilegrid.XYZ({
                maxZoom: 22
            })
        })
    }),
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

var saveLayer = function() {
    var layerName = $("#newLayerName").val();
    var formattedLayerName = $("#newLayerWorkspace").val() + ':' + layerName;
    
    map.addLayer(new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: $("#newLayerURL").val(),
            params: {'LAYERS': formattedLayerName}
         })
      }));
    
    $("#layerPanel-group").append(makeLayerPanel(layerName));
}

//generates the HTML for a layer panel
var makeLayerPanel = function(layerName) {
    return '<div id="layerPanel" class="panel">' +
        '<a class="panel-title panel-heading accordion-toggle collapsed" data-toggle="collapse" data-parent="#layerPanels" href="#' + layerName + '_panel">' +
            layerName +
        '</a>' +
        '<span class="layerSpan">' +
            '<input type="checkbox" id="' + layerName + '_checkbox"  checked="checked">' +
        '</span>' +
     
        '<div id="' + layerName + '_panel" class="panel-collapse collapse">'+
            'layer info' +
        '</div>' +
    '</div>';
}

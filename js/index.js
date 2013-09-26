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

var vector = new ol.layer.Vector({
  style: style,
  source: new ol.source.Vector({
    data: {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'properties': {
          'color': '#BADA55',
          'where': 'inner'
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [[-10000000, -10000000], [10000000, 10000000]]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'color': '#BADA55',
          'where': 'inner'
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [[-10000000, 10000000], [10000000, -10000000]]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'color': '#013',
          'where': 'outer'
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [[-10000000, -10000000], [-10000000, 10000000]]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'color': '#013',
          'where': 'outer'
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [[-10000000, 10000000], [10000000, 10000000]]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'color': '#013',
          'where': 'outer'
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [[10000000, 10000000], [10000000, -10000000]]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'color': '#013',
          'where': 'outer'
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [[10000000, -10000000], [-10000000, -10000000]]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'label': 'South'
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [0, -6000000]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'label': 'West'
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [-6000000, 0]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'label': 'North'
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 6000000]
        }
      }, {
        'type': 'Feature',
        'properties': {
          'label': 'East'
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [6000000, 0]
        }
      }]
    },
    parser: new ol.parser.GeoJSON(),
    projection: ol.proj.get('EPSG:3857')
  })
});

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
    vector,
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
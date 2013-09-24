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
    vector//,
    //no idea if this will work at all
//    new ol.layer.Vector({
//        source: {
//            url: "http://geoserver.rogue.lmnsolutions.com/geoserver/wfs?service=wfs&version=1.0.0&request=DescribeFeatureType&outputformat=text/xml;%20subtype=gml/3.2&typeName=geonode:centros_medicos",
//            
//        }
//    })
  ],
  controls: ol.control.defaults({
      attribution: false
    }),
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});
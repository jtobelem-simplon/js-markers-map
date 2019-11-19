import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';


var myPlace1 = new Feature({
  geometry: new Point(fromLonLat([2.4262268, 48.853031]))
});

var myStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({color: 'black'}),
    stroke: new Stroke({
      color: 'white', width: 2
    })
  })
});

myPlace1.setStyle(myStyle);

var vectorSource = new VectorSource({
  features: [myPlace1]
});

var vectorLayer = new VectorLayer({
  source: vectorSource
});

var rasterLayer = new TileLayer({
  source: new OSM()
});

var map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: fromLonLat([2.896372, 44.60240]),
    zoom: 1
  })
});

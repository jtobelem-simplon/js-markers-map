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


var markersTableBody;

var requestURL = 'json/markers.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text';
request.send();

request.onload = function() {
  markersTableBody = document.getElementById("markers-table");
  console.log(markersTableBody)
  // var markersText = '{"ressourceName": "Locaux Simplon","markers": [{"id": 1,"nom": "Local A","lat": 48.854474,"lon": 2.435905}]}';
  var markersText = request.response
  console.log(markersText)
  var markersJson = JSON.parse(markersText);
  populateTable(markersJson);
}

var featureStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({color: 'black'}),
    stroke: new Stroke({
      color: 'white', width: 2
    })
  })
});

function populateTable(jsonObj) {
  var markers = jsonObj['markers'];
  var features = [];

  for(var i = 0; i < markers.length; i++) {

    var tr = document.createElement('tr');
    var th = document.createElement('th');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');

    th.textContent = markers[i].id;
    td1.textContent = markers[i].nom;
    td2.textContent = markers[i].lat;
    td3.textContent = markers[i].lon;
    
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    markersTableBody.appendChild(tr);
    
    var place = new Feature({
      geometry: new Point(fromLonLat([markers[i].lon, markers[i].lat]))
    });
    
    place.setStyle(featureStyle);
    features.push(place);
  }
 
var vectorSource = new VectorSource({
  features: features
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
    center: fromLonLat([2.3510768, 48.8567879]),
    zoom: 12
  })
});
}


import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

var features = [];
var map;
var markerListJson = [];
var currentIdx = 0;

const featureStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: 'black' }),
    stroke: new Stroke({
      color: 'white', width: 2
    })
  })
});


function initMap() {
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
};

function loadJson() {
  if (localStorage.getItem('markerList') != null) {
    markerListJson = JSON.parse(localStorage.getItem('markerList'));

    populateTable();
    initMap();
  }
  else {
    var requestURL = 'json/markers.json';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'text';
    request.send();

    request.onload = function () {
      var markersText = request.response
      markerListJson = JSON.parse(markersText);

      localStorage.setItem('markerList', JSON.stringify(markerListJson));

      populateTable();
      initMap();
    }

  }
};

function initButtonAction() {
  document.getElementById('ajouter-point').addEventListener('click', function (event) {

    ajouterMarker()


  });

}

window.onload = function () {
  loadJson();
  initButtonAction();
}

function ajouterMarker() {
  const marker = {
    id: currentIdx++,
    nom: document.getElementById("inputNom").value,
    lat: document.getElementById("inputLat").value,
    lon: document.getElementById("inputLon").value
  }
  markerListJson['markers'].push(marker);

  localStorage.setItem('markerList', JSON.stringify(markerListJson));
}

function creerLigne(id, nom, lat, lon) {
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');

  th.textContent = id;
  th.setAttribute('scope', 'row');
  td1.textContent = nom;
  td2.textContent = lat;
  td3.textContent = lon;

  tr.appendChild(th);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  document.getElementById("markers-table-body").appendChild(tr);
}

function creerPoint(lon, lat) {
  var place = new Feature({
    geometry: new Point(fromLonLat([lon, lat]))
  });

  place.setStyle(featureStyle);
  features.push(place);
}

function populateTable() {
  var markers = markerListJson['markers'];

  for (var i = 0; i < markers.length; i++) {
    if (markers[i].id > currentIdx) {
      currentIdx = markers[i].id+1;
    }
    creerLigne(markers[i].id, markers[i].nom, markers[i].lat, markers[i].lon);
    creerPoint(markers[i].lon, markers[i].lat);
  }

}

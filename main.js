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
var markerListJson = [];
var currentIdx = 0;

/**
 * le style utilisé pour afficher les points
 */
const featureStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: 'black' }),
    stroke: new Stroke({
      color: 'white', width: 2
    })
  })
});

/**
 * le style utilisé pour afficher le milieu
 */
const midPointStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: 'red' }),
    stroke: new Stroke({
      color: 'white', width: 2
    })
  })
});

/**
 * Crée une carte avec deux couches, osm (open street map) et une couche pour les points
 */
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

/**
 * Charge la liste de markers depuis le localStorage si elle existe, sinon charge le fichier json/markers.json
 */
function loadJson() {
  if (localStorage.getItem('markerList') != null) {
    markerListJson = JSON.parse(localStorage.getItem('markerList'));

    remplirTable();
    initMap();
  }
  else {
    var requestURL = 'json/markers.json';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'text';
    request.send();

    // action à réaliser lorsque le fichier à fini d'être chargé (action asynchrone)
    request.onload = function () {
      var markersText = request.response
      markerListJson = JSON.parse(markersText);

      localStorage.setItem('markerList', JSON.stringify(markerListJson));

      remplirTable();
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

/**
 * Crée un nouveau marker à partir du formulaire
 */
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

/**
 * Ajoute une ligne au tableau
 */
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

/**
 * Ajoute un point sur la carte
 */
function creerPoint(lon, lat, isMidPoint) {
  var place = new Feature({
    geometry: new Point(fromLonLat([lon, lat]))
  });

  console.log(isMidPoint);

  if (isMidPoint) {
    place.setStyle(midPointStyle);
  }
  else {
    place.setStyle(featureStyle);
  }

  features.push(place);
}

/**
 * Parcourt la liste des markers pour remplir la table et la carte
 */
function remplirTable() {
  var markers = markerListJson['markers'];

  for (var i = 0; i < markers.length; i++) {
    if (markers[i].id > currentIdx) {
      currentIdx = markers[i].id+1;
    }
    creerLigne(markers[i].id, markers[i].nom, markers[i].lat, markers[i].lon);
    creerPoint(markers[i].lon, markers[i].lat, false);
  }

  trouverMilieu();

}


function trouverMilieu() {
  var markers = markerListJson['markers'];
  
  var sumLon = 0;
  var sumLat = 0;

  for (var i = 0; i < markers.length; i++) {
    sumLon = sumLon + Number(markers[i].lon);
    sumLat = sumLat + Number(markers[i].lat);
  }

  var avgLon = sumLon/markers.length;
  var avgLat = sumLat/markers.length;

  creerPoint(avgLon, avgLat, true);

}

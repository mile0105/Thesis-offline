/*import 'ol/ol.css';
import {Map, View, Feature} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import {fromLonLat} from "ol/proj";
import {Vector} from "ol/source";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import {readPoints, readStations} from "./readService";
import {floodFill} from "./floodfill";
import {getMaxPollutionFromStations, getNearestPointPosition} from "./helper";
*/
const init = () => {

  // Initialize here for use with styling function:
  var maxValue=50;

  function PM10StyleFunction(feature, resolution)
  {
    var featureColor = null;
    var value = feature.pm10; //feature.get('pm10');

    var pixVal = Math.round((value / maxValue)* 255);
    //console.log(value+","+pixVal+","+maxValue);

    return [new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: [pixVal, pixVal, pixVal, 0.5],
        }),
        stroke: new ol.style.Stroke({
          color: [pixVal, pixVal, pixVal, 0.5]
        }),
        radius: 4.0
      })
    })];
  }

  var vectorLayer = new ol.layer.VectorImage({
    source: new ol.source.Vector(),
    style: PM10StyleFunction

  });


  const reductionFactor = 4;
  const rawPoints = readPoints();
  const points = reducePoints(rawPoints, reductionFactor);
  const stations = readStations();

  let interpolatedPoints = [];

  //let max = getMaxPollutionFromStations(stations);
  maxValue = getMaxPollutionFromStations(stations);

  // const station = stations[1];
  for (let station of stations) {
    const nearestPointPositions = getNearestPointPosition(points, station);

    const i = nearestPointPositions[0];
    const j = nearestPointPositions[1];

    floodFill(points, station, i, j, maxValue, reductionFactor);
  }

  for (let point of points.flat()) {
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([point.x, point.y])
      ),
    });
    //feature.pm10 = Math.round((point.pm10 / max)* 255);
    feature.pm10 = point.pm10;
    vectorLayer.getSource().addFeature(feature);
  }

  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vectorLayer,
    ],
    view: new ol.View({
      //center: ol.proj.fromLonLat([centerPoint.x, centerPoint.y]),
      center: ol.proj.fromLonLat([18.5, 54.5]),
      zoom: 10,
      maxZoom: 15,
    })
  });
  map.render();

  // Function which logs the clicked point:
  map.on('click', function(evt) {
    displayFeatureInfo(evt.pixel,evt.coordinate);
  });

  var displayFeatureInfo = function(pixel,coord) {

    var feature = map.forEachFeatureAtPixel(pixel, function(feature,layer) {
      return feature;
    });
    if (feature===undefined)
      return;

    console.log(feature)
  };

};


init();

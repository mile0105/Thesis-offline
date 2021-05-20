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
  const points = readPoints();
  const stations = readStations();
  let interpolatedPoints = [];

  let max = getMaxPollutionFromStations(stations);

  for (let station of stations) {
    const nearestPointPositions = getNearestPointPosition(points, station);

    const i = nearestPointPositions[0];
    const j = nearestPointPositions[1];

    floodFill(points, station, i, j, max);
  }

  for (let point of points.flat()) {
    interpolatedPoints.push({
      x: point.x,
      y: point.y,
      pm10: point.pm10 * 255 / max,
    })
  }

  let features = [];
  const N = interpolatedPoints.length;

  const centerPoint = interpolatedPoints[N - 1];

  for (let point of interpolatedPoints) {
    const pm10 = point.pm10;

    const feature = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([point.x, point.y])
      ),
    });


    //NOTE: if I uncomment these next part, the browser doesn't load, probably because it does not have much power


    /*
    feature.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: [pm10, pm10, pm10, 0.6],//`rgba(${pm10},${pm10},${pm10},0.6)`,
        }),
        stroke: new ol.style.Stroke({
          color: [pm10, pm10, pm10, 0.6]
        }),
        radius: 0.1
      })}));


     */
    features.push(feature);
  }

  // if I uncomment the next part it will not work and the points would not be shown
/*
  const layerStyle = new ol.style.Style({

    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.6)',
    }),
    symbol: {
      symbolType: 'square',
      size: [
        'interpolate',
        ['exponential', 4],
        ['zoom'],
        2, 1,
        15, 60
      ],
      color: ['interpolate',
        [
          'exponential',
          0.5
        ],
        [
          'get',
          'color'
        ],
        0,
        "#000000",
        255,
        "#ffffff"
      ],
      rotateWithView: false,
      offset: [0, 0],
      opacity: 80
    }
  });
*/
  const vector = new ol.source.Vector({features: []});

  vector.addFeatures(features);

  const vectorLayer = new ol.layer.Vector({
    source: vector,
    // style: layerStyle,
  });

  const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vectorLayer,
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([centerPoint.x, centerPoint.y]),
      zoom: 10,
      maxZoom: 13,
    })
  });
  map.render();

};

init();


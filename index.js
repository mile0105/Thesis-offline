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
// readStationValues('3426');
// };

  // Initialize here for use with styling function:
  var maxValue=50;

  function interpolateBetweenColors(lower, higher, percentage) {
    let newColor = [];
    const colorValues = ['r', 'g', 'b'];

    for(let i = 0; i< colorValues.length; i++) {
      newColor.push(Math.round(lower[i] + (higher[i] - lower[i]) * percentage));
    }
    //push transparency
    newColor.push(0.5);
    return newColor;
  }

  function getColor(pm10Value) {
    const green = [0, 255, 0, 0.5];
    const yellow = [255, 255, 0, 0.5];
    const orange = [255, 165, 0, 0.5];
    const red = [255, 0, 0, 0.5];
    const purple = [255, 0, 255, 0.5];

    if (pm10Value <= 0) {
      return green;
    }

    if (pm10Value <= 5) {
      return interpolateBetweenColors(green, yellow, pm10Value/5.0);
    }

    if (pm10Value <= 13) {
      return interpolateBetweenColors(yellow, orange, pm10Value/13.0);
    }

    if (pm10Value <= 20) {
      return interpolateBetweenColors(orange, red, pm10Value/20.0);
    }

    if (pm10Value <= 27) {
      return interpolateBetweenColors(red, purple, pm10Value/27.0);
    }
    return purple;
  }

  function PM10StyleFunction(feature, resolution)
  {

    const color = getColor(feature.pm10);

    return [new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: color,
        }),
        stroke: new ol.style.Stroke({
          color: color,
        }),
        radius: 4.0
      })
    })];
  }

  var vectorLayer = new ol.layer.VectorImage({
    source: new ol.source.Vector(),
    style: PM10StyleFunction

  });


  var currentTime = performance.now();
  const reductionFactor = 4;
  const rawPoints = readPoints();
  const points = reducePoints(rawPoints, reductionFactor);
  const stations = readStations();


  var endTime = performance.now();
  var timeDiff = endTime - currentTime;
  console.log('Time taken for reading: ' + timeDiff);

  currentTime = performance.now();
  //let max = getMaxPollutionFromStations(stations);
  maxValue = getMaxPollutionFromStations(stations);

  // const station = stations[1];
  for (let station of stations) {
    const nearestPointPositions = getNearestPointPosition(points, station);
    const windSpeed = station.windSpeed < 1.5? 0: station.windSpeed * 100;
    const windDirection = station.windDirection;

    const i = nearestPointPositions[0];
    const j = nearestPointPositions[1];

    floodFill(points, station, i, j, reductionFactor, windSpeed, windDirection);
  }

  endTime = performance.now();
  timeDiff = endTime - currentTime;
  console.log('Time taken for flood fill: ' + timeDiff);


  /*
    let nearest = getNearestPointPosition(points, {x: 18.649663, y: 54.348544});
    console.log('Gdansk Ogarna: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.632915, y: 54.355141});
    console.log('Gdansk Plowce: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.628761, y: 54.350052});
    console.log('Gdansk Sowinskiego: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.669877, y: 54.335507});
    console.log('Gdansk Miodowa: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.608072, y: 54.343086});
    console.log('Gdansk Wojskiego: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.61919, y: 54.373334});
    console.log('Gdansk Wroblewskiego: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.620274, y: 54.380279});
    console.log('Gdansk Hallera: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.601374, y: 54.380845});
    console.log('Gdansk Grunwaldska: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.572048, y: 54.351835});
    console.log('Gdansk Mysliwska: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.657497, y: 54.400833});
    console.log('Gdansk Wyzwolenia: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.669095, y: 54.400224});
    console.log('Gdansk Dokerow: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.564008, y: 54.409756});
    console.log('Gdansk Rybinskiego: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.57884, y: 54.43451});
    console.log('Sopot Bitwy Pod Plocami: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.57384, y: 54.435716});
    console.log('Sopot Stefana Okrzei: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.549042, y: 54.488887});
    console.log('Gdynia Powstania Styczniowego: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.518305, y: 54.485285});
    console.log('Gdynia Kaliska: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.464911, y: 54.465758});
    console.log('Gdynia Szafranowa: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.538648, y: 54.521331});
    console.log('Gdynia Starowiejska: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.465553, y: 54.541957});
    console.log('Gdynia Gniewska: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.493331, y: 54.560836});
    console.log('Gdynia Porebskiego: ' + points[nearest[0]][nearest[1]].pm10);

    nearest = getNearestPointPosition(points, {x: 18.472139, y: 54.557894});
    console.log('Gdynia Niklowa: ' + points[nearest[0]][nearest[1]].pm10);
  */
  currentTime = performance.now();

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

  endTime = performance.now();
  timeDiff = endTime - currentTime;
  console.log('Time taken for rendering: ' + timeDiff);
};


init();

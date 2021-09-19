//import {matrixDistance} from "./helper";

const BASE_DECREASING_FACTOR = 0.4;
let windSpeedCoefficient = - 1;
let windDirectionCoefficient = 'P';
const heightAllowanceFactor = 50;
const windOppositeDirectionCoefficient = 2;
const shouldCheckWind = false;

const floodFill = (points, station, stationI, stationJ, reductionFactor, windSpeed, windDirection) => {

  const traversed = new Set();
  const fillQueue = [];
  const decreasingFactor=BASE_DECREASING_FACTOR*reductionFactor;
  windDirectionCoefficient = windDirection;
  windSpeedCoefficient = windSpeed;
  const stationHeight = points[stationI][stationJ].z;
  const stationPm10Value = station.pm10Value;

  fillQueue.push([stationI, stationJ, stationPm10Value]);

  while (fillQueue.length > 0) {

    const [i, j, pm10] = fillQueue.shift();

    if (i < 0 || j < 0 || i > points.length - 1 || j > points[0].length - 1) {
      continue; //we reached a wall
    }

    if (traversed.has(`[${i}][${j}]`)) {
      continue;
    }

    const x = points[i][j].x;
    const y = points[i][j].y;
    const z = points[i][j].z;

    let pm10Value = stationHeight + heightAllowanceFactor >= z && pm10 > 0 ? pm10: 0;

    pm10Value = getBiggerNumber(points[i][j].pm10, pm10Value);
    points[i][j] = {
      x: x,
      y: y,
      z: z,
      pm10: pm10Value,
    };

    traversed.add(`[${i}][${j}]`);


    let upPmValue = pm10Value - decreasingFactor;
    let downPmValue = pm10Value - decreasingFactor;
    let leftPmValue = pm10Value - decreasingFactor;
    let rightPmValue = pm10Value - decreasingFactor;

    if (shouldCheckWind && windSpeedCoefficient-- > 0) {
      switch (windDirection) {
        case 'E': {
          rightPmValue = pm10Value;
          leftPmValue/=windOppositeDirectionCoefficient;
          break;
        }
        case 'S': {
          downPmValue = pm10Value;
          upPmValue/=windOppositeDirectionCoefficient;
          break;
        }
        case 'N': {
          upPmValue = pm10Value;
          downPmValue/=windOppositeDirectionCoefficient;
          break;
        }
        case 'W': {
          leftPmValue = pm10Value;
          rightPmValue/=windOppositeDirectionCoefficient;
          break;
        }
        case 'SW': {
          downPmValue = pm10Value;
          leftPmValue = pm10Value;
          upPmValue/=windOppositeDirectionCoefficient;
          rightPmValue/=windOppositeDirectionCoefficient;
          break;
        }
        case 'SE': {
          upPmValue/=windOppositeDirectionCoefficient;
          leftPmValue/=windOppositeDirectionCoefficient;
          downPmValue = pm10Value;
          rightPmValue = pm10Value;
          break;
        }
        case 'NE': {
          downPmValue/=windOppositeDirectionCoefficient;
          leftPmValue/=windOppositeDirectionCoefficient;
          upPmValue = pm10Value;
          rightPmValue = pm10Value;
          break;
        }
        case 'NW': {
          downPmValue/=windOppositeDirectionCoefficient;
          rightPmValue/=windOppositeDirectionCoefficient;
          upPmValue = pm10Value;
          leftPmValue = pm10Value;
          break;
        }

      }

    }

    fillQueue.push([i+1, j, rightPmValue]);
    fillQueue.push([i-1, j, leftPmValue]);
    fillQueue.push([i, j+1, upPmValue]);
    fillQueue.push([i, j-1, downPmValue]);

  }
};

const getBiggerNumber = (a, b) => {
  return a > b ? a : b;
};



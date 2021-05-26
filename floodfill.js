//import {matrixDistance} from "./helper";


let decreasingFactor = 0.1;
const heightAllowanceFactor = 50;

//optimize later
const floodFill = (points, station, stationI, stationJ, max, reductionFactor) => {

  const traversed = new Set();
  const fillQueue = [];
  decreasingFactor*=reductionFactor;

  const stationHeight = points[stationI][stationJ].z;
  console.log(stationHeight);
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

    fillQueue.push([i+1, j, pm10Value - decreasingFactor]);
    fillQueue.push([i-1, j, pm10Value - decreasingFactor]);
    fillQueue.push([i, j+1, pm10Value - decreasingFactor]);
    fillQueue.push([i, j-1, pm10Value - decreasingFactor]);

  }
};

const getBiggerNumber = (a, b) => {
  return a > b ? a : b;
};



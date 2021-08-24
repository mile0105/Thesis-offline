const euclideanDistance = (pointA, pointB) => {

  const a = pointA.x - pointB.x;
  const b = pointA.y - pointB.y;

  return Math.sqrt(a*a + b*b);
};

const getNearestPointPosition = (points, station) => {
  let nearestI = 0;
  let nearestJ = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      if (euclideanDistance(points[i][j], station) < euclideanDistance(points[nearestI][nearestJ], station)) {
        nearestI = i;
        nearestJ = j;
      }
    }
  }

  return [nearestI, nearestJ];
};


const getMaxPollutionFromStations = (stations) => {
  let max = stations[0].pm10Value;
  for (let station of stations) {
    if(station.pm10Value > max) {
      max = station.pm10Value;
    }
  }
  return max;
};

const reducePoints = (points, factor) => {

  let newPoints = [];

  for(let i = 0; i<points.length; i++) {

    if(i % factor === 0) {
      let line = [];
      for(let j = 0; j<points[0].length; j++) {
        if(j % factor === 0) {
          line.push(points[i][j]);
        }

      }
      newPoints.push(line);
    }


  }

  return newPoints;
};

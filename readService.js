const readStations = () => {
  const data = readFile('./files/armaag_15_06_2021_1800.geojson');
  return parseStations(data);
};

const readPoints = () => {
  const data = readFile('./files/Tricity_eudem_xyz.bin');
  const points = parsePoints(data);
  return mapToPointsMatrix(points);
};

const parsePoints = (fileData) => {
  const pointsArray = fileData.split('\n');
  pointsArray.pop(); //last element is an empty string
  const points = [];

  for (let point of pointsArray) {
    let coordinates = point.split(' ');
    points.push({
      x: parseFloat(coordinates[0]),
      y: parseFloat(coordinates[1]),
      z: parseFloat(coordinates[2])
    })
  }

  return points;
};

const mapToPointsMatrix = (points) => {
  const pointsArray = [];

  let currentList = [];

  let prevX = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < points.length; i++) {
    let x = points[i].x;
    if (x < prevX) {
      pointsArray.push(currentList);
      currentList = [];
    }
    prevX = x;
    currentList.push(points[i]);
    if (i === points.length - 1) {
      pointsArray.push(currentList);
    }
  }

  pointsArray.shift();
  return pointsArray;
};

const parseStations = (fileData) => {
  const features = JSON.parse(fileData).features;
  const stations = [];

  for (let feature of features) {

    let properties = feature.properties;
    stations.push({
      x: properties.X,
      y: properties.Y,
      pm10Value: properties.PM10_avg,
      windSpeed: properties.WS,
      windDirection: mapWindDirection(properties.WD),
    });
  }
  return stations;
};


const readFile = (fileUrl) => {
  let fileData;

  const xhrDoc = new XMLHttpRequest();
  xhrDoc.open('GET', fileUrl, false);

  xhrDoc.onreadystatechange = function () {
    if (this.readyState == 4) {

      if (this.status == 200) {
        fileData = this.response;
      }
    }
  };

  xhrDoc.send();

  return fileData;
};


const mapWindDirection = (windDirection) => {

  if (windDirection <= 30 || windDirection > 330) {
    return 'E';
  }

  if (windDirection <= 60) {
    return 'NE';
  }

  if (windDirection <= 120) {
    return 'N';
  }

  if (windDirection <= 150) {
    return 'NW';
  }

  if (windDirection <= 210) {
    return 'W';
  }

  if (windDirection <= 240) {
    return 'SW';
  }

  if (windDirection <= 300) {
    return 'S';
  }

  if (windDirection <= 330) {
    return 'SE';
  }


  return 'P';


}

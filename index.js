var londonParisRomeBerlinBucarest = [[51.507222, -0.1275], [48.8567, 2.3508],
  [41.9, 12.5], [52.516667, 13.383333], [44.4166, 26.1]];

export default function createMap({ id = 'map' }) {
  var map = new L.Map(
    id, {
      zoom: 6,
      minZoom: 3,
    });

  createTileLayer(map);
}

function createTileLayer(map) {
  var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    layer = new L.TileLayer(tileUrl,
      {
        attribution: 'Maps © <a href=\"www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
        maxZoom: 18,
      });

  map.addLayer(layer);
}

export function moveMarker({
  coordinates = londonParisRomeBerlinBucarest,
  generalDuration = 3000,
  durations = []
}) {
  var mainDurations = [generalDuration];

  if (durations.length) {
    mainDurations = durations;
  }

  map.fitBounds(coordinates);

  var movingMarker = L.Marker.movingMarker(coordinates, mainDurations, { autostart: true }).addTo(map);

  movingMarker.on('end', function () {
    movingMarker.bindPopup('<b>Welcome to Bucarest !</b>', { closeOnClick: false })
      .openPopup();
  });
}
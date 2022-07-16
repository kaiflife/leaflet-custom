export default function addClusterGroup({
  map,
  coordinates = [],
  chunkedLoading = true,
  polygonOptions = {
    stroke: true,
    color: 'red',
    weight: 4,
    opacity: 0.5,
    fill: false,
    clickable: true,
  },
}) {
  var markers = L.markerClusterGroup({ polygonOptions, chunkedLoading });
  coordinates.forEach(function (latLng) {
    markers.addLayer(L.marker(latLng));
  });
  map.addLayer(markers);
}
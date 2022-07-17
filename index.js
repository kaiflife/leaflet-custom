import CustomMap from './CustomMap';
import L from 'leaflet';

const mapInstance = new CustomMap({ mapId: 'map', L });

export function exampleCreateMarkerOnMap() {
  const { instance: markerInstance } = mapInstance.map.createMarkerOnMap({
    position: [55.22376666666667, 50.745841666666664],
    previousPosition: [53.22376666666667, 50.745841666666664],
    duration: 1000,
    icon,
  });

  setTimeout(() => mapInstance.map.updateMarker(
    markerInstance,
    { position: [53.22376666666667, 50.745841666666664], duration: 1000 },
    { position: [55, 50.74598666666667] },
  ), 1000);
}

exampleCreateMarkerOnMap();
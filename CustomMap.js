import { BaseMarker } from './BaseMarker';

export default class CustomMap {
  constructor({ mapId, L }) {
    this.map = this.createMap({ id: mapId });
    this.L = L;
  }

  // MAP
  //
  createTileLayer(map) {
    var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      layer = new this.L.TileLayer(tileUrl,
        {
          attribution: 'Maps © <a href=\"www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
          maxZoom: 18,
        });

    map.addLayer(layer);
  }

  createMap({ id = 'map' }) {
    var map = new this.L.Map(
      id, {
        zoom: 6,
        minZoom: 3,
      });

    this.createTileLayer(map);

    return map;
  }


  // TRACKED MARKER
  // https://github.com/alexandra-c/leaflet-tracking-marker
  //
  computeBearing(previousPosition = [0, 0], nexPosition) {
    let bearing = Math.atan2(nexPosition[0] - previousPosition[0], nexPosition[1] - previousPosition[1])
    bearing = bearing * (180 / Math.PI)
    bearing = (bearing + 360) % 360
    bearing = 360 - bearing
    return bearing
  }

  createMarker({ position, previousPosition, rotationAngle, ...options }) {
    const bearingAngle = rotationAngle ?? this.computeBearing(previousPosition, position)
    const instance = new BaseMarker(position, { ...options, bearingAngle })
    return { instance, context: { ...this.L.BaseMarker, overlayContainer: instance } }
  }

  createMarkerOnMap(createMarkerProps, map) {
    const newMarker = this.createMarker(createMarkerProps);
    newMarker.instance.addTo(map);
    return newMarker;
  }

  updateMarker(marker, props, prevProps) {
    const { position, previousPosition, duration, keepAtCenter, icon, zIndexOffset, opacity, draggable, rotationOrigin, rotationAngle } = props
    if (prevProps.position !== position && typeof duration == 'number') {
      marker.slideTo(position, {
        duration,
        keepAtCenter
      })
    }
    if (icon && icon !== prevProps.icon) {
      marker.setIcon(icon)
    }
    if (zIndexOffset && zIndexOffset !== prevProps.zIndexOffset) {
      marker.setZIndexOffset(zIndexOffset)
    }
    if (opacity && opacity !== prevProps.opacity) {
      marker.setOpacity(opacity)
    }
    if (marker.dragging && draggable !== prevProps.draggable) {
      if (draggable === true) {
        marker.dragging.enable()
      } else {
        marker.dragging.disable()
      }
    }
    if (rotationAngle) {
      marker.setRotationAngle(rotationAngle)
    } else if (previousPosition?.[0] !== position[0] && previousPosition?.[1] !== position[1]) {
      const bearingAngle = this.computeBearing(previousPosition, position)
      marker.setRotationAngle(bearingAngle)
    }

    if (rotationOrigin !== prevProps.rotationOrigin) {
      marker.setRotationOrigin(rotationOrigin)
    }
  }

  // Marker Cluster Group
  // https://github.com/Leaflet/Leaflet.markercluster
  //
  addClusterGroup({
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
    var markers = this.L.markerClusterGroup({ polygonOptions, chunkedLoading });
    coordinates.forEach(function (latLng) {
      markers.addLayer(this.L.marker(latLng));
    });
    this.map.addLayer(markers);
  }
}
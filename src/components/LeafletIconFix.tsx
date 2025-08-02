import { useEffect } from 'react';
import L from 'leaflet';

// Fix for default markers in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function useLeafletIconFix() {
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);
}

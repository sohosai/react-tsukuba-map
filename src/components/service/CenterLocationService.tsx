import {LatLngTuple} from "../../types";
import {useState} from "react";
import {useMap} from "react-leaflet";

export default function CenterLocationService ({latlng}: {latlng: LatLngTuple | null}) {
  if (latlng == null) {
    return null;
  }

  const [previousCenter, setPreviousCenter] = useState<LatLngTuple>([0, 0]);
  const map = useMap();
  if (previousCenter[0] !== latlng[0] || previousCenter[1] !== latlng[1]) {
    map.panTo(latlng);
    setPreviousCenter(latlng);
  }
  return null;
};
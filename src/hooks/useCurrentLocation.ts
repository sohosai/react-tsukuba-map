import {LatLngTuple} from "../types";
import {useMap} from "react-leaflet";
import {useEffect} from "react";
import {LocationEvent} from "leaflet";

export default function useCurrentLocation(onCurrentLocationChange: (_: LatLngTuple) => void) {
    const map = useMap();

    useEffect(() => {
        map.locate({watch: true, enableHighAccuracy: true})
            .on('locationfound', (e: LocationEvent) => {
                onCurrentLocationChange([e.latlng.lat, e.latlng.lng]);
            });
    }, []);
}
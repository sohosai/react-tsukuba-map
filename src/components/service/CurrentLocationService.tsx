import {useMap} from "react-leaflet";
import {useEffect} from "react";
import {LocationEvent} from "leaflet";
import {useMapContext} from "../contexts/MapContext.tsx";

export default function CurrentLocationService() {
    const map = useMap();
    const context = useMapContext();

    useEffect(() => {
        map.locate({watch: true, enableHighAccuracy: true, timeout: 800})
            .on('locationfound', (e: LocationEvent) => {
                context.setCurrentLocation([e.latlng.lat, e.latlng.lng]);
            });
    }, []);

    return null;
}
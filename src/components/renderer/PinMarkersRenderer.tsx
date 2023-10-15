import LocationMarker from "../marker/LocationMarker.tsx";
import markerIcon from "../../icons/marker.svg";
import {useMapContext} from "../contexts/MapContext.tsx";
import {useMemo} from "react";

export default function PinMarkersRenderer() {
    const context = useMapContext();
    const locations = useMemo(() => context.pins, [context.pins]);

    return (
        <>
            {locations.map((location, index) => <LocationMarker key={index} marker={{location, id: "_pin", icon: markerIcon.src, name: ""}}/>)}
        </>
    );
}
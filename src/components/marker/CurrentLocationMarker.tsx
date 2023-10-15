import {useMemo} from "react";
import L from "leaflet";
import currentLocationIcon from "../../icons/cloc.svg";
import {Marker} from "react-leaflet";
import {useMapContext} from "../contexts/MapContext.tsx";

export default function CurrentLocationMarker() {
    const context = useMapContext();

    const icon = useMemo(() => new L.Icon({
        iconUrl: currentLocationIcon,
        iconRetinaUrl: currentLocationIcon,
    }), []);
    const iconOffset = [0.00005, -0.00011];

    const location = useMemo(() => context.currentLocation, [context.currentLocation]);

    return (
        <>
            { location && <Marker position={[location[0] + iconOffset[0], location[1] - iconOffset[1]]}
                                  icon={icon} />}
        </>
    );
}

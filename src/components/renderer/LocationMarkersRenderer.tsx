import {Marker} from "../../types";
import LocationMarker from "../marker/LocationMarker.tsx";

type Props = {
    markers: Marker[]
}

export default function LocationMarkersRenderer({markers}: Props) {
    return (
        <>
            {markers.map((marker, index) => <LocationMarker key={index} marker={marker}/>)}
        </>
    );
}
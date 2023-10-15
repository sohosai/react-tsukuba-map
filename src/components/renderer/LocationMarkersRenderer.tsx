import {Marker} from "../../types";
import LocationMarker from "../marker/LocationMarker.tsx";

type Props = {
    onClick?: (id: string) => void;
    markers: Marker[]
}

export default function LocationMarkersRenderer({onClick = () => undefined, markers}: Props) {
    return (
        <>
            {markers.map((marker, index) => <LocationMarker onClick={onClick} key={index} marker={marker}/>)}
        </>
    );
}
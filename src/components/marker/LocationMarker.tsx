import {Marker as IMarker} from "../../types/index"
import {Marker} from "react-leaflet";
import L from "leaflet";
import {useMemo} from "react";

type Props = {
    onClick?: (id: string) => void;
    marker: IMarker;
}

export default function LocationMarker({onClick = () => undefined, marker}: Props) {
    const icon = useMemo(() => new L.Icon({
        iconUrl: marker.icon,
        iconRetinaUrl: marker.icon,
    }), []);

    // 0.00022, 0.00012
    return <Marker
        eventHandlers={{click: () => onClick(marker.id)}}
        position={[marker.location[0] + (marker.offset ? marker.offset[0] : 0), marker.location[1] + (marker.offset ? marker.offset[1] : 0)]}
        icon={icon}/>;
}
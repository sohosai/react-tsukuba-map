import {ExtraSpot, Spot} from "../../types";
import {spotPolygons} from "../../consts/polygons.ts";
import {Marker, Polygon, Tooltip} from "react-leaflet";
import spots from "../../consts/spots.ts";
import {useMemo} from "react";
import L from "leaflet";
import currentLocationIcon from "../../icons/cloc.svg";

type Props = {
    renderSpots?: { [spotName: string]: Spot };
    extraSpots?: ExtraSpot[];
    onClick?: (id: string) => void;
}
export default function PolygonRenderer({renderSpots = {}, extraSpots = [], onClick = () => undefined}: Props) {
    const dummyIcon = useMemo(() => new L.Icon({
        iconUrl: currentLocationIcon,
        iconRetinaUrl: currentLocationIcon,
    }), []);

    return (
        <>
            {Object.keys(renderSpots).map((spot, index) =>
                <>
                    <Polygon
                        key={index}
                        pathOptions={{
                            weight: 2,
                            fillColor: renderSpots[spot].style.color,
                            color: renderSpots[spot].style.borderColor,
                            fillOpacity: 1
                        }}
                        positions={spotPolygons[spot]}/>
                    <Marker position={spots[spot]} key={index}
                            opacity={renderSpots[spot].icon ? 1 : 0}
                            eventHandlers={{click: () => onClick(spot)}}
                            icon={renderSpots[spot].icon ? renderSpots[spot].icon : dummyIcon}>
                        <Tooltip
                            direction={'bottom'}
                            permanent={renderSpots[spot].permanent}
                        >
                            {renderSpots[spot].name}
                        </Tooltip>
                    </Marker>
                </>
            )}
            {extraSpots.map((spot, index) =>
                <>
                    <Polygon
                        key={index}
                        pathOptions={{fillColor: spot.style.color, color: spot.style.borderColor}}
                        positions={spot.polygon}/>
                    {spot.center ??
                        <Marker position={spot.center!} key={index}
                                opacity={spot.icon ? 1 : 0}
                                eventHandlers={{click: () => onClick(spot.id)}}
                                icon={spot.icon ? spot.icon : dummyIcon}>
                            <Tooltip
                                direction={'bottom'}
                                permanent={spot.permanent}
                            >
                                {spot.name}
                            </Tooltip>
                        </Marker>
                    }
                </>
            )}
        </>
    )
}
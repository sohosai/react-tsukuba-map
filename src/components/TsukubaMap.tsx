// https://stackoverflow.com/questions/53998905/bug-display-with-react-leaflet
import "leaflet/dist/leaflet.css";

import styled from "styled-components";
import {ComponentPropsWithRef} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import L from 'leaflet';
import defaultMapOption from "../consts/defaultMapOption.ts";
import {ExtraSpot, GuidanceEventHandler, LatLngTuple, MapEventHandler, MapOption, Marker, Route, Spot} from "../types";
import RouteRenderer from "./renderer/RouteRenderer.tsx";
import spots from "../consts/spots.ts";
import EventService from "./service/EventService.tsx";
import currentLocationIcon from "../icons/cloc.svg";
import CurrentLocationMarker from "./marker/CurrentLocationMarker.tsx";
import useLocationService from "../hooks/useLocationService.ts";
import CurrentLocationService from "./service/CurrentLocationService.tsx";
import CenterLocationService from "./service/CenterLocationService.tsx";
import LocationMarkersRenderer from "./renderer/LocationMarkersRenderer.tsx";
import PinMarkersRenderer from "./renderer/PinMarkersRenderer.tsx";
import RouteService from "./RouteService.tsx";
import PolygonRenderer from "./renderer/PolygonRenderer.tsx";

const Wrapper = styled.div<{ width: string, height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-483402699
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: currentLocationIcon.src,
    iconRetinaUrl: currentLocationIcon.src,
    shadowUrl: undefined,
});

type Props = {
    width: string;
    height: string;
    defaultCenterLocation?: LatLngTuple;
    option?: MapOption;
    markers?: Marker[];
    renderSpots?: {[spotName: string]: Spot};
    extraSpots?: ExtraSpot[];
    route?: Route | null;
    focusOnCurrentLocation?: boolean;
    eventHandler?: Partial<MapEventHandler>;
    guidanceEventHandler?: Partial<GuidanceEventHandler>;
} & ComponentPropsWithRef<'div'>;

export default function TsukubaMap({
                                       width,
                                       height,
                                       defaultCenterLocation,
                                       option = {},
                                       markers = [],
                                       route,
                                       renderSpots,
                                       extraSpots,
                                       focusOnCurrentLocation = true,
                                       eventHandler = {},
                                       guidanceEventHandler = {},
                                       ...props
                                   }: Props) {
    const {locationService} = useLocationService({
        focusOnCurrentLocation,
        onFocusingStatusChange: eventHandler?.onFocusingStatusChange
    });

    const _eventHandler: Partial<MapEventHandler> = {
        ...eventHandler,
        onDragStart: () => {
            locationService.onCenterLocationChanged();
            if (eventHandler.onDragStart) {
                eventHandler.onDragStart();
            }
        }
    }

    return (
        <Wrapper width={width} height={height} {...props}>
            <MapContainer style={{width: "100%", height: "100%"}}
                          center={defaultCenterLocation ?? spots["石の広場"]}
                          zoom={option?.initialZoom ?? defaultMapOption.initialZoom}
                          scrollWheelZoom={option?.enableZoomingWithWheel ?? defaultMapOption.enableZoomingWithWheel}
                          zoomControl={option?.displayZoomControl ?? defaultMapOption.displayZoomControl}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={option?.tileServer ?? defaultMapOption.tileServer as string}/>

                {/* 各種レンダラ */}
                <PolygonRenderer renderSpots={renderSpots} extraSpots={extraSpots} onClick={eventHandler?.onClickMarker}/>
                <RouteRenderer/>
                <LocationMarkersRenderer markers={markers}/>
                <PinMarkersRenderer/>

                {/* 各種マーカー */}
                <CurrentLocationMarker />

                {/* マップユーティリティ */}
                <CenterLocationService latlng={locationService.getComputedCenterLocation()}/>
                <CurrentLocationService/>
                <EventService eventHandler={_eventHandler}/>
                <RouteService route={route} eventHandler={guidanceEventHandler}/>
            </MapContainer>
        </Wrapper>
    )
}
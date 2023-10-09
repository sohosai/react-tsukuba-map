// https://stackoverflow.com/questions/53998905/bug-display-with-react-leaflet
import "leaflet/dist/leaflet.css";

import styled from "styled-components";
import {ComponentPropsWithRef} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import defaultMapOption from "../consts/defaultMapOption.ts";
import {GuidanceService, LatLngTuple, LocationService, MapEventHandler, MapOption} from "../types";
import RouteRenderer from "./renderer/RouteRenderer.tsx";
import CenterLocationUpdater from "./maputil/CenterLocationUpdater.tsx";
import spots from "../consts/spots.ts";
import EventConsumer from "./maputil/EventConsumer.tsx";

const Wrapper = styled.div<{ width: string, height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

type Props = {
  width: string;
  height: string;
  defaultCenterLocation?: LatLngTuple;
  option?: MapOption;
  guidanceService: GuidanceService;
  locationService: LocationService;
  eventHandler: MapEventHandler;
} & ComponentPropsWithRef<'div'>;

export default function TsukubaMap({
                                     width,
                                     height,
                                     defaultCenterLocation,
                                     option = {},
                                     guidanceService,
                                     locationService,
                                     eventHandler,
                                     ...props
                                   }: Props) {

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

        <RouteRenderer route={guidanceService.route}/>

        <CenterLocationUpdater latlng={locationService.getComputedCenterLocation()}/>
        <EventConsumer onClick={eventHandler.onClick} onDrag={eventHandler.onDrag}/>
      </MapContainer>
    </Wrapper>
  )
}
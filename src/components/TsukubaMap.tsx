// https://stackoverflow.com/questions/53998905/bug-display-with-react-leaflet
import "leaflet/dist/leaflet.css";

import styled from "styled-components";
import {ComponentPropsWithRef, useState} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import defaultMapOption from "../consts/defaultMapOption.ts";
import {LatLngTuple, MapOption} from "../types";
import spots from "../consts/spots.ts";

const Wrapper = styled.div<{ width: string, height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

type Props = {
  width: string;
  height: string;
  defaultPosition?: LatLngTuple,
  option?: MapOption;
} & ComponentPropsWithRef<'div'>;

export default function TsukubaMap({width, height, defaultPosition, option = {}, ...props}: Props) {
  const [position, setPosition] = useState<LatLngTuple>(defaultPosition ?? spots['石の広場']);

  return (
    <Wrapper width={width} height={height} {...props}>
      <MapContainer style={{width: "100%", height: "100%"}}
                    center={position}
                    zoom={option?.initialZoom ?? defaultMapOption.initialZoom}
                    scrollWheelZoom={option?.enableZoomingWithWheel ?? defaultMapOption.enableZoomingWithWheel}
                    zoomControl={option?.displayZoomControl ?? defaultMapOption.displayZoomControl}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={option?.tileServer ?? defaultMapOption.tileServer as string}
        />
      </MapContainer>
    </Wrapper>
  )
}
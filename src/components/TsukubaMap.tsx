import styled from "styled-components";
import {ComponentPropsWithRef} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Wrapper = styled.div<{width: string, height: string}>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

type Props = {
  width: string;
  height: string;
  initialZoom?: number;
} & ComponentPropsWithRef<'div'>;

export default function TsukubaMap({width, height, initialZoom = 19, ...props}: Props) {
  return (
    <Wrapper width={width} height={height} {...props}>
      <MapContainer style={{width: "100%", height: "100%"}} scrollWheelZoom={true} zoom={initialZoom} zoomControl={false}
                    center={[36.11108, 140.1009]}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.jp/{z}/{x}/{y}.png'
        />
      </MapContainer>
    </Wrapper>
  )
}
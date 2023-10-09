// https://stackoverflow.com/questions/53998905/bug-display-with-react-leaflet
import "leaflet/dist/leaflet.css";

import styled from "styled-components";
import {ComponentPropsWithRef} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import defaultMapOption from "../consts/defaultMapOption.ts";
import {LatLngTuple, MapOption} from "../types";
import spots from "../consts/spots.ts";
import useMapContext, {defaultMapContext, MapContext} from "../contexts/MapContext.ts";

const Wrapper = styled.div<{ width: string, height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

type Props = {
  width: string;
  height: string;

  /**
   * デフォルトの表示座標
   * デフォルト：石の広場
   */
  defaultPosition?: LatLngTuple,

  /**
   * マップオプション
   * デフォルト値は次を参照
   * @see defaultMapOption
   */
  option?: MapOption;
} & ComponentPropsWithRef<'div'>;

export default function TsukubaMap({width, height, defaultPosition, option = {}, ...props}: Props) {
  const mapContext = useMapContext(defaultPosition ?? spots["石の広場"]);

  return (
    <Wrapper width={width} height={height} {...props}>
      <MapContext.Provider value={defaultMapContext}>
        <MapContainer style={{width: "100%", height: "100%"}}
                      center={mapContext.position}
                      zoom={option?.initialZoom ?? defaultMapOption.initialZoom}
                      scrollWheelZoom={option?.enableZoomingWithWheel ?? defaultMapOption.enableZoomingWithWheel}
                      zoomControl={option?.displayZoomControl ?? defaultMapOption.displayZoomControl}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={option?.tileServer ?? defaultMapOption.tileServer as string}
          />
        </MapContainer>
      </MapContext.Provider>
    </Wrapper>
  )
}
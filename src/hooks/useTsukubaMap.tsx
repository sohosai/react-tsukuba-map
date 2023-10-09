import {ExportedLocationService, GuidanceService, LatLngTuple, MapEventHandler, MapOption} from "../types";
import React from "react";
import TsukubaMap from "../components/TsukubaMap.tsx";
import useGuidanceService from "./useGuidanceService.ts";
import useLocationService from "./useLocationService.ts";

type ArgsType = {
  mapWidth: string;
  mapHeight: string;

  /**
   * デフォルトの表示座標
   * デフォルト：石の広場
   */
  defaultCenterLocation?: LatLngTuple;

  /**
   * マップオプション
   * デフォルト値は次を参照
   * @see defaultMapOption
   */
  option?: MapOption;

  /**
   * マップクリック時のイベントハンドラ
   * @param latlng
   */
  onMapClick?: (latlng: LatLngTuple) => void;
}

type ReturnType = {
  guidanceService: GuidanceService;
  locationService: ExportedLocationService;
  MapComponent: () => React.ReactNode;
}

/**
 * マップコンポーネントやその他各種ツールを使用するためのフック
 * @param args
 */
export default function useTsukubaMap(args: ArgsType): ReturnType {
  const {locationService} = useLocationService();
  const {guidanceService} = useGuidanceService();
  const eventHandler: MapEventHandler = {
    onClick: args.onMapClick
      ? (e) => args.onMapClick!([e.latlng.lat, e.latlng.lng])
      : () => {},
    onDrag: locationService.onCenterLocationChanged
  }

  return {
    locationService: {
      currentLocation: locationService.currentLocation,
      isNavigatorServiceEnabled: locationService.isNavigatorServiceEnabled,
      focusOnCurrentLocation: locationService.focusOnCurrentLocation,
      setFocusOnCurrentLocation: locationService.setFocusOnCurrentLocation
    },
    guidanceService,
    MapComponent: () => (
      <TsukubaMap width={args.mapWidth} height={args.mapHeight} option={args.option}
                  defaultCenterLocation={args.defaultCenterLocation}
                  guidanceService={guidanceService} locationService={locationService}
                  eventHandler={eventHandler}
      />
    )
  }
}
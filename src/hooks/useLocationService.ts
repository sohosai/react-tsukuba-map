import {LatLngTuple, LocationService} from "../types";
import {useCallback, useEffect} from "react";
import {useMapContext} from "../contexts/MapContext.tsx";

type ReturnType = {
  locationService: LocationService;
}

/**
 * 現在地情報サービス
 */
type Args = {
  focusOnCurrentLocation: boolean;
  onFocusingStatusChange?: (value: boolean) => void;
}
export default function useLocationService({focusOnCurrentLocation, onFocusingStatusChange}: Args): ReturnType {
  const context = useMapContext();

  useEffect(() => {
    context.setFocusOnCurrentLocation(focusOnCurrentLocation);
  }, [focusOnCurrentLocation]);

  useEffect(() => {
    if (onFocusingStatusChange) {
      onFocusingStatusChange(context.focusOnCurrentLocation);
    }
  }, [context.focusOnCurrentLocation]);

  /**
   * マップの中心点がユーザにより変更されたときに発火
   */
  const onCenterLocationChanged = () => {
    context.setFocusOnCurrentLocation(false);
  }

  /**
   * 現在地に追従させるかどうかや現在地情報などからマップの中心点を求める
   */
  const getComputedCenterLocation = useCallback((): LatLngTuple | null => {
    return context.focusOnCurrentLocation
        ? context.currentLocation != null
            ? context.currentLocation
            : null
        : null;
  }, [context.currentLocation, context.focusOnCurrentLocation]);

  return {
    locationService: {
      onCenterLocationChanged,
      getComputedCenterLocation,
    }
  };
}
import {LatLngTuple, LocationService} from "../types";
import {useCallback, useState} from "react";
import {useMapContext} from "../components/contexts/MapContext.tsx";

type ReturnType = {
  locationService: LocationService;
}

/**
 * 現在地情報サービス
 */
export default function useLocationService(): ReturnType {
  const context = useMapContext();
  const [focusOnCurrentLocation, _setFocusOnCurrentLocation] = useState<boolean>(true);

  const setFocusOnCurrentLocation = useCallback((value: boolean) => _setFocusOnCurrentLocation(value), [focusOnCurrentLocation]);

  /**
   * マップの中心点がユーザにより変更されたときに発火
   */
  const onCenterLocationChanged = () => {
    setFocusOnCurrentLocation(false);
  }

  /**
   * 現在地に追従させるかどうかや現在地情報などからマップの中心点を求める
   */
  const getComputedCenterLocation = useCallback((): LatLngTuple | null => {
    return focusOnCurrentLocation
        ? context.currentLocation != null
            ? context.currentLocation
            : null
        : null;
  }, [context.currentLocation, focusOnCurrentLocation]);

  return {
    locationService: {
      focusOnCurrentLocation,
      setFocusOnCurrentLocation,
      onCenterLocationChanged,
      getComputedCenterLocation,
    }
  };
}
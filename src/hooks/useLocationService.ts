import {LatLngTuple, LocationService} from "../types";
import {useCallback, useState} from "react";

type ReturnType = {
  locationService: LocationService;
}

/**
 * 現在地情報サービス
 */
export default function useLocationService(): ReturnType {
  const [currentLocation, _setCurrentLocation] = useState<LatLngTuple | null>(null);
  const [isNavigatorServiceEnabled, setNavigatorServiceEnabled] = useState<boolean>(false);
  const [focusOnCurrentLocation, _setFocusOnCurrentLocation] = useState<boolean>(false);

  const setCurrentLocation = useCallback((location: LatLngTuple | null) => _setCurrentLocation(location), [currentLocation]);
  const setFocusOnCurrentLocation = useCallback((value: boolean) => _setFocusOnCurrentLocation(value), [focusOnCurrentLocation]);

  /**
   * 現在地サービスを有効化する
   */
  const setupCurrentLocationService = (): void => {
    if (!navigator.geolocation) {
      setNavigatorServiceEnabled(false);
      
    }

    navigator.geolocation.watchPosition((data) => {
      setCurrentLocation([data.coords.latitude, data.coords.longitude]);
    }, null, {
      enableHighAccuracy: true
    });
  }

  /**
   * マップの中心点がユーザにより変更されたときに発火
   */
  const onCenterLocationChanged = () => {
    setFocusOnCurrentLocation(false);
  }

  /**
   * 現在地に貼り付けるかどうかや現在地情報などからマップの中心点を求める
   */
  const getComputedCenterLocation = useCallback((): LatLngTuple | null => {
    return focusOnCurrentLocation
      ? currentLocation != null
        ? currentLocation
        : null
      : null;
  }, [currentLocation, focusOnCurrentLocation]);

  return {
    locationService: {
      currentLocation,
      isNavigatorServiceEnabled,
      focusOnCurrentLocation,
      setFocusOnCurrentLocation,
      setCurrentLocation,
      setupCurrentLocationService,
      onCenterLocationChanged,
      getComputedCenterLocation,
    }
  };
}
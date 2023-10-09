import {LatLngTuple} from "../types";
import React, {useCallback, useState} from "react";

type MapContext = {
  position: LatLngTuple;
  setPosition: (position: LatLngTuple) => void;
}

export const defaultMapContext: MapContext = {
  position: [0, 0],
  setPosition: () => {}
}

export const MapContext = React.createContext<MapContext>(defaultMapContext);

export default function useMapContext(
  defaultPosition: LatLngTuple
): MapContext {
  const [position, _setPosition] = useState<LatLngTuple>(defaultPosition);

  const setPosition = useCallback((position: LatLngTuple) => _setPosition(position), [position]);

  return {
    position, setPosition
  };
}
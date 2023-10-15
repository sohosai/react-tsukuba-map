import {LatLngTuple, Route, RouteDirection} from "../../types";
import React, {Dispatch, useCallback, useContext, useState} from "react";

export type MapContext = {
    currentLocation: LatLngTuple | null;
    setCurrentLocation: Dispatch<LatLngTuple | null>;

    pins: LatLngTuple[];
    setPins: Dispatch<LatLngTuple[]>;

    route: Route | null;
    setRoute: Dispatch<Route | null>;

    direction: RouteDirection | null;
    setDirection: Dispatch<RouteDirection | null>;

    currentNodeIndex: number | null;
    setCurrentNodeIndex: Dispatch<number | null>;
}

const defaultMapContext: MapContext = {
    currentLocation: null,
    setCurrentLocation: () => undefined,
    pins: [],
    setPins: () => undefined,
    route: null,
    setRoute: () => undefined,
    direction: null,
    setDirection: () => undefined,
    currentNodeIndex: null,
    setCurrentNodeIndex: () => undefined,
}

const MapContext = React.createContext<MapContext>(defaultMapContext);

function useMemoizedState<T>(defaultValue: T): [T, Dispatch<T>] {
    const [value, _setValue] = useState<T>(defaultValue);
    const setValue = useCallback((value: T) => _setValue(value), [value]);
    return [value, setValue];
}

const context = (): MapContext => {
    const [currentLocation, setCurrentLocation] = useMemoizedState<LatLngTuple | null>(defaultMapContext.currentLocation);
    const [pins, setPins] = useMemoizedState<LatLngTuple[]>(defaultMapContext.pins);
    const [route, setRoute] = useMemoizedState<Route | null>(defaultMapContext.route);
    const [direction, setDirection] = useMemoizedState<RouteDirection | null>(defaultMapContext.direction);
    const [currentNodeIndex, setCurrentNodeIndex] = useMemoizedState<number | null>(defaultMapContext.currentNodeIndex);

    return {
        currentLocation,
        setCurrentLocation,
        pins,
        setPins,
        route,
        setRoute,
        direction,
        setDirection,
        currentNodeIndex,
        setCurrentNodeIndex
    }
};

export const useMapContext = () => useContext(MapContext);

type Props = {
    children: React.ReactNode | React.ReactNode[];
}

export function MapContextProvider({children}: Props) {
    return (
        <MapContext.Provider value={context()}>
            {children}
        </MapContext.Provider>
    )
}
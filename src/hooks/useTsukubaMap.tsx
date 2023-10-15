import {ExtraSpot, GuidanceEventHandler, LatLngTuple, MapEventHandler, MapOption, Marker, Route, Spot} from "../types";
import React, {useMemo} from "react";
import TsukubaMap from "../components/TsukubaMap.tsx";
import {MapContextProvider} from "../contexts/MapContext.tsx";

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
     * マップイベントハンドラ
     */
    eventHandler?: MapEventHandler;

    /**
     * 経路案内イベントハンドラ
     */
    guidanceEventHandler?: GuidanceEventHandler;

    /**
     * 現在位置変更時のイベントハンドラ
     * @param value
     */
    onCurrentLocationChange?: (value: GeolocationPosition) => void;

    /**
     * 静的マーカー
     */
    markers?: Marker[];

    /**
     * 描画するスポットと描画スタイル
     */
    renderSpots?: {[spotName: string]: Spot};

    /**
     * 追加で描画するポリゴンのリスト
     */
    extraSpots?: ExtraSpot[];

    /**
     * ルート
     */
    route?: Route | null;

    /**
     * 現在地に焦点を当てるかどうか
     */
    focusOnCurrentLocation?: boolean;
}

type ReturnType = {
    MapComponent: () => React.ReactNode;
}

/**
 * マップコンポーネントやその他各種ツールを使用するためのフック
 * @param args
 */
export default function useTsukubaMap(args: ArgsType): ReturnType {
    const eventHandler = useMemo(() => {
        return {
            ...(args.eventHandler ?? {})
        }
    }, [args.eventHandler]);

    return {
        MapComponent: () => (
            <MapContextProvider>
                <TsukubaMap width={args.mapWidth} height={args.mapHeight} option={args.option}
                            defaultCenterLocation={args.defaultCenterLocation} renderSpots={args.renderSpots}
                            eventHandler={eventHandler} markers={args.markers} route={args.route} extraSpots={args.extraSpots}
                            guidanceEventHandler={args.guidanceEventHandler} focusOnCurrentLocation={args.focusOnCurrentLocation}
                />
            </MapContextProvider>
        )
    }
}
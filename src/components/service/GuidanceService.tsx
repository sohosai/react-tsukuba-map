import {useMapContext} from "../../contexts/MapContext.tsx";
import {GuidanceEventHandler, Route} from "../../types";
import {useEffect, useState} from "react";
import {getDistance, getNearbyNodeIndex, getRouteDirection, isOnPath} from "../../features/route.ts";
import {createRoute} from "../../features/guidance.ts";

type Props = {
    route?: Route | null;
    eventHandler?: Partial<GuidanceEventHandler>;
}

export default function GuidanceService({route, eventHandler = {}}: Props) {
    const context = useMapContext();
    const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(0);

    useEffect(() => {
        // ルートを設定
        context.setRoute(route != null ? route : null);

        // ルートが新しく設定されたならば最初の進行方向を設定する
        if (route) {
            context.setDirection(getRouteDirection(0, route.nodes.map((node) => node.nodeName)));
            context.setCurrentNodeIndex(0);
        } else {
            context.setDirection(null);
            context.setCurrentNodeIndex(null);
        }
    }, [route]);

    // 位置情報更新時の処理
    useEffect(() => {
        // 案内モードでない、または前回更新時より3秒経っていなければ処理しない
        if (!route || new Date().getTime() - lastUpdatedAt < 2000 || context.currentLocation == null) {
            return undefined;
        }

        (async () => {
            let r: Route = route;
            let nodes = route.nodes.map((node) => node.nodeName);
            let newCurrentNodeIndex = getNearbyNodeIndex(context.currentLocation!, nodes);
            if (!isOnPath(context.currentLocation!, newCurrentNodeIndex, nodes)) {
                r = await createRoute(context.currentLocation!, route.endNode.position);
                nodes = r.nodes.map((node) => node.nodeName);
                newCurrentNodeIndex = getNearbyNodeIndex(context.currentLocation!, nodes);

                context.setRoute(r);

                if (eventHandler?.onReSearchRoute) {
                    eventHandler.onReSearchRoute();
                }
            }

            const direction = getRouteDirection(newCurrentNodeIndex, r.nodes.map((node) => node.nodeName));
            const distance = getDistance(r.nodes[newCurrentNodeIndex].position, r.endNode.position);
            if (eventHandler?.onRouteStatusChange) {
                eventHandler.onRouteStatusChange(direction, distance);
            }

            context.setDirection(direction);
            context.setCurrentNodeIndex(newCurrentNodeIndex);
            setLastUpdatedAt(new Date().getTime());
        })();
    }, [context.currentLocation]);

    return null;
}
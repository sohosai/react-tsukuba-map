import {GuidanceService, LatLngTuple, Route, RouteDirection, RouteNode} from "../types";
import {useCallback, useEffect, useMemo, useState} from "react";
import {getNearbyNodeIndex, getRouteDirection, isOnPath, searchRoute} from "../features/route.ts";
import {MapContext} from "../components/contexts/MapContext.tsx";

type Args = {
  context: MapContext | null;
  onGuidanceFinish?: () => void;
  onReSearchRoute?: () => void;
}

type ReturnType = {
  guidanceService: GuidanceService;
};

/**
 * 経路案内サービス
 */
export default function useGuidanceService({
                                               context,
                                               onGuidanceFinish = () => {},
                                               onReSearchRoute = () => {},
                                           }: Args): ReturnType {
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(0);

  const currentLocation =
      useMemo(() => context?.currentLocation, [context, context?.currentLocation]) as LatLngTuple | null;
  const route =
      useMemo(() => context?.route, [context, context?.route]) as Route | null;
  const direction =
      useMemo(() => context?.direction, [context, context?.direction]) as RouteDirection | null;

  // 経路案内中に位置情報が更新された場合の処理
  useEffect(() => {
    // 案内モードでない、または前回更新時より3秒経っていなければ処理しない
    if (!context || !route || new Date().getTime() - lastUpdatedAt < 3000 || !currentLocation) {
      return undefined;
    }

    const nodes = route.nodes.map((node) => node.nodeName);
    const newCurrentNodeIndex = getNearbyNodeIndex(currentLocation, nodes);

    // 経路上にいなければ経路を再探索
    (async () => {
      let r: Route = route;
      if (!isOnPath(currentLocation, newCurrentNodeIndex, route.nodes.map((node) => node.nodeName))) {
        r = createRoute(route.endNode.position);
        context.setRoute(r);
        onReSearchRoute();
      }

      updateDirection(r, newCurrentNodeIndex);
      setCurrentNodeIndex(newCurrentNodeIndex);
      setLastUpdatedAt(new Date().getTime());
    })();
  }, [currentLocation]);

  // 次に進むべき方向を決定
  const updateDirection = (r?: Route, c?: number) => {
    if (!context) {
      throw Error("context is null");
    }
    context.setDirection(getRouteDirection(c ?? currentNodeIndex, ((r ?? route!).nodes.map((node) => node.nodeName))));
  }

  // ルートを探索
  const createRoute = useCallback((destLocation: LatLngTuple): Route => {
    if (!context || !currentLocation) {
      throw Error();
    }

    const searchRouteResult = searchRoute(currentLocation, destLocation ?? route!.endNode!.position);
    if (searchRouteResult == null) {
      context?.setRoute(null);
      throw Error();
    }

    const nodes: RouteNode[] = [];
    for(let i = 0; i < searchRouteResult.course.length; i++) {
      nodes.push({
        nodeName: searchRouteResult.ids[i],
        position: searchRouteResult.course[i]
      });
    }

    return {
      startNode: {
          position: searchRouteResult.course[0],
          nodeName: searchRouteResult.ids[0],
      },
      endNode: {
          position: searchRouteResult.course[searchRouteResult.course.length - 1],
          nodeName: searchRouteResult.ids[searchRouteResult.ids.length - 1],
      },
      nodes
    };
  }, [context, currentLocation, route]);

  const beginGuidanceMode = useCallback(async (destLocation: LatLngTuple) => {
    if (!context || !currentLocation) {
      stopGuidanceMode();
      throw Error("context or currentLocation is null");
    }

    const searchRouteResult = searchRoute(currentLocation, destLocation);
    if (searchRouteResult == null) {
      stopGuidanceMode();
      throw Error("cannot search the requested route");
    }

    const r: Route = createRoute(destLocation);
    setCurrentNodeIndex(getNearbyNodeIndex(currentLocation, r.nodes.map((node) => node.nodeName)))
    context.setRoute(r);
    updateDirection(r);
  }, [context, currentLocation]);

  const stopGuidanceMode = useCallback(() => {
    if (!context) {
      throw Error("context is null");
    }
    context.setRoute(null);
  }, [context]);

  const isGuidanceMode = () => route !== null;

  const isGuidanceServiceEnabled = () => context !== null && currentLocation !== null;

  return {
    guidanceService: {
      route, direction, currentNodeIndex, beginGuidanceMode, stopGuidanceMode, isGuidanceMode,isGuidanceServiceEnabled
    }
  };
}
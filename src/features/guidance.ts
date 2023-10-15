import {LatLngTuple, Route, RouteNode} from "../types";
import {searchRoute} from "./route.ts";

// ルートを探索
const createRouteInternal = (from: LatLngTuple, dest: LatLngTuple): Route => {
    const searchRouteResult = searchRoute(from, dest);
    if (searchRouteResult == null) {
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
};


export const createRoute = async (from: LatLngTuple, dest: LatLngTuple): Promise<Route> => {
    return createRouteInternal(from, dest);
}
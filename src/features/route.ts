import nodes from '../consts/nodes.json';
import graph from '../consts/map.json';
import { IGetCompareValue, MinPriorityQueue } from '@datastructures-js/priority-queue';
import {LatLngTuple, RouteDirection, RouteDirectionType, SearchRouteResult} from "../types";
import spots from "../consts/spots.ts";

interface QueueItem {
    key: string;
    value: number;
}

const searchRoute0 = (origin: LatLngTuple, dest: LatLngTuple): SearchRouteResult | null => {
    // ダイクストラ法1 初期化
    const compare: IGetCompareValue<QueueItem> = (item: QueueItem) => {
        return item.value;
    };

    const originNode = getNearbyNode(origin);
    const destNode = getNearbyNode(dest);
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string } = {};
    const queue = new MinPriorityQueue<QueueItem>(compare);

    Object.keys(nodes).forEach((value) => {
        distances[value] = Number.MAX_VALUE;
    });
    distances[originNode] = 0;

    previous[originNode] = '0';

    queue.push({ key: originNode, value: 0 });

    while (queue.size() > 0) {
        const popped = queue.pop();
        const previousDistance = popped.value;

        if (distances[popped.value] < previousDistance) continue;

        getEdge(popped.key).forEach((neighborhood) => {
            const d = getDistance(getNode(popped.key), getNode(neighborhood.toString()));
            if (distances[neighborhood.toString()] > distances[popped.key] + d) {
                distances[neighborhood.toString()] = distances[popped.key] + d;
                queue.push({ key: neighborhood.toString(), value: distances[neighborhood.toString()] });
                previous[neighborhood.toString()] = popped.key;
            }
        });
    }

    return getPath(originNode, destNode, previous);
};

const getPath = (
    originNode: string,
    destNode: string,
    previous: { [key: string]: string }
): SearchRouteResult => {
    let path = [];
    let ids = [];
    const distance = 0;

    let next = destNode;
    while (next !== originNode && next !== undefined) {
        next = previous[next];
        path.push(getNode(next));
        ids.push(next);
    }

    path = path.reverse();
    path.push(getNode(destNode));

    ids = ids.reverse();
    ids.push(destNode);

    return {
        from: getNode(originNode),
        to: getNode(destNode),
        course: path.reverse(),
        ids: ids.reverse(),
        distance,
    };
};

export const getNode = (id: string) => {
    return (nodes as { [key: string]: number[] })[id] as LatLngTuple;
};

const getEdge = (id: string) => {
    return (graph as { [key: string]: number[] })[id];
};

const getNearbyNode = (base: LatLngTuple): string => {
    let distance = Number.MAX_VALUE;
    let result = '';
    Object.keys(nodes).forEach((key) => {
        const value = (nodes as { [key: string]: number[] })[key] as LatLngTuple;
        const d = getDistance(base, value);
        if (d < distance) {
            distance = d;
            result = key;
        }
    });
    return result;
};

export const getNearbyNodeIndex = (base: LatLngTuple, nodes: Array<string>): number => {
    let distance = Number.MAX_VALUE;
    let result = 0;
    nodes.forEach((id, index) => {
        const value = getNode(id);
        const d = getDistance(base, value);
        if (d < distance) {
            distance = d;
            result = index;
        }
    });
    return result;
};

export const getNearbyNodeFrom = (base: LatLngTuple, from: Array<string>): string => {
    let distance = Number.MAX_VALUE;
    let result = '';
    from.forEach((key) => {
        const d = getDistance(base, getNode(key));
        if (d < distance) {
            distance = d;
            result = key;
        }
    });
    return result;
};

/**
 * 経路上にいるかどうか
 * @param position 現在地
 * @param nodes 経路IDs
 */
export const isOnPath = (position: LatLngTuple, currentNodeIndex: number, nodes: Array<string>): boolean => {
    if (currentNodeIndex === 0) {
        return true;
    }
    const currentNode = getNode(nodes[currentNodeIndex]);
    const previousNode = getNode(nodes[currentNodeIndex - 1]);
    const a = currentNode[0] - previousNode[0];
    const c = previousNode[1] - a * previousNode[0];
    const distance = (Math.abs(a * position[0] - position[1] + c) / Math.sqrt(Math.pow(a, 2) + 1));
    return distance < 200;  // TODO TEST
}

export const getAllDistance = (path: Array<LatLngTuple>, startNode?: LatLngTuple): number => {
    let distance = 0;
    let started = false;
    for (let i = 0; i < path.length; i++) {
        const current = path[i];
        const next = path[i + 1];
        if (!next) break;
        if (startNode && !started && current[0] === startNode[0] && current[1] === startNode[1])
            started = true;
        if (startNode && !started) continue;
        distance += getDistance(current, next);
    }
    return distance;
};

export const divideRouteBy = (
    by: LatLngTuple,
    route: LatLngTuple[]
): [LatLngTuple[], LatLngTuple[]] => {
    const first: LatLngTuple[] = [];
    const second: LatLngTuple[] = [];
    let isFirst = true;
    route.forEach((latlng) => {
        if (isFirst) {
            first.push(latlng);
            if (latlng[0] === by[0] && latlng[1] === by[1]) {
                isFirst = false;
                second.push(latlng);
            }
        } else {
            second.push(latlng);
        }
    });
    return [second.reverse(), first.reverse()];
};

export const getRouteDirection = (currentNodeIndex: number, nodes: Array<string>): RouteDirection => {
    // 次のノードとその次のノードを求める
    const next = currentNodeIndex + 1 < nodes.length ? getNode(nodes[currentNodeIndex + 1]) : null;
    const next2 = currentNodeIndex + 2 < nodes.length ? getNode(nodes[currentNodeIndex]) : null;

    // 次のノードがなければ目的地
    if (!next || !next2) {
        return toRouteDirection('end');
    }

    // 緯度・経度から距離を求める（概算）
    const distance = (from: LatLngTuple, to: LatLngTuple) => {
        return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
    };

    // 現在ノードと次のノード、および次のノードとその次のノードのなす角を求める
    // https://ngroku.com/?p=5086
    const current = getNode(nodes[currentNodeIndex]);
    const a = [next[0] - current[0], next[1] - current[1]];
    const b = [next[0] - next2[0], next[1] - next2[1]];
    const cos = (a[0] * b[0] + a[1] * b[1]) / (distance(current, next) * distance(next, next2));
    const outerZ = a[0] * b[1] - a[1] * b[0]; // 外積のZ成分を計算
    let deg = (180 * Math.acos(cos)) / Math.PI; // rad to deg
    deg = outerZ > 0 ? 360 - deg : deg; // 外積のZ成分が0以上なら左回り、そうでないなら右回り

    // 角度から方角を求める
    if (deg >= 157.5 && deg < 202.5) return toRouteDirection('top');
    else if (deg >= 112.5 && deg < 157.5) return toRouteDirection('top-right');
    else if (deg >= 202.5 && deg < 247.5) return toRouteDirection('top-left');
    else if (deg >= 67.5 && deg < 112.5) return toRouteDirection('right');
    else if (deg >= 247.5 && deg < 292.5) return toRouteDirection('left');
    else if (deg >= 22.5 && deg < 67.5) return toRouteDirection('bottom-right');
    else if (deg >= 292.5 && deg < 337.5) return toRouteDirection('bottom-left');

    return toRouteDirection('unknown');
};

const toRouteDirection = (type: RouteDirectionType) => {
    switch (type) {
        case 'top':
            return {
                type,
                name: '直進する'
            };
        case 'top-left':
            return {
                type,
                name: '左斜め前に進む'
            };
        case 'top-right':
            return {
                type,
                name: '右斜め前に進む'
            };
        case 'right':
            return {
                type,
                name: '右に進む'
            };
        case 'left':
            return {
                type,
                name: '左に進む'
            };
        case 'end':
            return {
                type,
                name: '目的地'
            };
        case 'bottom-right':
            return {
                type,
                name: '右斜め手前に進む'
            };
        case 'bottom-left':
            return {
                type,
                name: '左斜め手前に進む'
            };
    }
    return {
        type,
        name: '-'
    };
};

export const searchRoute = (
    origin: LatLngTuple,
    dest: LatLngTuple
): SearchRouteResult | null => {
    return searchRoute0(origin, dest);
};

// @return [建物名, 距離[m], 所要時間[min]]
// 歩行速度：分速80mで計算
export const getNearBuildings = (latlng: LatLngTuple): Array<[string, number, number]> => {
    const result: Array<[string, number, number]> = [];
    for (const spotKey in spots) {
        const spotLatLng = spots[spotKey];
        const distance = getDistance(latlng, spotLatLng);
        if (distance <= 150) {
            result.push([spotKey, distance, getRequiredTime(latlng, spotLatLng)]);
        }
    }
    result.sort((a, b) => (a[1] >= b[1] ? 1 : -1));
    return result;
};

export const getRequiredTime = (from: LatLngTuple, to: LatLngTuple) => {
    return getDistance(from, to) / 80;
};

export const getDistance = (from: LatLngTuple, to: LatLngTuple) => {
    return (
        Math.acos(
            Math.sin(from[1] * (Math.PI / 180)) * Math.sin(to[1] * (Math.PI / 180)) +
            Math.cos(from[1] * (Math.PI / 180)) *
            Math.cos(to[1] * (Math.PI / 180)) *
            Math.cos(to[0] * (Math.PI / 180) - from[0] * (Math.PI / 180))
        ) * 10000000
    );
};
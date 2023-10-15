import {LeafletEventHandlerFn, LeafletMouseEventHandlerFn} from "leaflet";
import {Dispatch} from "react";
import {MapContext} from "../components/contexts/MapContext.tsx";
/**
 * マップオプション
 */
type MapOption = {
  /**
   * デフォルトのズーム率
   */
  initialZoom?: number;

  /**
   * ズームボタンを表示するかどうか
   */
  displayZoomControl?: boolean;

  /**
   * マウスホイールでのズームを許可するかどうか
   */
  enableZoomingWithWheel?: boolean;

  /**
   * タイルサーバ
   */
  tileServer?: string;

  /**
   * 現在地表示を有効化するかどうか
   */
  enableCurrentLocationService?: boolean;
}

/**
 * 緯度経度
 */
type LatLngTuple = [number, number];

/**
 * 方角タイプ
 */
type RouteDirectionType =
    | 'top'
    | 'right'
    | 'left'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'end'
    | 'unknown';

/**
 * 方角
 */
type RouteDirection = {
  type: RouteDirectionType;
  name: string;
}

/**
 * 経路を表すノード
 */
type RouteNode = {
  nodeName: string;
  position: LatLngTuple;
}

/**
 * 経路探索オブジェクト
 */
type Route = {
  nodes: RouteNode[];
  startNode: RouteNode;
  endNode: RouteNode;
}

/**
 * 経路案内サービス
 */
type GuidanceService = {
  beginGuidanceMode: (destLocation: LatLngTuple) => Promise<void>;
  stopGuidanceMode: VoidFunction;
  isGuidanceMode: () => boolean;
  isGuidanceServiceEnabled: () => boolean;
  route: Route | null;
  currentNodeIndex: number| null;
  direction: RouteDirection | null;
}

type LocationService = {
  onCenterLocationChanged: () => void;
  getComputedCenterLocation: () => LatLngTuple | null;
};

type Pin = {
  id: string;
  location: LatLngTuple;
}

/**
 * マーカー
 */
type Marker = {
  icon: string;
  name: string;
  location: LatLngTuple;
  offset?: LatLngTuple;
} & Pin;

type MapEventHandler = {
  onClick: LeafletMouseEventHandlerFn;
  onClickMarker: (marker: Marker) => void;
  onDragStart: VoidFunction;
  onDragEnd: VoidFunction;
  onFocusingStatusChange: (value: boolean) => void;
}

type GuidanceEventHandler = {
  onGuidanceFinish: VoidFunction;
  onRouteDirectionChange: (direction: RouteDirection) => void;
  onReSearchRoute: VoidFunction;
}

/**
 * 経路探索
 */
type SearchRouteResult = {
  from: LatLngTuple;
  to: LatLngTuple;
  distance: number;
  course: Array<LatLngTuple>;
  ids: Array<string>;
}
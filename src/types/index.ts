import {LeafletMouseEventHandlerFn} from "leaflet";
/**
 * マップオプション
 */
export type MapOption = {
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
export type LatLngTuple = [number, number];

/**
 * 方角タイプ
 */
export type RouteDirectionType =
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
export type RouteDirection = {
  type: RouteDirectionType;
  name: string;
}

/**
 * 経路を表すノード
 */
export type RouteNode = {
  nodeName: string;
  position: LatLngTuple;
}

/**
 * 経路探索オブジェクト
 */
export type Route = {
  nodes: RouteNode[];
  startNode: RouteNode;
  endNode: RouteNode;
}

/**
 * 経路案内サービス
 */
export type GuidanceService = {
  beginGuidanceMode: (destLocation: LatLngTuple) => Promise<void>;
  stopGuidanceMode: VoidFunction;
  isGuidanceMode: () => boolean;
  isGuidanceServiceEnabled: () => boolean;
  route: Route | null;
  currentNodeIndex: number| null;
  direction: RouteDirection | null;
}

export type LocationService = {
  onCenterLocationChanged: () => void;
  getComputedCenterLocation: () => LatLngTuple | null;
};

export type Pin = {
  id: string;
  location: LatLngTuple;
}

/**
 * マーカー
 */
export type Marker = {
  icon: string;
  name: string;
  location: LatLngTuple;
  offset?: LatLngTuple;
} & Pin;

export type MapEventHandler = {
  onClick: LeafletMouseEventHandlerFn;
  onClickMarker: (id: string) => void;
  onDragStart: VoidFunction;
  onDragEnd: VoidFunction;
  onFocusingStatusChange: (value: boolean) => void;
}

export type GuidanceEventHandler = {
  onGuidanceFinish: VoidFunction;
  onRouteStatusChange: (direction: RouteDirection, distance: number) => void;
  onReSearchRoute: VoidFunction;
}

export type PolygonStyle = {
  color: string;
  borderColor: string;
}

export type Spot = {
  name: string;
  style: PolygonStyle;
  permanent?: boolean;
  icon?: L.Icon;
}

export type ExtraSpot = {
  id: string;
  center?: LatLngTuple;
  polygon: LatLngTuple[];
} & Spot;

/**
 * 経路探索
 */
export type SearchRouteResult = {
  from: LatLngTuple;
  to: LatLngTuple;
  distance: number;
  course: Array<LatLngTuple>;
  ids: Array<string>;
}
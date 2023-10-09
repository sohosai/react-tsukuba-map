import {LeafletEventHandlerFn, LeafletMouseEventHandlerFn} from "leaflet";

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
}

/**
 * 緯度経度
 */
type LatLngTuple = [number, number];

/**
 * 経路を表すノード
 */
type RouteNode = {
  nodeName: number;
  position: LatLngTuple;
}

/**
 * 経路探索オブジェクト
 */
type Route = {
  nodes: RouteNode[];
  startNode: RouteNode;
  endNode: RouteNode;
  currentNode: RouteNode;
  currentNodeIndex: number;
}

/**
 * 経路案内サービス
 */
type GuidanceService = {
  beginGuidanceMode: (destPosition: LatLngTuple) => Promise<void>;
  stopGuidanceMode: VoidFunction;
  isGuidanceMode: boolean;
  route: Route | null;
}

type ExportedLocationService = {
  currentLocation: LatLngTuple | null;
  isNavigatorServiceEnabled: boolean;
  focusOnCurrentLocation: boolean;
  setFocusOnCurrentLocation: (value: boolean) => void;
}

type LocationService = {
  setupCurrentLocationService: () => void;
  setCurrentLocation: (value: LatLngTuple | null) => void;
  onCenterLocationChanged: () => void;
  getComputedCenterLocation: () => LatLngTuple | null;
} & ExportedLocationService;

type MapEventHandler = {
  onClick: LeafletMouseEventHandlerFn;
  onDrag: LeafletEventHandlerFn;
}
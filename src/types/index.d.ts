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
}

/**
 * 緯度経度
 */
export type LatLngTuple = [number, number];
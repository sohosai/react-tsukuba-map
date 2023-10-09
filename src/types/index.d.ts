/**
 * マップオプション
 */
export type MapOption = {
  /**
   * デフォルトのズーム率
   * default: 19
   */
  initialZoom?: number;

  /**
   * ズームボタンを表示するかどうか
   * default: false
   */
  displayZoomControl?: boolean;

  /**
   * マウスホイールでのズームを許可するかどうか
   * default: true
   */
  enableZoomingWithWheel?: boolean;

  /**
   * タイルサーバ
   * default: https://{s}.tile.openstreetmap.jp/{z}/{x}/{y}.png
   */
  tileServer?: string;
}

/**
 * 緯度経度
 */
export type LatLngTuple = [number, number];
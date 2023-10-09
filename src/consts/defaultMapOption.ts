/**
 * デフォルトのマップオプション
 * @see MapOption
 */
const defaultMapOption: MapOption = {
  initialZoom: 19,
  displayZoomControl: false,
  enableZoomingWithWheel: true,
  tileServer: "https://{s}.tile.openstreetmap.jp/{z}/{x}/{y}.png"
}

export default defaultMapOption;
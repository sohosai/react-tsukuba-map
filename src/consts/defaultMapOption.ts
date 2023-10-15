import {MapOption} from "../types";

/**
 * デフォルトのマップオプション
 * @see MapOption
 */
const defaultMapOption: MapOption = {
  initialZoom: 13,
  displayZoomControl: false,
  enableZoomingWithWheel: true,
  tileServer: "https://{s}.tile.openstreetmap.jp/{z}/{x}/{y}.png",
  enableCurrentLocationService: true
}

export default defaultMapOption;
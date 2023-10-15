import {LeafletMouseEvent} from "leaflet";
import {useMapEvents} from "react-leaflet";
import {MapEventHandler} from "../../types";

type Props = {
  eventHandler: Partial<MapEventHandler>
}
export default function EventService({ eventHandler }: Props) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      if (eventHandler.onClick) {
        eventHandler.onClick(e);
      }
    },
    dragstart: () => {
      if (eventHandler.onDragStart) {
        eventHandler.onDragStart();
      }
    },
    dragend: () => {
      if (eventHandler.onDragEnd) {
        eventHandler.onDragEnd();
      }
    },
  });
  return null;
};
import {LeafletEvent, LeafletMouseEvent} from "leaflet";
import {useMapEvents} from "react-leaflet";

type Props = {
  onClick: (e: LeafletMouseEvent) => void;
  onDrag: (e: LeafletEvent) => void;
}
export default function EventConsumer({ onClick, onDrag }: Props) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => onClick(e),
    dragstart: (e: LeafletEvent) => onDrag(e),
  });
  return <></>;
};
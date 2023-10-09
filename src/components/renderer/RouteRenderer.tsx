import {Polyline} from "react-leaflet";
import {Route} from "../../types";

type Props = {
  route: Route | null;
}
export default function RouteRenderer({route}: Props) {
  return <>
    {route && <Polyline
        positions={route.nodes.map((node) => node.position).slice(0, route.currentNodeIndex)}/>}
    {route && <Polyline
        positions={route.nodes.map((node) => node.position).slice(route.currentNodeIndex, route.nodes.length)}/>}
  </>
}

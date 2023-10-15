import {Polyline} from "react-leaflet";
import {useMapContext} from "../contexts/MapContext.tsx";

export default function RouteRenderer() {
  const context = useMapContext();

  return <>
    { context.route &&
        <>
          {/* TODO 現在地以降と以前で色を分ける */}
            <Polyline
                pathOptions={{weight: 8, color: "#FF6F00"}}
                positions={context.route.nodes.map((node) => node.position)}/>
        </>
    }
  </>
}

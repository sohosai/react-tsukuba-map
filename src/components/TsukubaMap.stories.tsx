import TsukubaMap from "./TsukubaMap.tsx";
import useTsukubaMap from "../hooks/useTsukubaMap.tsx";
import {useEffect, useState} from "react";
import spots from "../consts/spots.ts";
import {Route} from "../types";
import {createRoute} from "../features/guidance.ts";

export default {
  component: TsukubaMap,
  title: "TsukubaMap",
};

type ArgsType = {
  mapWidth: string;
  mapHeight: string;
}

const Template = (props: ArgsType) => {
  const [route, setRoute] = useState<Route | null>(null);
  const {MapComponent} = useTsukubaMap({
    mapWidth: props.mapWidth,
    mapHeight: props.mapHeight,
    renderSpots: {"1a": {name: "1A棟", permanent: true, style: {color: "red", borderColor: "blue"}}},
    route
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((loc) => {
      (async () => {
        setRoute(await createRoute([loc.coords.latitude, loc.coords.longitude], spots["5c"]));
      })();
    });
  }, [])
  return <MapComponent/>;
}

export const Default = Template.bind({});
Default.args = {
  mapWidth: "800px",
  mapHeight: "500px",
};
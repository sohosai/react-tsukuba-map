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
    route
  });

  /*
  useEffect(() => {
    if (locationService.currentLocation && !guidanceService.isGuidanceMode) {
      (async () => {
        // await guidanceService.beginGuidanceMode(spots["石の広場"]);
      })();
    }
  }, [locationService.currentLocation]);
   */

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
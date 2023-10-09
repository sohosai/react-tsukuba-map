import TsukubaMap from "./TsukubaMap.tsx";
import useTsukubaMap from "../hooks/useTsukubaMap.tsx";

export default {
  component: TsukubaMap,
  title: "TsukubaMap",
};

type ArgsType = {
  mapWidth: string;
  mapHeight: string;
}

const Template = (props: ArgsType) => {
  const {MapComponent} = useTsukubaMap({
    mapWidth: props.mapWidth,
    mapHeight: props.mapHeight
  });
  return <MapComponent/>;
}

export const Default = Template.bind({});
Default.args = {
  mapWidth: "800px",
  mapHeight: "500px",
};
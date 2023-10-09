import TsukubaMap from "./TsukubaMap.tsx";

export default {
  component: TsukubaMap,
  title: "TsukubaMap",
};

const Template = (props) => <TsukubaMap {...props} />

export const Default = Template.bind({})
Default.args = {
  width: "800px",
  height: "500px",
};
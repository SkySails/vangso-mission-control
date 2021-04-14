import { Cartesian3, Transforms } from "cesium";
import React from "react";
import { Model } from "resium";

export default function Tracked() {
  // const [aircraft, setAircraft] = useState<OGNReport | undefined>(undefined);

  // const origin = Cartesian3.fromDegrees(
  //   aircraft?.lon || 0,
  //   aircraft?.lat || 0,
  //   aircraft?.alt || 1000
  // );

  const origin = Cartesian3.fromDegrees(17.215934, 59.10078, 43.4);
  const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getPositionReports().then((data) => setAircraft(data));
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <Model
      url={"assets/arcus.glb"}
      modelMatrix={modelMatrix}
      minimumPixelSize={128}
      scale={0.4}
    />
  );
}

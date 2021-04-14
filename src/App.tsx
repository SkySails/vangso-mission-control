import React, { useEffect } from "react";
import {
  Camera,
  CameraFlyTo,
  Cesium3DTileset,
  Entity,
  Viewer,
  Model,
} from "resium";
import {
  createWorldTerrain,
  IonResource,
  Cartesian3,
  Transforms,
} from "cesium";
import { getPositionReports } from "./lib/ogn";

const DEFAULT_LOCATION = Cartesian3.fromDegrees(17.215934, 59.10078, 200);
const AIRPLANE_LOCATION = Cartesian3.fromDegrees(13.345236, 57.98167, 0);
const pointGraphics = { pixelSize: 10 };

const origin = Cartesian3.fromDegrees(17.215934, 59.10078, 43.4);
const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);

const App = () => {
  useEffect(() => {
    // getPositionReports().then((data) => console.log(data));
  }, []);

  return (
    <Viewer
      full
      terrainProvider={createWorldTerrain()}
      animation={false}
      timeline={false}
    >
      <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
      <CameraFlyTo duration={0} destination={DEFAULT_LOCATION} />
      <Model
        url={"assets/glider.glb"}
        modelMatrix={modelMatrix}
        minimumPixelSize={128}
        scale={0.001}
      />
    </Viewer>
  );
};
export default App;

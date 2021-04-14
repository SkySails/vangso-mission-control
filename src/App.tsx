import { Cartesian3, createWorldTerrain, IonResource } from "cesium";
import React from "react";
import { CameraFlyTo, Cesium3DTileset, Viewer } from "resium";
import Tracked from "./components/Tracked";

const DEFAULT_LOCATION = Cartesian3.fromDegrees(17.215934, 59.10078, 200);
// const AIRPLANE_LOCATION = Cartesian3.fromDegrees(13.345236, 57.98167, 0);
// const pointGraphics = { pixelSize: 10 };

const App = () => {
  return (
    <Viewer
      full
      terrainProvider={createWorldTerrain()}
      animation={false}
      timeline={false}
    >
      <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
      <CameraFlyTo duration={0} destination={DEFAULT_LOCATION} />
      <Tracked />
    </Viewer>
  );
};
export default App;

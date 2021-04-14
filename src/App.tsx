import React from "react";
import { Camera, CameraFlyTo, Cesium3DTileset, Entity, Viewer } from "resium";
import { createWorldTerrain, IonResource, Cartesian3 } from "cesium";

const DEFAULT_LOCATION = Cartesian3.fromDegrees(13.345236, 57.98167, 30000);
const AIRPLANE_LOCATION = Cartesian3.fromDegrees(13.345236, 57.98167, 0);
const pointGraphics = { pixelSize: 10 };

const App = () => (
  <Viewer full terrainProvider={createWorldTerrain()}>
    <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
    <Camera defaultZoomAmount={0} />
    <CameraFlyTo duration={0} destination={DEFAULT_LOCATION} />
    <Entity position={AIRPLANE_LOCATION} point={pointGraphics} />
  </Viewer>
);
export default App;

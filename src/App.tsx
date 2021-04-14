import React from "react";
import { Cesium3DTileset, Viewer } from "resium";
import { createOsmBuildings, createWorldTerrain, IonResource } from "cesium";
const App = () => (
  <Viewer full terrainProvider={createWorldTerrain()}>
    <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
  </Viewer>
);
export default App;
